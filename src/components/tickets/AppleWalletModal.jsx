export default function AppleWalletModal({ ticket, onClose }) {
  const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=pdf417&text=${encodeURIComponent(ticket.serial_number || "000000000000")}&scale=3&rotate=N`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ backgroundColor: "#d1d1d6", paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Nav */}
      <div className="flex justify-between items-center px-5 py-4">
        <button onClick={onClose} className="text-lg font-semibold text-black bg-transparent border-none cursor-pointer">Done</button>
        <div className="flex gap-3">
          <div className="w-9 h-9 bg-[#e3e3e8] rounded-full flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
            </svg>
          </div>
          <div className="w-9 h-9 bg-[#e3e3e8] rounded-full flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="10" cy="12" r="1" fill="#007AFF"/>
              <circle cx="12" cy="12" r="1" fill="#007AFF"/>
              <circle cx="14" cy="12" r="1" fill="#007AFF"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Ticket Card */}
      <div className="flex-1 px-4 overflow-hidden">
        <div
          className="w-full h-full relative p-6"
          style={{
            backgroundColor: "#041d21",
            WebkitMaskImage: "radial-gradient(circle 24px at top center, transparent 24px, black 25px)",
            maskImage: "radial-gradient(circle 24px at top center, transparent 24px, black 25px)",
          }}
        >
          {/* Brand */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7" viewBox="0 0 512 512">
                <path fill="white" d="M256 0l79.1 160.3L512 185.9l-128 124.8 30.2 176.3L256 403.9 97.8 487l30.2-176.3L0 185.9l176.9-25.6z"/>
                <text x="50%" y="67%" textAnchor="middle" fill="#041d21" fontSize="190" fontFamily="Arial" fontWeight="900">T</text>
              </svg>
              <span className="text-white font-black text-xl tracking-tight">TICKETEK</span>
            </div>
            <div className="text-right">
              <div className="text-[#eadd62] text-xs font-bold">{ticket.event_date}</div>
              <div className="text-white text-[9px] tracking-wide opacity-70 uppercase">{ticket.event_name}</div>
            </div>
          </div>

          {/* Main info */}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[#eadd62] text-[11px] font-extrabold uppercase mb-1">{ticket.venue_name}</div>
              <div className="text-white text-base font-bold leading-tight">{ticket.ticket_type || "STANDARD"}</div>
            </div>
            {ticket.event_image && (
              <img src={ticket.event_image} alt={ticket.event_name} className="w-20 h-24 object-cover border border-white/20" />
            )}
          </div>

          {/* Seat grid */}
          <div className="grid grid-cols-4 mt-8">
            <div>
              <div className="text-[#eadd62] text-[10px] font-extrabold uppercase mb-1">SECTION</div>
              <div className="text-white text-base font-bold">{ticket.section_bay || "-"}</div>
            </div>
            <div>
              <div className="text-[#eadd62] text-[10px] font-extrabold uppercase mb-1">ROW/SEAT</div>
              <div className="text-white text-base font-bold">{ticket.row} {ticket.seat_number}</div>
            </div>
            <div>
              <div className="text-[#eadd62] text-[10px] font-extrabold uppercase mb-1">DOOR</div>
              <div className="text-white text-base font-bold">{ticket.door_area || "-"}</div>
            </div>
            <div className="text-right">
              <div className="text-[#eadd62] text-[10px] font-extrabold uppercase mb-1">GATE</div>
              <div className="text-white text-base font-bold">{ticket.entry_gate || "-"}</div>
            </div>
          </div>

          {/* Barcode */}
          <div className="absolute bottom-10 left-5 right-5 bg-white rounded p-4 flex flex-col items-center">
            <img src={barcodeUrl} alt="Barcode" className="w-full h-20 object-contain" />
            <div className="mt-3 font-mono font-bold text-base tracking-wider">{ticket.serial_number}</div>
          </div>

          {/* Contactless */}
          <div className="absolute bottom-3 right-4 opacity-70">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M5 8c2-2 5-2 7 0M3 5c4-4 10-4 14 0M7 11c1-1 3-1 4 0"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Footer dots */}
      <div className="flex justify-center gap-2 py-5">
        <div className="w-2 h-2 rounded-full bg-gray-800" />
        <div className="w-2 h-2 rounded-full bg-gray-400" />
      </div>
    </div>
  );
}