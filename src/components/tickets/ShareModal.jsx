import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function ShareModal({ ticket, onClose }) {
  const [contact, setContact] = useState("");
  const [name, setName] = useState("");
  const [shareSettings, setShareSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    base44.entities.ShareSettings.list().then(list => {
      setShareSettings(list.length > 0 ? list[0] : { mode: "normal" });
      setLoadingSettings(false);
    }).catch(() => {
      setShareSettings({ mode: "normal" });
      setLoadingSettings(false);
    });
  }, []);

  const isValid = contact.trim() !== "" && name.trim() !== "";

  const handleShare = () => {
    if (isValid) onClose();
  };

  const seatNumber = ticket?.seat_number || "";

  const overlayStyle = { background: "rgba(240,242,245,0.85)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" };

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
            <p className="text-sm text-gray-500 mt-1">Securely share tickets. <a href="#" className="font-medium" style={{ color: "#004b8d" }}>How it works</a></p>
          </div>
        </div>

        <div className="relative mb-4">
          <input type="text" value={contact} onChange={e => setContact(e.target.value)}
            placeholder="Enter mobile or email"
            className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base outline-none text-gray-800 placeholder-gray-400" />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6" style={{ color: "#004b8d" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" />
            <circle cx="20" cy="11" r="3" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" />
          </svg>
        </div>
        <div className="mb-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Enter name"
            className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base outline-none text-gray-800 placeholder-gray-400" />
        </div>

        <p className="text-sm text-gray-400 text-center my-5 px-2">
          By entering this information you agree that you have the receiver's consent to do so.
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 rounded-lg font-semibold text-base border border-gray-200 bg-white cursor-pointer" style={{ color: "#004b8d" }}>Cancel</button>
          <button onClick={handleShare} disabled={!isValid}
            className="flex-1 py-4 rounded-lg font-semibold text-base border-none transition-all cursor-pointer"
            style={{ backgroundColor: isValid ? "#418029" : "#e8e8e8", color: isValid ? "white" : "#9ca3af" }}>
            Share ticket
          </button>
        </div>
      </div>
    </div>
  );
}