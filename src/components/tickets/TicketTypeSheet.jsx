import { useState } from "react";

const TICKET_TYPES = [
  "Premium Reserve",
  "A Reserve",
  "B Reserved",
  "C Reserve",
  "D Reserve",
  "General Admission (GA)",
  "GA Standing",
  "Aisle Seating",
  "Restricted / Obstructed View",
  "Admit / Adult",
  "Concession",
  "Junior / Child",
  "Family",
  "Group Bookings / Ticketek Groupie",
  "Artist Presale",
  "Live Nation Presale",
  "Frontier Presale",
  "Mastercard Presale Admit",
  "CommBank Presale Admit",
  "Vodafone Presale Admit",
  "Telstra Presale Admit",
  "Early Bird",
  "Early Entry VIP",
  "Collector Admit",
  "Verified Fan-to-Fan",
  "— Accessible —",
  "Wheelchair Accessible Space",
  "Companion Card",
  "Enhanced Amenity / Easy Access",
  "Bariatric Seating",
  "Customise…",
];

export default function TicketTypeSheet({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState("");

  const handleSelect = (type) => {
    if (type === "Customise…") {
      setCustomMode(true);
      return;
    }
    if (type === "— Accessible —") return; // divider
    onChange(type);
    setOpen(false);
  };

  const handleCustomSave = () => {
    if (!customText.trim()) return;
    onChange(customText.trim());
    setCustomMode(false);
    setCustomText("");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-left outline-none text-gray-800 bg-white flex items-center justify-between"
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || "Select Ticket Type"}</span>
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => { setOpen(false); setCustomMode(false); }}>
          <div className="bg-white w-full max-w-[500px] mx-auto rounded-t-2xl pt-4 pb-8 max-h-[75vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="px-5 mb-3">
              <h3 className="text-base font-bold text-gray-900">Select Ticket Type</h3>
            </div>
            {customMode ? (
              <div className="px-5 flex flex-col gap-3">
                <input
                  autoFocus
                  type="text"
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="Enter custom ticket type..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none"
                />
                <button onClick={handleCustomSave} className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer" style={{ backgroundColor: "#003057" }}>
                  Use This Type
                </button>
                <button onClick={() => setCustomMode(false)} className="w-full py-3 rounded-lg font-bold text-sm border border-gray-200 text-gray-600 bg-white cursor-pointer">
                  Back
                </button>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 px-5">
                {TICKET_TYPES.map((type, i) => {
                  if (type === "— Accessible —") {
                    return (
                      <div key={i} className="text-xs font-bold text-gray-400 uppercase tracking-wide py-3 border-t border-gray-100 mt-2">
                        Accessible Ticketing
                      </div>
                    );
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(type)}
                      className={`w-full text-left px-3 py-3.5 rounded-lg text-sm border-none cursor-pointer flex items-center justify-between ${type === value ? "font-bold" : ""}`}
                      style={{ backgroundColor: type === value ? "#f0f4ff" : "transparent", color: type === "Customise…" ? "#003057" : "#111" }}
                    >
                      <span>{type}</span>
                      {type === value && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#003057" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}