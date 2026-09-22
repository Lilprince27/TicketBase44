import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { buildTicketUrl, buildTicketekMobiUrl } from "@/lib/ticketUtils";
import AppleWalletModal from "@/components/tickets/AppleWalletModal";
import TicketekLogo from "@/components/TicketekLogo";
import AcceptTransferForm from "@/components/tickets/AcceptTransferForm";

const YELLOW = "#F8E71C";
const TK_NAVY = "#001f2d";
const TK_YELLOW = "#fecb3e";
const TK_GREEN = "#4e783e";
const TK_DARK_BLUE = "#002d5c";

export default function SharedTicketPage() {
  const { token } = useParams();
  const [ticket, setTicket] = useState(null);
  const [sharedRecord, setSharedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState("preview"); // preview | login | accept | accepted | rejected
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showWallet, setShowWallet] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return; }
    base44.entities.SharedTicket.filter({ share_token: token }).then(list => {
      if (list.length > 0) {
        const rec = list[0];
        setSharedRecord(rec);
        try { setTicket(JSON.parse(rec.ticket_snapshot)); }
        catch { setNotFound(true); }
        if (rec.accepted_by) {
          setEmail(rec.accepted_by);
          setStep("accepted");
        } else if (rec.rejected_by) {
          setStep("rejected");
        } else if (rec.recipient_email) {
          setEmail(rec.recipient_email);
        }
      } else {
        setNotFound(true);
      }
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (step !== "login") return;
    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(email.trim());

  const handleLogin = () => {
    if (!emailValid) { setError("Please enter a valid email address."); return; }
    if (sharedRecord?.recipient_email && email.trim().toLowerCase() !== sharedRecord.recipient_email.trim().toLowerCase()) {
      setError("This email does not match the email this ticket was sent to.");
      return;
    }
    setError("");
    setStep("accept");
  };

  const handleAccept = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const fresh = await base44.entities.SharedTicket.filter({ share_token: token });
      const rec = fresh[0];
      if (!rec) { setError("This ticket link is no longer available."); return; }
      if (rec.accepted_by) {
        setEmail(rec.accepted_by);
        setStep("accepted");
        return;
      }
      await base44.entities.SharedTicket.update(rec.id, {
        accepted_by: email.trim(),
        accepted_date: new Date().toISOString(),
      });

      // Notify the sender that their ticket was accepted
      try {
        const html = buildAcceptanceEmailHtml(ticket, email.trim(), rec.owner_email);
        await base44.integrations.Core.SendEmail({
          to: rec.owner_email,
          subject: `Ticket accepted: ${ticket?.event_name || "Shared ticket"}`,
          body: html,
        });
      } catch (e) {}

      // Create history record
      try {
        await base44.entities.TicketHistory.create({
          ticket_id: rec.id,
          ticket_name: ticket?.event_name || "Shared ticket",
          owner_email: rec.owner_email,
          action: "accepted",
          actor_email: email.trim(),
          recipient_email: email.trim(),
          details: `Ticket accepted by ${email.trim()}`,
        });
      } catch (e) {}

      setSharedRecord({ ...rec, accepted_by: email.trim() });
      setStep("accepted");
    } catch (e) {
      setError("Could not accept the ticket. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const fresh = await base44.entities.SharedTicket.filter({ share_token: token });
      const rec = fresh[0];
      if (!rec) { setError("This ticket link is no longer available."); return; }
      await base44.entities.SharedTicket.update(rec.id, {
        rejected_by: email.trim(),
        rejected_date: new Date().toISOString(),
      });

      // Create history record
      try {
        await base44.entities.TicketHistory.create({
          ticket_id: rec.id,
          ticket_name: ticket?.event_name || "Shared ticket",
          owner_email: rec.owner_email,
          action: "rejected",
          actor_email: email.trim(),
          recipient_email: email.trim(),
          details: `Ticket declined by ${email.trim()}`,
        });
      } catch (e) {}

      // Notify sender
      try {
        const html = buildRejectionEmailHtml(ticket, email.trim());
        await base44.integrations.Core.SendEmail({
          to: rec.owner_email,
          subject: `Ticket rejected: ${ticket?.event_name || "Shared ticket"}`,
          body: html,
        });
      } catch (e) {
        // Email may fail if unauthenticated; rejection is still recorded
      }
      setStep("rejected");
    } catch (e) {
      setError("Could not reject the ticket. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#000" }}>
        <div className="w-8 h-8 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-6 text-center" style={{ background: "#000" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#3a1a1a" }}>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Ticket not available</h2>
        <p className="text-gray-400">This secure ticket link is invalid or has been removed.</p>
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(buildTicketUrl(ticket.serial_number))}`;
  const venueUpper = (ticket.venue_name || "").toUpperCase();
  const levelLabel = ticket.level_stand || "Floor Level";

  const renderTicketCard = () => (
    <div style={{ margin: "0 12px 12px", background: "#121212", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ background: "#000", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>TICKETEK</span>
        <span style={{ color: "#fff", fontSize: 13 }}>{ticket.event_date}</span>
      </div>
      <div style={{ padding: "12px 18px 14px" }}>
        <h1 style={{ color: YELLOW, fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>{ticket.event_name}</h1>
      </div>
      {ticket.event_image && (
        <div style={{ width: "100%" }}>
          <img src={ticket.event_image} alt={ticket.event_name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
        </div>
      )}
      <div style={{ padding: "16px 18px 6px" }}>
        <p style={{ color: YELLOW, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, margin: "0 0 8px", textTransform: "uppercase" }}>{venueUpper}</p>
        <p style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>{levelLabel}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 18px 20px", gap: 8 }}>
        {[
          { label: "SECTION", val: ticket.section_bay || "-" },
          { label: "ROW/SEAT", val: `${ticket.row || "-"} / ${ticket.seat_number || "-"}` },
          { label: "DOOR/GATE", val: ticket.door_area || ticket.entry_gate || "-" },
        ].map(col => (
          <div key={col.label} style={{ flex: 1, textAlign: "center" }}>
            <span style={{ display: "block", fontSize: 10, color: "#9a9a9a", letterSpacing: 0.5, marginBottom: 4 }}>{col.label}</span>
            <strong style={{ display: "block", fontSize: 15, color: "#fff", fontWeight: 700 }}>{col.val}</strong>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 18px 22px", display: "flex", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 14 }}>
          <img src={qrUrl} alt="QR Code" style={{ width: 180, height: 180, display: "block" }} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ margin: "0 auto", background: "#000", minHeight: "100vh", fontFamily: "-apple-system, system-ui, sans-serif", maxWidth: 500, color: "#fff" }}>
      {showWallet && <AppleWalletModal ticket={ticket} onClose={() => setShowWallet(false)} />}

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 18px" }}>
        <Link to="/" style={{ color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>Done</Link>
      </div>

      {/* PREVIEW STEP */}
      {step === "preview" && (
        <>
          <div style={{ padding: "0 18px 16px" }}>
            <p style={{ color: YELLOW, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>A ticket has been shared with you</p>
            {ticket.sender_name && <p style={{ color: "#9a9a9a", fontSize: 14, margin: "6px 0 0" }}>Shared by {ticket.sender_name}</p>}
          </div>
          {renderTicketCard()}
          <div style={{ padding: "0 18px 30px" }}>
            <button onClick={() => setStep("accept")} style={{ width: "100%", padding: "16px 0", borderRadius: 12, background: "#fff", color: "#000", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
              Continue to Accept
            </button>
          </div>
        </>
      )}

      {/* LOGIN STEP — Ticketek-style login page */}
      {step === "login" && (
        <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "-apple-system, system-ui, sans-serif" }}>
          {/* Navy header */}
          <div style={{ background: TK_NAVY, padding: "14px 18px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <TicketekLogo size={24} variant="white" />
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </div>
            </div>
            {/* Search bar */}
            <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 4, overflow: "hidden" }}>
              <input type="text" placeholder="Look up shows by artist, city, or venue..." readOnly
                style={{ flex: 1, padding: "10px 14px", border: "none", outline: "none", fontSize: 14, color: "#333", background: "transparent" }} />
              <button style={{ background: "#e9e9e9", border: "none", padding: "10px 14px", cursor: "default", display: "flex", alignItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Yellow timer banner */}
          <div style={{ background: TK_YELLOW, padding: "10px 18px", textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>Time remaining {formatTime(countdown)}</span>
          </div>

          {/* Sign in form */}
          <div style={{ padding: "32px 24px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#000", margin: 0 }}>Sign in</h2>
              <span style={{ fontSize: 13, color: "#666" }}>*Required</span>
            </div>

            {/* Email field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 6 }}>Email*</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder=""
                style={{ width: "100%", padding: "14px 16px", borderRadius: 4, border: "1px solid #ccc", color: "#000", fontSize: 16, outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 6 }}>Password*</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder=""
                style={{ width: "100%", padding: "14px 16px", borderRadius: 4, border: "1px solid #ccc", color: "#000", fontSize: 16, outline: "none", boxSizing: "border-box" }} />
            </div>

            {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

            {/* Sign in button */}
            <button onClick={handleLogin} disabled={!emailValid}
              style={{ width: "100%", padding: "16px 0", borderRadius: 4, background: emailValid ? TK_GREEN : "#9cb89a", color: "#fff", fontWeight: 700, fontSize: 17, border: "none", cursor: emailValid ? "pointer" : "default", letterSpacing: 0.5 }}>
              Sign In
            </button>

            {/* Reset password link */}
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <span style={{ color: TK_DARK_BLUE, fontSize: 15, fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>Reset Password</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "40px 24px 30px", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>
              We treat your personal data with care. Please find our Privacy Policy here.
            </p>
          </div>

          {/* Back link */}
          <div style={{ padding: "0 24px 30px", textAlign: "center" }}>
            <button onClick={() => { setStep("preview"); setError(""); }}
              style={{ background: "transparent", color: TK_DARK_BLUE, fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer" }}>
              ← Back to ticket
            </button>
          </div>
        </div>
      )}

      {/* ACCEPT STEP — Sign in / Create account page (matches official Ticketek design) */}
      {step === "accept" && (
        <AcceptTransferForm
          senderName={ticket?.sender_name || (sharedRecord?.owner_email || "").split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "sender"}
          eventName={ticket?.event_name || "event"}
          orderNumber={ticket?.order_number}
          onAccept={handleAccept}
          busy={busy}
          redirectPath={"/shared-ticket/" + token}
        />
      )}

      {/* ACCEPTED STEP */}
      {step === "accepted" && (
        <>
          <div style={{ padding: "0 18px 16px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, margin: "0 auto 10px", borderRadius: "50%", background: "#1a3a20", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ color: "#4ade80", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Ticket Accepted!</h2>
            <p style={{ color: "#9a9a9a", fontSize: 13, margin: 0 }}>Add it to your Apple Wallet below, or sign up with {email} to save it to your Ticketek wallet.</p>
          </div>
          {renderTicketCard()}
          <div style={{ padding: "0 18px 22px" }}>
            <a href={buildTicketekMobiUrl(ticket.order_number)} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px 0", borderRadius: 12, background: "#000", color: "#fff", fontWeight: 600, fontSize: 16, border: "1px solid #fff", cursor: "pointer", textDecoration: "none" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
              Add to Wallet
            </a>
          </div>
          <div className="selectable-text" style={{ padding: "4px 18px 30px", fontSize: 10.5, color: "#666", lineHeight: 1.5 }}>
            <p style={{ margin: "0 0 6px" }}><strong>Ticketek Pty Limited ABN 92 010 129 110</strong></p>
            <p style={{ margin: 0 }}>Each mobile ticket has a unique barcode that allows one entry only. Do not duplicate or forward this ticket. This ticket was shared with you via a secure link{ticket.sender_name ? ` by ${ticket.sender_name}` : ""}.</p>
          </div>
        </>
      )}

      {/* REJECTED STEP */}
      {step === "rejected" && (
        <div style={{ padding: "40px 18px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#3a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>Ticket Declined</h2>
          <p style={{ color: "#9a9a9a", fontSize: 14, margin: "0 0 6px" }}>You have declined this ticket.</p>
          <p style={{ color: "#9a9a9a", fontSize: 14, margin: "0 0 30px" }}>The sender has been notified.</p>
          <Link to="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 12, background: "#fff", color: "#000", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>Done</Link>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function buildAcceptanceEmailHtml(ticket, recipientEmail, senderEmail) {
  return `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
    <div style="background: #000; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
      <h2 style="color: #4ade80; margin: 0 0 8px;">Ticket Accepted!</h2>
      <p style="color: #fff; font-size: 14px; margin: 0;">Your shared ticket has been accepted by the recipient.</p>
    </div>
    <div style="background: #fff; padding: 24px; border-radius: 0 0 12px 12px;">
      <p style="color: #333; font-size: 14px; margin: 0 0 16px;">Hi,</p>
      <p style="color: #333; font-size: 14px; margin: 0 0 8px;"><strong>${ticket?.event_name || "Event"}</strong></p>
      <p style="color: #666; font-size: 13px; margin: 0 0 16px;">${ticket?.venue_name || ""} · ${ticket?.event_date || ""}</p>
      <p style="color: #333; font-size: 14px; margin: 0 0 8px;">Good news! The recipient (${recipientEmail}) has accepted the ticket you shared.</p>
      <p style="color: #333; font-size: 14px; margin: 0 0 24px;">The ticket has been added to their wallet.</p>
      <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
    </div>
  </div>`;
}

function buildRejectionEmailHtml(ticket, recipientEmail) {
  return `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
    <div style="background: #000; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
      <h2 style="color: #F8E71C; margin: 0 0 8px;">Ticket Rejected</h2>
      <p style="color: #fff; font-size: 14px; margin: 0;">Your shared ticket was declined by the recipient.</p>
    </div>
    <div style="background: #fff; padding: 24px; border-radius: 0 0 12px 12px;">
      <p style="color: #333; font-size: 14px; margin: 0 0 16px;">Hi,</p>
      <p style="color: #333; font-size: 14px; margin: 0 0 8px;"><strong>${ticket?.event_name || "Event"}</strong></p>
      <p style="color: #666; font-size: 13px; margin: 0 0 16px;">${ticket?.venue_name || ""} · ${ticket?.event_date || ""}</p>
      <p style="color: #333; font-size: 14px; margin: 0 0 8px;">The recipient (${recipientEmail}) has declined the ticket you shared.</p>
      <p style="color: #333; font-size: 14px; margin: 0 0 24px;">You can share this ticket with someone else from your Ticketek app.</p>
      <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
    </div>
  </div>`;
}