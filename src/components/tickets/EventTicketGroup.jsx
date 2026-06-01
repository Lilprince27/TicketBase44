import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShareModal from "./ShareModal";

export default function EventTicketGroup({ tickets }) {
  const navigate = useNavigate();
  const [shareModalSeat, setShareModalSeat] = useState(null);
  const first = tickets[0];

  return (
    <div className="border border-gray-200 rounded overflow-hidden mb-5 bg-white">
      {/* Shared dark header */}
      <div className="flex text-white text-center" style={{ backgroundColor: "#051c2c" }}>
        <div className="flex-1 py-3 border-r border-white/20">
          <div className="text-[10px] uppercase tracking-wide" style={{ color: "#a0acb5" }}>Order Date</div>
          <div className="text-sm font-bold mt-1">{first.purchase_date}</div>
        </div>
        <div className="flex-1 py-3">
          <div className="text-[10px] uppercase tracking-wide" style={{ color: "#a0acb5" }}>Order Number</div>
          <div className="text-[11px] font-bold mt-1 px-2 break-all">{first.order_number}</div>
        </div>
      </div>

      {/* Shared event info */}
      <div className="flex p-4 items-center gap-4">
        <img
          src={first.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"}
          alt={first.event_name}
          className="w-[68px] h-[68px] rounded-full object-cover bg-gray-200 flex-shrink-0"
        />
        <div>
          <h2 className="text-[17px] font-semibold text-gray-800 mb-1">{first.event_name}</h2>
          <div className="text-sm font-bold text-gray-700">{first.event_date}</div>
          <div className="text-xs text-gray-500 mt-0.5">{first.venue_name}</div>
        </div>
      </div>

      {/* Marketplace notice */}
      {first.marketplace_notice && (
        <div className="flex items-stretch border border-gray-200 rounded mx-4 mb-3 overflow-hidden">
          <div className="w-11 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#fbd44d" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </div>
          <div className="px-3 py-3 text-[13px] text-gray-600 leading-snug flex-1">
            This ticket was purchased on Ticketek Marketplace.
          </div>
        </div>
      )}

      {/* Per-seat blocks */}
      <div style={{ backgroundColor: "#f1f1f1" }} className="border-t border-gray-200">
        {tickets.map((ticket, idx) => (
          <div key={ticket.id}>
            {idx > 0 && <div className="border-t border-gray-300 mx-4" />}
            <div className="px-5 py-4">
              {/* Type row */}
              <div className="flex text-center border-b border-gray-300 pb-3 mb-3">
                <div className="flex-1 text-sm font-bold text-gray-600">{ticket.ticket_type || "Reserve"}</div>
                <div className="w-px bg-gray-300" />
                <div className="flex-1 text-sm font-bold text-gray-600">Admit</div>
              </div>
              {/* Seat grid */}
              <div className="flex text-center">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase mb-1">Section</div>
                  <div className="font-bold text-gray-700 text-base">{ticket.section_bay || "-"}</div>
                </div>
                <div className="w-px bg-gray-300 my-1" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase mb-1">Row</div>
                  <div className="font-bold text-gray-700 text-base">{ticket.row || "-"}</div>
                </div>
                <div className="w-px bg-gray-300 my-1" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase mb-1">Seat</div>
                  <div className="font-bold text-gray-700 text-base">{ticket.seat_number}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shared buttons at bottom */}
      <div className="flex gap-3 px-4 py-4 bg-white">
        <button
          onClick={() => navigate(`/ticket-detail/${first.id}`)}
          className="flex-1 py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer"
          style={{ backgroundColor: "#5a823a" }}
        >
          View
        </button>
        <button
          onClick={() => setShareModalSeat(first.seat_number)}
          className="flex-1 py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer"
          style={{ backgroundColor: "#2a4e7e" }}
        >
          Share
        </button>
      </div>

      {/* Dotted separator */}
      <div className="mx-4 border-t-2 border-dashed border-gray-300 mb-2" />

      {shareModalSeat && (
        <ShareModal seatNumber={shareModalSeat} onClose={() => setShareModalSeat(null)} />
      )}
    </div>
  );
}