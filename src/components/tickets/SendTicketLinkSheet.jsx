import { useState } from "react";

/**
 * Shown after a phone-number transfer is created.
 * The sender picks WhatsApp or iMessage, then taps Share to open that app
 * with the recipient's number and the accept link pre-filled.
 */
export default function SendTicketLinkSheet({ recipientName, recipientPhone, senderName, eventName, shareUrl, onBack, onDone }) {
  const [app, setApp] = useState("whatsapp");

  const digits = (recipientPhone || "").replace(/\D/g, "");
  const message = `Hi ${recipientName || "there"}, ${senderName || "A Ticketek user"} has sent you a ticket for ${eventName || "an event"}. Accept it here: ${shareUrl}`;
  const encoded = encodeURIComponent(message);
  const href = app === "whatsapp" ? `https://wa.me/${digits}?text=${encoded}` : `sms:${digits}&body=${encoded}`;

  const handleShare = () => {
    window.location.href = href;
    if (onDone) onDone();
  };

  const Option = ({ id, label, icon }) => {
    const active = app === id;
    return (
      <button
        onClick={() => setApp(id)}
        className="w-full flex items-center gap-3 rounded-lg px-4 py-4 mb-3 cursor-pointer bg-white"
        style={{ border: active ? "1.5px solid #004b8d" : "1px solid #e2e2e2" }}
      >
        <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center">{icon}</span>
        <span className="flex-1 text-left text-base font-semibold text-gray-800">{label}</span>
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ border: active ? "6px solid #004b8d" : "1.5px solid #c9c9c9" }}
        />
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}>
      <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-6 pb-9 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        <h2 className="text-base font-bold text-gray-900 mb-3">Send ticket link</h2>
        <div className="h-px bg-gray-200 mb-4" />

        <p className="text-base font-semibold text-gray-800 mb-1">Choose how to send to {recipientPhone}</p>
        <p className="text-sm text-gray-500 mb-5">
          Select an app below and tap Share to open it with your ticket accept link.
        </p>

        <Option
          id="whatsapp"
          label="Send Via WhatsApp"
          icon={
            <svg viewBox="0 0 24 24" fill="#25D366" className="w-7 h-7">
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.13-.42-2.15-1.33-.79-.71-1.33-1.58-1.48-1.88-.15-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.44s1.05 2.83 1.2 3.03c.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.62.7.22 1.34.19 1.85.12.56-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.13c-1.55 0-3.07-.42-4.4-1.2l-.31-.19-3.12.82.83-3.04-.2-.32a8.22 8.22 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.31-8.02 8.31z" />
            </svg>
          }
        />
        <Option
          id="imessage"
          label="Send Via iMessage"
          icon={
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <rect width="24" height="24" rx="5.5" fill="#34C759" />
              <path d="M12 5.4c-3.65 0-6.6 2.42-6.6 5.4 0 1.72.98 3.24 2.5 4.24-.1.9-.5 1.9-1.2 2.6 1.35.05 2.6-.55 3.4-1.3.6.16 1.24.24 1.9.24 3.65 0 6.6-2.42 6.6-5.4S15.65 5.4 12 5.4z" fill="#fff" />
            </svg>
          }
        />

        <div className="flex gap-3 mt-6">
          <button onClick={onBack}
            className="flex-1 py-4 rounded-lg font-semibold text-base border border-gray-200 bg-white cursor-pointer flex items-center justify-center gap-1"
            style={{ color: "#004b8d" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <button onClick={handleShare}
            className="flex-1 py-4 rounded-lg font-semibold text-base border-none cursor-pointer text-white"
            style={{ backgroundColor: "#418029" }}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}