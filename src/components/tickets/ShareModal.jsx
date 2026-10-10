import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { buildTransferEmailHtml } from "@/lib/transferEmailTemplate";
import { APP_BASE_URL, buildShareUrl, generateSecureToken } from "@/lib/ticketUtils";
import { assertEmailQuotaAvailable, decrementEmailQuota } from "@/lib/emailQuota";
import { sendEmailWithRetry } from "@/lib/sendEmailWithRetry";

export default function ShareModal({ ticket, onClose, onTransferred }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [shareSettings, setShareSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [transferring, setTransferring] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [emailFailed, setEmailFailed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [lastShareToken, setLastShareToken] = useState("");

  useEffect(() => {
    base44.entities.ShareSettings.list().then(list => {
      setShareSettings(list.length > 0 ? list[0] : { mode: "normal" });
      setLoadingSettings(false);
    }).catch(() => {
      setShareSettings({ mode: "normal" });
      setLoadingSettings(false);
    });
    // Fetch sender's display name
    base44.auth.me().then(me => {
      const profiles = base44.entities.UserProfile.filter({ user_email: me.email }).then(p => {
        const disp = p[0]?.first_name ? `${p[0].first_name}${p[0].last_name ? " " + p[0].last_name : ""}` : (me.display_name || me.full_name || me.email);
        setSenderName(disp);
      }).catch(() => setSenderName(me.display_name || me.full_name || me.email));
    }).catch(() => {});
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email.trim()) && name.trim() !== "";

  const handleShare = async () => {
    if (!isValid) return;
    setTransferring(true);
    setError("");
    try {
      const me = await base44.auth.me();

      // Check unified email quota (share + transfer share the same counter)
      const quotaState = await assertEmailQuotaAvailable();

      // Create a secure accept-into-wallet link (sender keeps their ticket)
      const token = generateSecureToken();
      const url = buildShareUrl(token);
      const snapshot = JSON.stringify({
        event_name: ticket.event_name, venue_name: ticket.venue_name, presenter: ticket.presenter,
        event_date: ticket.event_date, entry_gate: ticket.entry_gate, level_stand: ticket.level_stand,
        door_area: ticket.door_area, section_bay: ticket.section_bay, row: ticket.row, seat_number: ticket.seat_number,
        holder_name: ticket.holder_name, ticket_type: ticket.ticket_type, price: ticket.price,
        serial_number: ticket.serial_number, order_number: ticket.order_number, event_code: ticket.event_code,
        transaction_number: ticket.transaction_number, purchase_date: ticket.purchase_date, seller_id: ticket.seller_id,
        pax_number: ticket.pax_number, event_image: ticket.event_image, sender_name: senderName,
      });
      await base44.entities.SharedTicket.create({
        share_token: token,
        ticket_snapshot: snapshot,
        owner_email: me.email,
        event_image: ticket.event_image || "",
        recipient_email: email.trim(),
      });

      // Create history record
      try {
        await base44.entities.TicketHistory.create({
          ticket_id: ticket.id,
          ticket_name: ticket.event_name,
          owner_email: me.email,
          action: "transferred",
          actor_email: me.email,
          recipient_email: email.trim(),
          details: `Shared to ${email.trim()} (sender retains ticket)`,
        });
      } catch (e) {}

      // Send premium notification email to recipient with accept link (with retry)
      const emailHtml = buildTransferEmailHtml({
        ticket,
        recipientName: name.trim(),
        senderName: senderName || "A Ticketek user",
        appUrl: url,
      });

      const result = await sendEmailWithRetry({
        to: email.trim(),
        subject: `Ticket transferred to you: ${ticket.event_name}`,
        body: emailHtml,
      });

      if (!result.ok) {
        // Share record exists & link is valid, but email didn't deliver.
        // Show a retry state so the sender can re-send without creating a duplicate share.
        setLastShareToken(token);
        setEmailError(result.error);
        setEmailFailed(true);
        setTransferring(false);
        return;
      }

      // Decrement the unified email quota (share + transfer share the same counter)
      try {
        await decrementEmailQuota(quotaState);
      } catch (e) {
        console.warn("[quota] decrement failed:", e);
      }

      setSuccess(true);
      setTransferring(false);
      setTimeout(() => {
        if (onTransferred) onTransferred();
        else onClose();
      }, 1800);
    } catch (e) {
      setError(e.message || "Transfer failed. Please try again.");
      setTransferring(false);
    }
  };

  const handleRetryShare = async () => {
    setRetrying(true);
    setEmailError("");
    try {
      const url = buildShareUrl(lastShareToken);
      const emailHtml = buildTransferEmailHtml({
        ticket,
        recipientName: name.trim(),
        senderName: senderName || "A Ticketek user",
        appUrl: url,
      });
      const result = await sendEmailWithRetry({
        to: email.trim(),
        subject: `Ticket transferred to you: ${ticket.event_name}`,
        body: emailHtml,
      });
      if (result.ok) {
        // Quota was not decremented on the failed attempt — decrement now
        try {
          const quotaState = await assertEmailQuotaAvailable();
          await decrementEmailQuota(quotaState);
        } catch (e) {}
        setEmailFailed(false);
        setSuccess(true);
        setTimeout(() => {
          if (onTransferred) onTransferred();
          else onClose();
        }, 1800);
      } else {
        setEmailError(result.error);
      }
    } catch (e) {
      setEmailError(e.message || "Could not send email. Please try again.");
    } finally {
      setRetrying(false);
    }
  };

  const seatNumber = ticket?.seat_number || "";

  const overlayStyle = { background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" };

  if (loadingSettings) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={overlayStyle}>
        <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-6 pb-9 flex justify-center">
          <div className="w-6 h-6 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Service Unavailable
  if (shareSettings?.mode === "service_unavailable") {
    return (
      <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={overlayStyle} onClick={onClose}>
        <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-6 pb-9" onClick={e => e.stopPropagation()}>
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Service Unavailable</h3>
            <p className="text-sm text-gray-500 mb-6">Ticket transfer is currently unavailable. Please try again later.</p>
            <button onClick={onClose} className="w-full py-4 rounded-xl font-bold text-white border-none cursor-pointer" style={{ backgroundColor: "#003057" }}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // Not Available
  if (shareSettings?.mode === "not_available") {
    return (
      <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={overlayStyle} onClick={onClose}>
        <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-6 pb-9" onClick={e => e.stopPropagation()}>
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Transfer Not Available</h3>
            <p className="text-sm text-gray-500 mb-6">Ticket transfers are not available for this event.</p>
            <button onClick={onClose} className="w-full py-4 rounded-xl font-bold text-white border-none cursor-pointer" style={{ backgroundColor: "#003057" }}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // Require Fee
  if (shareSettings?.mode === "require_fee") {
    return (
      <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={overlayStyle} onClick={onClose}>
        <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-6 pb-9" onClick={e => e.stopPropagation()}>
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Transfer Fee Required</h3>
            <p className="text-sm text-gray-500 mb-2">A transfer fee applies to share this ticket.</p>
            {shareSettings.share_fee && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 inline-block">
                <span className="text-xl font-bold text-blue-800">{shareSettings.share_fee}</span>
              </div>
            )}
            <p className="text-xs text-gray-400 mb-6">Please contact admin to proceed with the transfer.</p>
            <button onClick={onClose} className="w-full py-4 rounded-xl font-bold text-white border-none cursor-pointer" style={{ backgroundColor: "#003057" }}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // Email failed state — share record created, but email didn't deliver. Retry without duplicating.
  if (emailFailed) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={overlayStyle}>
        <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-8 pb-9 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 6.5L12 13 2 6.5" /><path d="M22 6.5V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6.5" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Email not delivered</h3>
          <p className="text-sm text-gray-500 mb-2">
            The share link was created, but the email to <strong>{email.trim()}</strong> could not be delivered.
          </p>
          {emailError && (
            <p className="text-xs text-red-500 mb-4 bg-red-50 px-3 py-2 rounded-lg break-words">{emailError}</p>
          )}
          <p className="text-sm text-gray-500 mb-6">Tap retry to send the email again. The recipient will use the link to accept the ticket.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-4 rounded-lg font-semibold text-base border border-gray-200 bg-white cursor-pointer" style={{ color: "#666" }}>Close</button>
            <button onClick={handleRetryShare} disabled={retrying}
              className="flex-1 py-4 rounded-lg font-semibold text-base border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: "#418029", color: "white" }}>
              {retrying ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : "Retry Send"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={overlayStyle}>
        <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-8 pb-9 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ticket Sent!</h3>
          <p className="text-sm text-gray-500">An accept link has been sent to {email.trim()}. Your ticket stays in your wallet.</p>
        </div>
      </div>
    );
  }

  // Normal mode
  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={overlayStyle} onClick={onClose}>
      <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-6 pb-9 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-4 mb-6">
          <svg className="w-12 h-12 text-gray-400 flex-shrink-0" style={{ transform: "rotate(-45deg)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8z" />
            <line x1="6" y1="5" x2="6" y2="19" strokeDasharray="2 2" />
          </svg>
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Share ticket{seatNumber ? ` for Seat ${seatNumber}` : ""}</h2>
            <p className="text-sm text-gray-500 mt-1">Transfer this ticket to anyone via email.</p>
          </div>
        </div>

        <div className="mb-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Enter recipient email"
            className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base outline-none text-gray-800 placeholder-gray-400" />
        </div>
        <div className="mb-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Enter recipient name"
            className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base outline-none text-gray-800 placeholder-gray-400" />
        </div>

        {error && <p className="text-sm text-red-500 text-center mb-3">{error}</p>}

        <p className="text-sm text-gray-400 text-center my-5 px-2">
          A secure accept link will be emailed to the recipient. Your ticket stays in your wallet.
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} disabled={transferring}
            className="flex-1 py-4 rounded-lg font-semibold text-base border border-gray-200 bg-white cursor-pointer disabled:opacity-50" style={{ color: "#004b8d" }}>Cancel</button>
          <button onClick={handleShare} disabled={!isValid || transferring}
            className="flex-1 py-4 rounded-lg font-semibold text-base border-none transition-all cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: isValid && !transferring ? "#418029" : "#e8e8e8", color: isValid && !transferring ? "white" : "#9ca3af" }}>
            {transferring ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Transferring...
              </>
            ) : "Transfer ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}