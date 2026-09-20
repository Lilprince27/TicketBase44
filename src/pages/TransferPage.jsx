import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { buildTicketUrl } from "@/lib/ticketUtils";
import TicketekLogo from "@/components/TicketekLogo";
import AppleWalletModal from "@/components/tickets/AppleWalletModal";

const TK_NAVY = "#001f2d";
const TK_GREEN = "#4e783e";
const TK_YELLOW = "#EFC44B";
const TK_DARK_BLUE = "#002d5c";

export default function TransferPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [transfer, setTransfer] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState("loading"); // loading | review | auth_required | confirm | processing | accepted | declined | expired | invalid
  const [busy, setBusy] = useState(false);
  const [acceptedTickets, setAcceptedTickets] = useState([]);
  const [showWallet, setShowWallet] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!token) { setStep("invalid"); setLoading(false); return; }
    loadTransfer();
  }, [token]);

  const loadTransfer = async () => {
    try {
      const list = await base44.entities.TicketTransfer.filter({ secure_token: token });
      if (list.length === 0) { setStep("invalid"); setLoading(false); return; }
      const rec = list[0];
      setTransfer(rec);
      try { setTicket(JSON.parse(rec.ticket_snapshot)); } catch { setStep("invalid"); setLoading(false); return; }

      // Check expiration
      if (rec.status === "expired" || (rec.status === "pending" && new Date(rec.expires_at) < new Date())) {
        setStep("expired"); setLoading(false); return;
      }
      if (rec.status === "accepted") { setStep("accepted"); setLoading(false); return; }
      if (rec.status === "declined") { setStep("declined"); setLoading(false); return; }
      if (rec.status === "cancelled") { setStep("invalid"); setLoading(false); return; }

      // Check auth
      try {
        const me = await base44.auth.me();
        setCurrentUser(me);
        setIsAuthenticated(true);
        setStep("review");
      } catch {
        setIsAuthenticated(false);
        setStep("auth_required");
      }
      setLoading(false);
    } catch (e) {
      setStep("invalid");
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setStep("confirm");
  };

  const handleConfirmAccept = async () => {
    if (busy) return;
    setBusy(true);
    setStep("processing");
    try {
      // Re-fetch to check current status (prevent race conditions)
      const fresh = await base44.entities.TicketTransfer.filter({ secure_token: token });
      const rec = fresh[0];
      if (!rec) { setStep("invalid"); setBusy(false); return; }
      if (rec.status === "accepted") { setStep("accepted"); setBusy(false); return; }
      if (rec.status !== "pending") { setError("This transfer is no longer available."); setStep("invalid"); setBusy(false); return; }
      if (new Date(rec.expires_at) < new Date()) { setStep("expired"); setBusy(false); return; }

      // Get current user
      const me = await base44.auth.me();
      if (!me) { setStep("auth_required"); setBusy(false); return; }

      // Verify recipient email matches
      if (rec.recipient_email.trim().toLowerCase() !== me.email.trim().toLowerCase()) {
        setError("This transfer was sent to a different email address. Please log in with the correct email.");
        setStep("invalid");
        setBusy(false);
        return;
      }

      // Parse ticket snapshot
      const ticketData = JSON.parse(rec.ticket_snapshot);

      // Create ticket in recipient's account
      const newTicket = await base44.entities.Ticket.create({
        ...ticketData,
        owner_email: me.email,
        transfer_status: "active",
        active_transfer_id: null,
      });

      // Mark original ticket as transferred
      try {
        const originalTickets = await base44.entities.Ticket.filter({ id: ticketData.id || "" });
        if (originalTickets.length > 0) {
          await base44.entities.Ticket.update(originalTickets[0].id, {
            transfer_status: "transferred",
            active_transfer_id: null,
          });
        }
      } catch (e) {}

      // Mark transfer as accepted
      await base44.entities.TicketTransfer.update(rec.id, {
        status: "accepted",
        accepted_at: new Date().toISOString(),
        recipient_user_id: me.id,
      });

      // Create audit log
      try {
        await base44.entities.TransferAuditLog.create({
          transfer_id: rec.id,
          secure_token: token,
          action: "accepted",
          actor_email: me.email,
          metadata: JSON.stringify({ ticket_id: newTicket.id }),
        });
      } catch (e) {}

      // Create ticket history
      try {
        await base44.entities.TicketHistory.create({
          ticket_id: newTicket.id,
          ticket_name: ticketData.event_name || "Transferred ticket",
          owner_email: me.email,
          action: "accepted",
          actor_email: me.email,
          recipient_email: me.email,
          details: `Ticket accepted via transfer from ${rec.sender_email}`,
        });
      } catch (e) {}

      // Notify sender
      try {
        const html = `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h2 style="color: #4ade80; margin: 0 0 8px;">Ticket Transfer Accepted!</h2>
            <p style="color: #fff; font-size: 14px; margin: 0;">Your ticket has been accepted by the recipient.</p>
          </div>
          <div style="background: #fff; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="color: #333; font-size: 14px; margin: 0 0 8px;"><strong>${ticketData.event_name || "Event"}</strong></p>
            <p style="color: #666; font-size: 13px; margin: 0 0 16px;">${ticketData.venue_name || ""} · ${ticketData.event_date || ""}</p>
            <p style="color: #333; font-size: 14px; margin: 0 0 24px;">The recipient (${me.email}) has accepted the ticket. It has been added to their account and is no longer under your control.</p>
            <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
          </div>
        </div>`;
        await base44.integrations.Core.SendEmail({
          to: rec.sender_email,
          subject: `Ticket transfer accepted: ${ticketData.event_name || "Ticket"}`,
          body: html,
        });
      } catch (e) {}

      setAcceptedTickets([newTicket]);
      setTimeout(() => setStep("accepted"), 1800);
    } catch (e) {
      setError(e.message || "Could not accept the transfer. Please try again.");
      setStep("review");
    } finally {
      setBusy(false);
    }
  };

  const handleDecline = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const fresh = await base44.entities.TicketTransfer.filter({ secure_token: token });
      const rec = fresh[0];
      if (!rec) return;
      await base44.entities.TicketTransfer.update(rec.id, {
        status: "declined",
        declined_at: new Date().toISOString(),
      });
      try {
        await base44.entities.TransferAuditLog.create({
          transfer_id: rec.id,
          secure_token: token,
          action: "declined",
          actor_email: currentUser?.email || rec.recipient_email,
          metadata: "{}",
        });
      } catch (e) {}
      // Restore ticket to active
      try {
        const ticketData = JSON.parse(rec.ticket_snapshot);
        if (ticketData.id) {
          const origTickets = await base44.entities.Ticket.filter({ id: ticketData.id });
          if (origTickets.length > 0) {
            await base44.entities.Ticket.update(origTickets[0].id, {
              transfer_status: "active",
              active_transfer_id: null,
            });
          }
        }
      } catch (e) {}
      setStep("declined");
    } catch (e) {
      setError("Could not decline the transfer.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #e0e0e0", borderTopColor: TK_NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const renderTicketCard = (t) => (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e8e8e8", marginBottom: 12 }}>
      {t.event_image && <img src={t.event_image} alt={t.event_name} style={{ width: "100%", height: 140, objectFit: "cover" }} />}
      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: "0 0 6px" }}>{t.event_name}</h3>
        <p style={{ fontSize: 13, color: "#666", margin: "0 0 2px" }}>{t.event_date}</p>
        <p style={{ fontSize: 13, color: "#666", margin: "0 0 12px" }}>{t.venue_name}</p>
        <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
          <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
            <p style={{ color: "#999", margin: "0 0 2px", fontSize: 10, textTransform: "uppercase" }}>Section</p>
            <p style={{ color: "#111", fontWeight: 700, margin: 0 }}>{t.section_bay || "-"}</p>
          </div>
          <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
            <p style={{ color: "#999", margin: "0 0 2px", fontSize: 10, textTransform: "uppercase" }}>Row</p>
            <p style={{ color: "#111", fontWeight: 700, margin: 0 }}>{t.row || "-"}</p>
          </div>
          <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
            <p style={{ color: "#999", margin: "0 0 2px", fontSize: 10, textTransform: "uppercase" }}>Seat</p>
            <p style={{ color: "#111", fontWeight: 700, margin: 0 }}>{t.seat_number || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "-apple-system, system-ui, sans-serif", maxWidth: 500, margin: "0 auto" }}>
      {showWallet && <AppleWalletModal ticket={showWallet} onClose={() => setShowWallet(null)} />}

      {/* Header */}
      <div style={{ background: TK_NAVY, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none" }}><TicketekLogo size={26} variant="white" /></Link>
        <Link to="/" style={{ color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>Done</Link>
      </div>

      {/* LOADING */}
      {step === "loading" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 36, height: 36, margin: "0 auto 16px", border: "3px solid #e0e0e0", borderTopColor: TK_NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#666", fontSize: 15 }}>Loading transfer...</p>
        </div>
      )}

      {/* AUTH REQUIRED */}
      {step === "auth_required" && (
        <div style={{ padding: 24 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: "50%", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={TK_NAVY} strokeWidth="1.8"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Sign in to accept this ticket</h2>
            <p style={{ fontSize: 14, color: "#666", margin: 0 }}>Sign in to your Ticketek account to accept this ticket transfer.</p>
          </div>
          {ticket && renderTicketCard(ticket)}
          <div style={{ marginTop: 20 }}>
            <Link to={`/login?next=${encodeURIComponent("/transfer/" + token)}`} style={{ display: "block", width: "100%", padding: "16px 0", borderRadius: 8, background: TK_GREEN, color: "#fff", fontWeight: 700, fontSize: 17, textAlign: "center", textDecoration: "none", marginBottom: 12 }}>Sign In</Link>
            <Link to={`/login?next=${encodeURIComponent("/transfer/" + token)}&mode=signup`} style={{ display: "block", width: "100%", padding: "16px 0", borderRadius: 8, background: "transparent", color: TK_NAVY, fontWeight: 700, fontSize: 17, textAlign: "center", textDecoration: "none", border: "2px solid " + TK_NAVY }}>Create Ticketek Account</Link>
          </div>
        </div>
      )}

      {/* REVIEW / CONFIRM */}
      {(step === "review" || step === "confirm") && ticket && (
        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Accept Transferred Tickets</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 20px" }}>You have received {transfer?.ticket_count || 1} ticket(s) from {transfer?.sender_email}.</p>

          {renderTicketCard(ticket)}

          <div style={{ background: "#f0f4ff", borderRadius: 10, padding: 14, marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TK_NAVY} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: 13, color: "#333", margin: 0, lineHeight: 1.4 }}>These tickets will be added to your Ticketek account after you accept the transfer.</p>
          </div>

          {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

          {/* CONFIRM MODAL */}
          {step === "confirm" && (
            <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
              onClick={() => setStep("review")}>
              <div style={{ background: "#fff", width: "100%", maxWidth: 500, borderRadius: "20px 20px 0 0", padding: 28 }}
                onClick={e => e.stopPropagation()}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 10px" }}>Accept Ticket Transfer?</h3>
                <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px", lineHeight: 1.5 }}>After accepting, these tickets will be added to your Ticketek account and the sender will no longer control the transferred tickets.</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep("review")} style={{ flex: 1, padding: "16px 0", borderRadius: 8, background: "transparent", color: "#666", fontWeight: 600, fontSize: 16, border: "1px solid #ddd", cursor: "pointer" }}>Cancel</button>
                  <button onClick={handleConfirmAccept} disabled={busy} style={{ flex: 1, padding: "16px 0", borderRadius: 8, background: TK_GREEN, color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: busy ? "default" : "pointer" }}>Accept Transfer</button>
                </div>
              </div>
            </div>
          )}

          <button onClick={handleAccept} style={{ width: "100%", padding: "18px 0", borderRadius: 8, background: TK_GREEN, color: "#fff", fontWeight: 700, fontSize: 18, border: "none", cursor: "pointer", marginBottom: 12, boxShadow: "0 2px 8px rgba(78,120,62,0.3)" }}>Accept Ticket Transfer</button>
          <button onClick={handleDecline} disabled={busy} style={{ width: "100%", padding: "16px 0", borderRadius: 8, background: "transparent", color: "#ef4444", fontWeight: 600, fontSize: 16, border: "1px solid #ef4444", cursor: busy ? "default" : "pointer" }}>Decline</button>
        </div>
      )}

      {/* PROCESSING */}
      {step === "processing" && (
        <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <TicketekLogo size={48} variant="color" />
          <div style={{ width: 40, height: 40, margin: "24px auto 16px", border: "3px solid #e0e0e0", borderTopColor: TK_NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 18, fontWeight: 600, color: "#111", margin: 0 }}>Verifying your tickets...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ACCEPTED */}
      {step === "accepted" && ticket && (
        <div style={{ padding: 24 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, margin: "0 auto 12px", borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: "0 0 6px" }}>Transfer Accepted</h2>
            <p style={{ fontSize: 14, color: "#666", margin: 0 }}>You have successfully accepted your tickets.</p>
          </div>

          {acceptedTickets.map((t, i) => (
            <div key={t.id || i}>
              {renderTicketCard(t)}
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <Link to={`/ticket-detail/${t.id}`} style={{ flex: 1, display: "block", padding: "14px 0", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none" }}>View Ticket</Link>
                <button onClick={() => setShowWallet(t)} style={{ flex: 1, padding: "14px 0", borderRadius: 8, background: "#000", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
                  Apple Wallet
                </button>
              </div>
            </div>
          ))}

          <Link to="/tickets" style={{ display: "block", width: "100%", padding: "16px 0", borderRadius: 8, background: "transparent", color: TK_NAVY, fontWeight: 700, fontSize: 16, textAlign: "center", textDecoration: "none", border: "2px solid " + TK_NAVY, marginTop: 12 }}>Go to My Tickets</Link>
        </div>
      )}

      {/* DECLINED */}
      {step === "declined" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Transfer Declined</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>You have declined this ticket transfer. The sender has been notified.</p>
          <Link to="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>Done</Link>
        </div>
      )}

      {/* EXPIRED */}
      {step === "expired" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#fff7e6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e6a700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Transfer Expired</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>The ticket transfer is no longer available. Please ask the sender to send the ticket again.</p>
          <Link to="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>Done</Link>
        </div>
      )}

      {/* INVALID */}
      {step === "invalid" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#ffeaea", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Invalid Transfer</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>{error || "This transfer link is invalid or has been cancelled."}</p>
          <Link to="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>Done</Link>
        </div>
      )}
    </div>
  );
}