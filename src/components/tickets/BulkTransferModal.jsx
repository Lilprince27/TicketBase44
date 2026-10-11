import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { generateSecureToken, buildTransferUrl } from "@/lib/ticketUtils";
import { assertEmailQuotaAvailable, decrementEmailQuota } from "@/lib/emailQuota";
import { sendEmailWithRetry } from "@/lib/sendEmailWithRetry";
import { createTicketNotification } from "@/lib/ticketNotification";

const TK_NAVY = "#001f2d";
const TK_GREEN = "#4e783e";
const TK_YELLOW = "#EFC44B";

export default function BulkTransferModal({ tickets, user, senderName, onClose }) {
  const [step, setStep] = useState("form");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [createdTransfers, setCreatedTransfers] = useState([]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(recipientEmail.trim());
  const nameValid = recipientName.trim() !== "";
  const formValid = emailValid && nameValid;
  const isSelf = recipientEmail.trim().toLowerCase() === (user?.email || "").toLowerCase();

  const handleTransfer = async () => {
    if (!emailValid) { setError("Please enter a valid email address."); return; }
    if (!nameValid) { setError("Please enter the recipient's name."); return; }
    if (isSelf) { setError("You cannot transfer tickets to yourself."); return; }
    setStep("sending");
    setError("");

    try {
      const quotaState = await assertEmailQuotaAvailable();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      const transfers = [];

      // Create one transfer record per ticket
      for (const ticket of tickets) {
        const token = generateSecureToken();
        const snapshot = JSON.stringify({ ...ticket, recipient_name: recipientName.trim() });
        const url = buildTransferUrl(token);
        const transfer = await base44.entities.TicketTransfer.create({
          secure_token: token,
          ticket_snapshot: snapshot,
          sender_email: user.email,
          recipient_email: recipientEmail.trim(),
          status: "pending",
          expires_at: expiresAt,
          event_name: ticket.event_name,
          event_date: ticket.event_date,
          venue_name: ticket.venue_name,
          ticket_count: 1,
        });
        transfers.push({ transfer, ticket, url, token });
        try {
          await base44.entities.TransferAuditLog.create({
            transfer_id: transfer.id,
            secure_token: token,
            action: "created",
            actor_email: user.email,
            metadata: JSON.stringify({ recipient_email: recipientEmail.trim() }),
          });
        } catch (e) {}
      }

      setCreatedTransfers(transfers);

      // Build one email with all ticket accept links
      const emailHtml = buildBulkTransferEmailHtml(tickets, transfers, recipientEmail.trim(), user.email, senderName);
      const result = await sendEmailWithRetry({
        to: recipientEmail.trim(),
        subject: `You've received ${tickets.length} ticket transfers from ${senderName || "a Ticketek user"}`,
        body: emailHtml,
      });

      if (!result.ok) {
        setEmailError(result.error);
        setStep("email_failed");
        return;
      }

      // Decrement quota (one email = one quota unit)
      try { await decrementEmailQuota(quotaState); } catch (e) {}

      // Create ticket history for each ticket
      for (const { ticket } of transfers) {
        try {
          await base44.entities.TicketHistory.create({
            ticket_id: ticket.id,
            ticket_name: ticket.event_name,
            owner_email: user.email,
            action: "transferred",
            actor_email: user.email,
            recipient_email: recipientEmail.trim(),
            details: `Bulk transfer to ${recipientEmail.trim()}`,
          });
        } catch (e) {}
      }

      // Create a push notification for the recipient
      await createTicketNotification({
        recipientEmail: recipientEmail.trim(),
        senderEmail: user.email,
        senderName: senderName || "",
        eventName: tickets[0]?.event_name || "your event",
        notificationType: "bulk_transfer",
        ticketCount: tickets.length,
      });

      setStep("sent");
    } catch (e) {
      setError(e.message || "Could not initiate transfer. Please try again.");
      setStep("error");
    }
  };

  const handleRetryEmail = async () => {
    setRetrying(true);
    setEmailError("");
    try {
      const emailHtml = buildBulkTransferEmailHtml(tickets, createdTransfers, recipientEmail.trim(), user.email, senderName);
      const result = await sendEmailWithRetry({
        to: recipientEmail.trim(),
        subject: `You've received ${tickets.length} ticket transfers from ${senderName || "a Ticketek user"}`,
        body: emailHtml,
      });
      if (result.ok) {
        setStep("sent");
      } else {
        setEmailError(result.error);
      }
    } catch (e) {
      setEmailError(e.message || "Could not send email. Please try again.");
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", width: "100%", maxWidth: 500, borderRadius: "20px 20px 0 0", maxHeight: "90vh", overflowY: "auto", fontFamily: "-apple-system, system-ui, sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* FORM STEP — matches the original ShareModal design */}
        {step === "form" && (
          <div style={{ padding: "24px 20px 36px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
              <svg style={{ width: 48, height: 48, transform: "rotate(-45deg)", flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8z" />
                <line x1="6" y1="5" x2="6" y2="19" strokeDasharray="2 2" />
              </svg>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: "#4b5563", margin: 0 }}>Share ticket{tickets.length > 1 ? "s" : ""}</h2>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>Transfer {tickets.length === 1 ? "this ticket" : `these ${tickets.length} tickets`} to anyone via email.</p>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter recipient email"
                style={{ width: "100%", padding: "16px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 16, outline: "none", color: "#1f2937", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter recipient name"
                style={{ width: "100%", padding: "16px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 16, outline: "none", color: "#1f2937", boxSizing: "border-box" }}
              />
            </div>

            {error && <p style={{ fontSize: 14, color: "#ef4444", textAlign: "center", marginBottom: 12 }}>{error}</p>}

            <p style={{ fontSize: 14, color: "#9ca3af", textAlign: "center", margin: "20px 8px", lineHeight: 1.5 }}>
              A secure accept link will be emailed to the recipient. Your ticket{tickets.length > 1 ? "s" : ""} stay{tickets.length === 1 ? "s" : ""} in your wallet.
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "16px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#004b8d", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={!formValid}
                style={{ flex: 1, padding: "16px 0", borderRadius: 8, border: "none", background: formValid ? "#418029" : "#e8e8e8", color: formValid ? "#fff" : "#9ca3af", fontWeight: 600, fontSize: 16, cursor: formValid ? "pointer" : "default" }}
              >
                Transfer ticket{tickets.length > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}

        {/* SENDING STEP */}
        {step === "sending" && (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ width: 40, height: 40, margin: "0 auto 20px", border: "3px solid #e0e0e0", borderTopColor: TK_NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontSize: 16, color: "#333", fontWeight: 600, margin: 0 }}>Transferring {tickets.length} tickets...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* SENT STEP */}
        {step === "sent" && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>{tickets.length} Tickets Transferred!</h3>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 20px", lineHeight: 1.5 }}>
              We've sent transfer links to <strong>{recipientEmail.trim()}</strong>. The recipient has 48 hours to accept each ticket.
            </p>
            <button onClick={onClose} style={{ width: "100%", padding: "16px 0", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
              Done
            </button>
          </div>
        )}

        {/* EMAIL FAILED STEP */}
        {step === "email_failed" && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#fff7e6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={TK_YELLOW} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 6.5L12 13 2 6.5"/><path d="M22 6.5V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6.5"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Email not delivered</h3>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 8px", lineHeight: 1.5 }}>
              The transfer links were created, but the email to <strong>{recipientEmail.trim()}</strong> could not be delivered.
            </p>
            {emailError && (
              <p style={{ fontSize: 12, color: "#ef4444", margin: "0 0 16px", background: "#fef2f2", padding: "8px 12px", borderRadius: 8, wordBreak: "break-word" }}>{emailError}</p>
            )}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "14px 0", borderRadius: 8, background: "transparent", color: "#666", fontWeight: 600, fontSize: 15, border: "1px solid #ddd", cursor: "pointer" }}>Close</button>
              <button onClick={handleRetryEmail} disabled={retrying} style={{ flex: 1, padding: "14px 0", borderRadius: 8, background: retrying ? "#9ca3af" : TK_GREEN, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: retrying ? "default" : "pointer" }}>
                {retrying ? "Sending..." : "Retry Send"}
              </button>
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

function buildBulkTransferEmailHtml(tickets, transfers, recipientEmail, senderEmail, senderName) {
  const senderDisplay = senderName || senderEmail;
  const ticketRows = transfers.map(({ ticket, url }, i) => `
    <div style="background:#f8f9fa;border-radius:10px;padding:16px;margin-bottom:12px;">
      <p style="color:#001f2d;font-size:16px;font-weight:700;margin:0 0 6px;">${ticket.event_name || "Event"}</p>
      <p style="color:#666;font-size:13px;margin:0 0 4px;"><strong>Date:</strong> ${ticket.event_date || "TBD"}</p>
      <p style="color:#666;font-size:13px;margin:0 0 4px;"><strong>Venue:</strong> ${ticket.venue_name || "TBD"}</p>
      <p style="color:#666;font-size:13px;margin:0 0 12px;"><strong>Seat:</strong> Sec ${ticket.section_bay || "-"} · Row ${ticket.row || "-"} · Seat ${ticket.seat_number || "-"}</p>
      <a href="${url}" style="display:block;text-align:center;padding:12px 0;background:#4e783e;color:#fff;font-weight:700;font-size:15px;border-radius:8px;text-decoration:none;">Accept Ticket ${i + 1}</a>
    </div>`).join("");

  return `<div style="font-family:-apple-system,sans-serif;max-width:500px;margin:0 auto;">
    <div style="background:#001f2d;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
      <h2 style="color:#fff;margin:0 0 8px;font-size:22px;">You've received ${tickets.length} ticket transfers</h2>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">${senderDisplay} has transferred ${tickets.length} ${tickets.length === 1 ? "ticket" : "tickets"} to you.</p>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;">
      <p style="color:#333;font-size:14px;margin:0 0 20px;line-height:1.5;">
        ${senderDisplay} has transferred ${tickets.length} ${tickets.length === 1 ? "ticket" : "tickets"} to you. Click each button below to accept. These links will expire in 48 hours.
      </p>
      ${ticketRows}
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
      <p style="color:#999;font-size:12px;margin:0;">Ticketek Pty Limited ABN 92 010 129 110</p>
    </div>
  </div>`;
}