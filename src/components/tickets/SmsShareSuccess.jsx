import { useState } from "react";

/**
 * Shown after a phone-number transfer is created.
 * The accept link is handed to the sender's messaging app so the recipient
 * receives it by SMS and follows the same accept-into-wallet flow.
 */
export default function SmsShareSuccess({ recipientName, recipientPhone, senderName, eventName, shareUrl, onDone }) {
  const [copied, setCopied] = useState(false);

  const smsTarget = (recipientPhone || "").replace(/[^\d+]/g, "");
  const message = `Hi ${recipientName || "there"}, ${senderName || "A Ticketek user"} has sent you a ticket for ${eventName || "an event"}. Accept it here: ${shareUrl}`;
  const smsHref = `sms:${smsTarget}?&body=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}>
      <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-8 pb-9 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ticket ready to send</h3>
        <p className="text-sm text-gray-500 mb-6">
          Tap below to text the accept link to <strong>{recipientPhone}</strong>. Your ticket stays in your wallet until they accept it.
        </p>

        <a href={smsHref}
          className="w-full py-4 rounded-lg font-semibold text-base border-none cursor-pointer flex items-center justify-center gap-2 no-underline mb-3"
          style={{ backgroundColor: "#418029", color: "white" }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Send by SMS
        </a>

        <div className="flex gap-3">
          <button onClick={handleCopy}
            className="flex-1 py-4 rounded-lg font-semibold text-base border border-gray-200 bg-white cursor-pointer"
            style={{ color: "#004b8d" }}>
            {copied ? "Link copied" : "Copy link"}
          </button>
          <button onClick={onDone}
            className="flex-1 py-4 rounded-lg font-semibold text-base border border-gray-200 bg-white cursor-pointer"
            style={{ color: "#666" }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}