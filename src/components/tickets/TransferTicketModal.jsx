import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { generateSecureToken, buildTransferUrl, APP_BASE_URL } from "@/lib/ticketUtils";
import { assertEmailQuotaAvailable, decrementEmailQuota } from "@/lib/emailQuota";

const TK_NAVY = "#001f2d";
const TK_GREEN = "#4e783e";
const TK_YELLOW = "#EFC44B";

export default function TransferTicketModal({ ticket, user, onClose }) {
  const [step, setStep] = useState("form"); // form | confirm | sending | sent | error
  const [recipientEmail, setRecipientEmail] = useState("");
  const [error, setError] = useState("");
  const [transferUrl, setTransferUrl] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(recipientEmail.trim());
  const isSelf = recipientEmail.trim().toLowerCase() === (user?.email || "").toLowerCase();

  const handleConfirm = async () => {
    if (!emailValid) { setError("Please enter a valid email address."); return; }
    if (isSelf) { setError("You cannot transfer a ticket to yourself."); return; }
    setError("");
    setStep("confirm");
  };

  const handleTransfer = async () => {
    setStep("sending");
    setError("");
    try {
      // Check unified email quota (share + transfer share the same counter)
      const quotaState = await assertEmailQuotaAvailable();

      const token = generateSecureToken();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 hours
      const ticketSnapshot = JSON.stringify(ticket);
      const url = buildTransferUrl(token);

      // Create the transfer record
      const transfer = await base44.entities.TicketTransfer.create({
        secure_token: token,
        ticket_snapshot: ticketSnapshot,
        sender_email: user.email,
        recipient_email: recipientEmail.trim(),
        status: "pending",
        expires_at: expiresAt,
        event_name: ticket.event_name,
        event_date: ticket.event_date,
        venue_name: ticket.venue_name,
        ticket_count: 1,
      });

      // Note: sender's ticket stays in their wallet (transfer_status unchanged)
      // Create audit log
      try {
        await base44.entities.TransferAuditLog.create({
          transfer_id: transfer.id,
          secure_token: token,
          action: "created",
          actor_email: user.email,
          metadata: JSON.stringify({ recipient_email: recipientEmail.trim() }),
        });
      } catch (e) {}

      // Send transfer email
      try {
        const html = buildTransferEmailHtml(ticket, url, recipientEmail.trim(), user.email);
        await base44.integrations.Core.SendEmail({
          to: recipientEmail.trim(),
          subject: "You've received a Ticketek ticket transfer",
          body: html,
        });
      } catch (e) {}

      // Create ticket history
      try {
        await base44.entities.TicketHistory.create({
          ticket_id: ticket.id,
          ticket_name: ticket.event_name,
          owner_email: user.email,
          action: "transferred",
          actor_email: user.email,
          recipient_email: recipientEmail.trim(),
          details: `Ticket transfer initiated to ${recipientEmail.trim()}`,
        });
      } catch (e) {}

      // Decrement the unified email quota (share + transfer share the same counter)
      try {
        await decrementEmailQuota(quotaState);
      } catch (e) {
        console.warn("[quota] decrement failed:", e);
      }

      setTransferUrl(url);
      setStep("sent");
    } catch (e) {
      setError(e.message || "Could not initiate transfer. Please try again.");
      setStep("error");
    }
  };

  const handleCancelTransfer = async () => {
    // Allow sender to cancel a pending or accepted transfer
    try {
      const token = transferUrl.split("/transfer/")[1];
      const transfers = await base44.entities.TicketTransfer.filter({ secure_token: token });
      const rec = transfers[0];
      if (!rec) { onClose(); return; }
      await base44.entities.TicketTransfer.update(rec.id, {
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      });
      await base44.entities.TransferAuditLog.create({
        transfer_id: rec.id,
        secure_token: rec.secure_token,
        action: "cancelled",
        actor_email: user.email,
        metadata: JSON.stringify({ previous_status: rec.status }),
      });
      try {
        await base44.entities.TicketHistory.create({
          ticket_name: ticket.event_name,
          owner_email: user.email,
          action: "cancelled",
          actor_email: user.email,
          recipient_email: rec.recipient_email,
          details: `Transfer cancelled by sender (was ${rec.status})`,
        });
      } catch (e) {}
      // Send cancellation email to recipient
      try {
        const html = `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h2 style="color: #fff; margin: 0 0 8px;">Ticket Transfer Cancelled</h2>
            <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">The sender has cancelled this ticket transfer.</p>
          </div>
          <div style="background: #fff; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="background: #f8f9fa; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
              <p style="color: #001f2d; font-size: 18px; font-weight: 700; margin: 0 0 8px;">${ticket.event_name || "Event"}</p>
              <p style="color: #666; font-size: 14px; margin: 0 0 4px;"><strong>Date:</strong> ${ticket.event_date || "TBD"}</p>
              <p style="color: #666; font-size: 14px; margin: 0;"><strong>Venue:</strong> ${ticket.venue_name || "TBD"}</p>
            </div>
            <p style="color: #333; font-size: 14px; margin: 0 0 16px; line-height: 1.5;">
              The ticket transfer from ${user.email} has been cancelled. The transfer link is no longer valid.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
          </div>
        </div>`;
        await base44.integrations.Core.SendEmail({
          to: rec.recipient_email,
          subject: `Ticket transfer cancelled: ${ticket.event_name || "Ticket"}`,
          body: html,
        });
      } catch (e) {}
    } catch (e) {}
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 500, borderRadius: "20px 20px 0 0", maxHeight: "90vh", overflowY: "auto", fontFamily: "-apple-system, system-ui, sans-serif" }}
        onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ background: TK_NAVY, padding: "20px 20px 16px", borderRadius: "20px 20px 0 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Transfer Ticket</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* FORM STEP */}
        {step === "form" && (
          <div style={{ padding: 24 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 6 }}>You are transferring this ticket to:</label>
            <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} placeholder="recipient@email.com"
              style={{ width: "100%", padding: "14px 16px", borderRadius: 8, border: "1px solid #ccc", fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 20 }} />

            {/* Ticket summary */}
            <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: TK_NAVY, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>Tickets:</p>
              <div style={{ marginBottom: 4 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>{ticket.event_name}</p>
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 2px" }}>{ticket.event_date}</p>
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 2px" }}>{ticket.venue_name}</p>
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 2px" }}>Section: {ticket.section_bay || "-"}</p>
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 2px" }}>Row: {ticket.row || "-"}  ·  Seat: {ticket.seat_number || "-"}</p>
              </div>
            </div>

            {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "16px 0", borderRadius: 8, background: "transparent", color: "#666", fontWeight: 600, fontSize: 16, border: "1px solid #ddd", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleConfirm} disabled={!emailValid}
                style={{ flex: 1, padding: "16px 0", borderRadius: 8, background: emailValid ? TK_NAVY : "#ccc", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: emailValid ? "pointer" : "default" }}>Transfer Ticket</button>
            </div>
          </div>
        )}

        {/* CONFIRM STEP */}
        {step === "confirm" && (
          <div style={{ padding: 24 }}>
            <div style={{ background: "#fff7e6", border: "1px solid #EFC44B", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ fontSize: 14, color: "#333", margin: 0, lineHeight: 1.5 }}>
                  <strong>A copy of this ticket will be sent to {recipientEmail.trim()}.</strong> Your ticket stays in your wallet — the recipient gets their own copy after they accept.
                </p>
              </div>
            </div>

            <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#333", margin: "0 0 4px" }}>Transferring to:</p>
              <p style={{ fontSize: 15, color: TK_NAVY, fontWeight: 700, margin: "0 0 12px" }}>{recipientEmail.trim()}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#333", margin: "0 0 4px" }}>Ticket:</p>
              <p style={{ fontSize: 14, color: "#111", fontWeight: 600, margin: "0 0 2px" }}>{ticket.event_name}</p>
              <p style={{ fontSize: 13, color: "#666", margin: "0 0 2px" }}>{ticket.event_date} · {ticket.venue_name}</p>
              <p style={{ fontSize: 13, color: "#666", margin: 0 }}>Sec {ticket.section_bay || "-"} · Row {ticket.row || "-"} · Seat {ticket.seat_number || "-"}</p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep("form")} style={{ flex: 1, padding: "16px 0", borderRadius: 8, background: "transparent", color: "#666", fontWeight: 600, fontSize: 16, border: "1px solid #ddd", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleTransfer} style={{ flex: 1, padding: "16px 0", borderRadius: 8, background: TK_GREEN, color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>Confirm Transfer</button>
            </div>
          </div>
        )}

        {/* SENDING STEP */}
        {step === "sending" && (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ width: 40, height: 40, margin: "0 auto 20px", border: "3px solid #e0e0e0", borderTopColor: TK_NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontSize: 16, color: "#333", fontWeight: 600, margin: 0 }}>Initiating transfer...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* SENT STEP */}
        {step === "sent" && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Transfer Email Sent!</h3>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 20px", lineHeight: 1.5 }}>
              We've sent a ticket transfer link to <strong>{recipientEmail.trim()}</strong>. The recipient has 48 hours to accept. Your ticket stays in your wallet.
            </p>
            <div className="selectable-text" style={{ background: "#f8f9fa", borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 12, color: "#999", wordBreak: "break-all" }}>
              {transferUrl}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleCancelTransfer} style={{ flex: 1, padding: "14px 0", borderRadius: 8, background: "transparent", color: "#ef4444", fontWeight: 600, fontSize: 15, border: "1px solid #ef4444", cursor: "pointer" }}>Cancel Transfer</button>
              <button onClick={onClose} style={{ flex: 1, padding: "14px 0", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>Done</button>
            </div>
          </div>
        )}

        {/* ERROR STEP */}
        {step === "error" && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#ffeaea", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Transfer Failed</h3>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 20px" }}>{error}</p>
            <button onClick={() => setStep("form")} style={{ width: "100%", padding: "16px 0", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

function buildTransferEmailHtml(ticket, url, recipientEmail, senderEmail) {
  return `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
    <div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
      <h2 style="color: #fff; margin: 0 0 8px; font-size: 22px;">You've received a ticket transfer</h2>
      <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">Someone has transferred a ticket to you.</p>
    </div>
    <div style="background: #fff; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
      <div style="background: #f8f9fa; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
        <p style="color: #001f2d; font-size: 18px; font-weight: 700; margin: 0 0 8px;">${ticket.event_name || "Event"}</p>
        <p style="color: #666; font-size: 14px; margin: 0 0 4px;"><strong>Date:</strong> ${ticket.event_date || "TBD"}</p>
        <p style="color: #666; font-size: 14px; margin: 0 0 4px;"><strong>Venue:</strong> ${ticket.venue_name || "TBD"}</p>
        <p style="color: #666; font-size: 14px; margin: 0;"><strong>Number of Tickets:</strong> 1</p>
      </div>
      <p style="color: #333; font-size: 14px; margin: 0 0 20px; line-height: 1.5;">
        ${senderEmail} has transferred a ticket to you. Click the button below to accept this transfer. This link will expire in 48 hours.
      </p>
      <a href="${url}" style="display: block; text-align: center; padding: 16px 0; background: #4e783e; color: #fff; font-weight: 700; font-size: 17px; border-radius: 8px; text-decoration: none; margin-bottom: 16px;">Accept Ticket</a>
      <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">If the button doesn't work, copy this link: ${url}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
    </div>
  </div>`;
}