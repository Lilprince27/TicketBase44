export default function AppleWalletModal({ ticket, onClose }) {
  const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=pdf417&text=${encodeURIComponent(ticket.serial_number || "29429548996992")}&scale=3&rotate=N`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ backgroundColor: "#f2f2f6", paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* iOS Nav */}
      <div className="flex justify-between items-center px-5 py-4 bg-[#f2f2f6]">
        <button onClick={onClose} className="text-lg font-semibold text-black bg-transparent border-none cursor-pointer">Done</button>
        <div className="flex gap-3">
          <div className="w-9 h-9 bg-[#e3e3e8] rounded-full flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
            </svg>
          </div>
          <div className="w-9 h-9 bg-[#e3e3e8] rounded-full flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="9" cy="12" r="1.2" fill="#007AFF"/>
              <circle cx="12" cy="12" r="1.2" fill="#007AFF"/>
              <circle cx="15" cy="12" r="1.2" fill="#007AFF"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Ticket Card */}
      <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">
        <div
          className="flex-1 relative flex flex-col p-6 overflow-hidden"
          style={{
            backgroundColor: "#041d21",
            WebkitMaskImage: "radial-gradient(circle 20px at 50% 0%, transparent 20px, black 21px)",
            maskImage: "radial-gradient(circle 20px at 50% 0%, transparent 20px, black 21px)",
            borderRadius: "0 0 12px 12px",
          }}
        >
          {/* Top brand row */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2">
              <svg width="26" height="26" viewBox="0 0 512 512">
                <path fill="white" d="M256 0l79.1 160.3L512 185.9l-128 124.8 30.2 176.3L256 403.9 97.8 487l30.2-176.3L0 185.9l176.9-25.6z"/>
                <text x="50%" y="67%" textAnchor="middle" fill="#041d21" fontSize="190" fontFamily="Arial" fontWeight="900">T</text>
              </svg>
              <span className="text-white font-black text-[17px] tracking-tight">TICKETEK</span>
            </div>
            <div className="text-right">
              <div className="text-[#eadd62] text-[11px] font-bold">{ticket.event_date}</div>
              <div className="text-white text-[9px] tracking-wide mt-0.5 uppercase opacity-80">{ticket.event_name}</div>
            </div>
          </div>

          {/* Venue + event + image row */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 mr-4">
              <div className="text-[#eadd62] text-[11px] font-extrabold uppercase tracking-wide mb-1">{ticket.venue_name}</div>
              <div className="text-white font-bold text-base leading-tight">{ticket.ticket_type || "GENERAL ADMISSION"}</div>
            </div>
            {ticket.event_image && (
              <img
                src={ticket.event_image}
                alt={ticket.event_name}
                className="w-[72px] h-[90px] object-cover flex-shrink-0"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
              />
            )}
          </div>

          {/* Seat info */}
          <div className="flex mb-auto">
            <div className="mr-8">
              <div className="text-[#eadd62] text-[10px] font-extrabold uppercase tracking-wide mb-1">SECTION</div>
              <div className="text-white font-bold text-base">{ticket.section_bay || "GA"}</div>
            </div>
            <div>
              <div className="text-[#eadd62] text-[10px] font-extrabold uppercase tracking-wide mb-1">ROW/SEAT</div>
              <div className="text-white font-bold text-base">{ticket.row ? `${ticket.row} / ${ticket.seat_number}` : "-"}</div>
            </div>
          </div>

          {/* Ticketek watermark */}
          <div className="flex items-center justify-center my-4 opacity-20">
            <svg width="48" height="48" viewBox="0 0 512 512">
              <path fill="white" d="M256 0l79.1 160.3L512 185.9l-128 124.8 30.2 176.3L256 403.9 97.8 487l30.2-176.3L0 185.9l176.9-25.6z"/>
            </svg>
          </div>

          {/* Barcode area */}
          <div className="bg-white rounded-md p-3 flex flex-col items-center mt-2">
            <img
              src={barcodeUrl}
              alt="Barcode"
              className="w-full h-[70px] object-contain"
            />
            <div className="mt-2 font-mono font-bold text-sm tracking-widest text-gray-800">{ticket.serial_number || "29429548996992"}</div>
          </div>
        </div>
      </div>

      {/* Footer dots */}
      <div className="flex justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-gray-800" />
        <div className="w-2 h-2 rounded-full bg-gray-400" />
      </div>
    </div>
  );
}