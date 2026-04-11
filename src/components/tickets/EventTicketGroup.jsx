import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShareModal from "./ShareModal";

export default function EventTicketGroup({ tickets }) {
  const navigate = useNavigate();
  const [shareModalSeat, setShareModalSeat] = useState(null);
  const first = tickets[0];

  return (
    <div className="border border-gray-200 rounded overflow-hidden mb-6">
      {/* Dark meta bar */}
      <div className="flex text-white text-center" style={{ backgroundColor: "#0c1c28" }}>
        <div className="flex-1 py-3 border-r border-white/15">
          <div className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Order Date</div>
          <div className="text-sm font-bold">{first.purchase_date}</div>
        </div>
        <div className="flex-1 py-3">
          <div className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Order Number</div>
          <div className="text-sm font-bold">{first.order_number}</div>
        </div>
      </div>

      {/* Event info */}
      <div className="flex p-4 items-start gap-4">
        <img
          src={first.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"}
          alt={first.event_name}
          className="w-[60px] h-[60px] rounded-full object-cover bg-gray-200 flex-shrink-0"
        />
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">{first.event_name}</h2>
          <p className="text-sm font-semibold text-gray-700">{first.event_date} - {first.ticket_type || "Admit"}</p>
          <p className="text-xs text-gray-500">{first.venue_name}</p>
        </div>
      </div>

      {/* Individual tickets */}
      <div className="bg-gray-50">
        {tickets.map((ticket, idx) => (
          <div key={ticket.id}>
            {idx > 0 && <div className="mx-4 border-t border-dashed border-gray-300" />}
            <div className="px-4 py-4">
              {/* Type row */}
              <div className="flex text-center border-b border-gray-200 pb-3 mb-3">
                <div className="flex-1 text-sm font-semibold text-gray-700">{ticket.ticket_type || "Reserve"}</div>
                <div className="w-px bg-gray-300" />
                <div className="flex-1 text-sm font-semibold text-gray-700">Admit</div>
              </div>

              {/* Seat details */}
              <div className="flex text-center mb-4">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase mb-1">Section</div>
                  <div className="font-bold text-gray-800">{ticket.section_bay || "-"}</div>
                </div>
                <div className="w-px bg-gray-300 my-1" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase mb-1">Row</div>
                  <div className="font-bold text-gray-800">{ticket.row || "-"}</div>
                </div>
                <div className="w-px bg-gray-300 my-1" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase mb-1">Seat</div>
                  <div className="font-bold text-gray-800">{ticket.seat_number}</div>
                </div>
              </div>

              {/* Marketplace notice */}
              {ticket.marketplace_notice && (
                <div className="flex items-stretch border border-gray-200 rounded mb-4 overflow-hidden">
                  <div className="w-10 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#fbd44d" }}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="black">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                    </svg>
                  </div>
                  <div className="px-3 py-2 text-xs text-gray-600 leading-relaxed flex-1">
                    This ticket was purchased on Ticketek Marketplace.
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/ticket-detail/${ticket.id}`)}
                  className="flex-1 py-3 rounded-lg text-white font-semibold text-sm border-none cursor-pointer"
                  style={{ backgroundColor: "#3a7d2c" }}
                >
                  View
                </button>
                <button
                  onClick={() => setShareModalSeat(ticket.seat_number)}
                  className="flex-1 py-3 rounded-lg text-white font-semibold text-sm border-none cursor-pointer"
                  style={{ backgroundColor: "#0c4d7d" }}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 border-t-2 border-dashed border-gray-300 mb-2" />

      {shareModalSeat && (
        <ShareModal seatNumber={shareModalSeat} onClose={() => setShareModalSeat(null)} />
      )}
    </div>
  );
}