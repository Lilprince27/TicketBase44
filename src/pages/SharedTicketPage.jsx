import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { buildTicketUrl } from "@/lib/ticketUtils";
import TicketekLogo from "@/components/TicketekLogo";
import AppleWalletModal from "@/components/tickets/AppleWalletModal";
import AcceptTransferForm from "@/components/tickets/AcceptTransferForm";
import TransferTicketDetail from "@/components/tickets/TransferTicketDetail";

const TK_NAVY = "#001f2d";
const TK_GREEN = "#4e783e";
const TK_YELLOW = "#EFC44B";
const TK_DARK_BLUE = "#002d5c";

export default function SharedTicketPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [sharedRecord, setSharedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState("loading"); // loading | accept | processing | ticket_detail | declined | invalid
  const [busy, setBusy] = useState(false);
  const [showWallet, setShowWallet] = useState(null);

  useEffect(() => {
    if (!token) { setStep("invalid"); setLoading(false); return; }
    loadSharedTicket();
  }, [token]);

  const loadSharedTicket = async () => {
    try {
      const list = await base44.entities.SharedTicket.filter({ share_token: token });
      if (list.length === 0) { setStep("invalid"); setLoading(false); return; }
      const rec = list[0];
      setSharedRecord(rec);
      try { setTicket(JSON.parse(rec.ticket_snapshot)); } catch { setStep("invalid"); setLoading(false); return; }

      // If already accepted, show ticket detail (same as transfer)
      if (rec.accepted_by) { setStep("ticket_detail"); setLoading(false); return; }
      // If rejected, show declined screen
      if (rec.rejected_by) { setStep("declined"); setLoading(false); return; }

      // Go to login page (email pre-filled with recipient email)
      setStep("login");
      setLoading(false);
    } catch (e) {
      setStep("invalid");
      setLoading(false);
    }
  };

  const handleConfirmAccept = async () => {
    if (busy) return;
    setBusy(true);
    setStep("processing");
    try {
      // Re-fetch to check current status
      const fresh = await base44.entities.SharedTicket.filter({ share_token: token });
      const rec = fresh[0];
      if (!rec) { setStep("invalid"); setBusy(false); return; }
      if (rec.accepted_by) { setStep("ticket_detail"); setBusy(false); return; }

      // Parse ticket snapshot
      const ticketData = JSON.parse(rec.ticket_snapshot);

      // Mark as accepted using recipient email from record (or the accepted_by field)
      const accepterEmail = rec.recipient_email || rec.accepted_by || "";
      await base44.entities.SharedTicket.update(rec.id, {
        accepted_by: accepterEmail,
        accepted_date: new Date().toISOString(),
      });

      // Create audit log (same as transfer)
      try {
        await base44.entities.TransferAuditLog.create({
          transfer_id: rec.id,
          secure_token: token,
          action: "accepted",
          actor_email: accepterEmail,
          metadata: JSON.stringify({ order_number: ticketData.order_number }),
        });
      } catch (e) {}

      // Create ticket history (same as transfer)
      try {
        await base44.entities.TicketHistory.create({
          ticket_id: rec.id,
          ticket_name: ticketData.event_name || "Shared ticket",
          owner_email: rec.owner_email,
          action: "accepted",
          actor_email: accepterEmail,
          recipient_email: accepterEmail,
          details: `Ticket accepted via share link from ${rec.owner_email}`,
        });
      } catch (e) {}

      // Notify sender (same email template as transfer)
      try {
        const html = `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h2 style="color: #4ade80; margin: 0 0 8px;">Ticket Accepted!</h2>
            <p style="color: #fff; font-size: 14px; margin: 0;">Your ticket has been accepted by the recipient.</p>
          </div>
          <div style="background: #fff; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="color: #333; font-size: 14px; margin: 0 0 8px;"><strong>${ticketData.event_name || "Event"}</strong></p>
            <p style="color: #666; font-size: 13px; margin: 0 0 16px;">${ticketData.venue_name || ""} · ${ticketData.event_date || ""}</p>
            <p style="color: #333; font-size: 14px; margin: 0 0 24px;">The recipient (${accepterEmail}) has accepted the ticket. Your ticket remains in your wallet.</p>
            <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
          </div>
        </div>`;
        await base44.integrations.Core.SendEmail({
          to: rec.owner_email,
          subject: `Ticket accepted: ${ticketData.event_name || "Ticket"}`,
          body: html,
        });
      } catch (e) {}

      setTicket(ticketData);
      setTimeout(() => setStep("ticket_detail"), 1500);
    } catch (e) {
      setError(e.message || "Could not accept the ticket. Please try again.");
      setStep("accept_page");
    } finally {
      setBusy(false);
    }
  };

  const handleDecline = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const fresh = await base44.entities.SharedTicket.filter({ share_token: token });
      const rec = fresh[0];
      if (!rec) return;
      const declinerEmail = rec.recipient_email || "";
      await base44.entities.SharedTicket.update(rec.id, {
        rejected_by: declinerEmail,
        rejected_date: new Date().toISOString(),
      });
      try {
        await base44.entities.TransferAuditLog.create({
          transfer_id: rec.id,
          secure_token: token,
          action: "declined",
          actor_email: declinerEmail,
          metadata: "{}",
        });
      } catch (e) {}
      try {
        await base44.entities.TicketHistory.create({
          ticket_id: rec.id,
          ticket_name: ticket?.event_name || "Shared ticket",
          owner_email: rec.owner_email,
          action: "rejected",
          actor_email: declinerEmail,
          recipient_email: declinerEmail,
          details: `Ticket declined by ${declinerEmail}`,
        });
      } catch (e) {}
      setStep("declined");
    } catch (e) {
      setError("Could not decline the ticket.");
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
          <p style={{ color: "#666", fontSize: 15 }}>Loading ticket...</p>
        </div>
      )}

      {/* LOGIN — Ticketek sign-in page (email pre-filled with recipient email) */}
      {step === "login" && ticket && (
        <AcceptTransferForm
          senderName={(sharedRecord?.owner_email || "").split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "sender"}
          eventName={ticket.event_name || "event"}
          recipientEmail={sharedRecord?.recipient_email || ""}
          orderNumber={ticket.order_number}
          onSignIn={() => setStep("accept_page")}
          busy={busy}
          redirectPath={"/shared-ticket/" + token}
        />
      )}

      {/* ACCEPT PAGE — shown after Sign In, user clicks Accept Ticket */}
      {step === "accept_page" && ticket && (
        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Accept Shared Ticket</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 20px" }}>You have received a ticket from {sharedRecord?.owner_email}.</p>

          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e8e8e8", marginBottom: 12 }}>
            {ticket.event_image && <img src={ticket.event_image} alt={ticket.event_name} style={{ width: "100%", height: 140, objectFit: "cover" }} />}
            <div style={{ padding: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: "0 0 6px" }}>{ticket.event_name}</h3>
              <p style={{ fontSize: 13, color: "#666", margin: "0 0 2px" }}>{ticket.event_date}</p>
              <p style={{ fontSize: 13, color: "#666", margin: "0 0 12px" }}>{ticket.venue_name}</p>
              <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                  <p style={{ color: "#999", margin: "0 0 2px", fontSize: 10, textTransform: "uppercase" }}>Section</p>
                  <p style={{ color: "#111", fontWeight: 700, margin: 0 }}>{ticket.section_bay || "-"}</p>
                </div>
                <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                  <p style={{ color: "#999", margin: "0 0 2px", fontSize: 10, textTransform: "uppercase" }}>Row</p>
                  <p style={{ color: "#111", fontWeight: 700, margin: 0 }}>{ticket.row || "-"}</p>
                </div>
                <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                  <p style={{ color: "#999", margin: "0 0 2px", fontSize: 10, textTransform: "uppercase" }}>Seat</p>
                  <p style={{ color: "#111", fontWeight: 700, margin: 0 }}>{ticket.seat_number || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#f0f4ff", borderRadius: 10, padding: 14, marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TK_NAVY} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: 13, color: "#333", margin: 0, lineHeight: 1.4 }}>Click "Accept Ticket" to open your ticket on Ticketek and add it to your wallet.</p>
          </div>

          {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

          <button onClick={handleConfirmAccept} disabled={busy}
            style={{ display: "block", width: "100%", padding: "18px 0", borderRadius: 8, background: busy ? "#3a5e2e" : TK_GREEN, color: "#fff", fontWeight: 700, fontSize: 18, border: "none", cursor: busy ? "default" : "pointer", marginBottom: 12, boxShadow: "0 2px 8px rgba(78,120,62,0.3)", textAlign: "center" }}>
            {busy ? "Accepting…" : "Accept Ticket"}
          </button>
          <button onClick={handleDecline} disabled={busy} style={{ width: "100%", padding: "16px 0", borderRadius: 8, background: "transparent", color: "#ef4444", fontWeight: 600, fontSize: 16, border: "1px solid #ef4444", cursor: busy ? "default" : "pointer" }}>Decline</button>
        </div>
      )}

      {/* PROCESSING */}
      {step === "processing" && (
        <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <TicketekLogo size={48} variant="color" />
          <div style={{ width: 40, height: 40, margin: "24px auto 16px", border: "3px solid #e0e0e0", borderTopColor: TK_NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 18, fontWeight: 600, color: "#111", margin: 0 }}>Verifying your ticket...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* TICKET DETAIL — same TransferTicketDetail as transfer flow, with only Apple Wallet button */}
      {step === "ticket_detail" && ticket && (
        <TransferTicketDetail ticket={ticket} onBack={() => navigate("/")} />
      )}

      {/* DECLINED */}
      {step === "declined" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Ticket Declined</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>You have declined this ticket. The sender has been notified.</p>
          <Link to="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>Done</Link>
        </div>
      )}

      {/* INVALID */}
      {step === "invalid" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#ffeaea", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Invalid Link</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>{error || "This ticket link is invalid or has been removed."}</p>
          <Link to="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>Done</Link>
        </div>
      )}
    </div>
  );
}