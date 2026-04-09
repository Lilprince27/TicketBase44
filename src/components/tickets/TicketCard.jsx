import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShareModal from "./ShareModal";

export default function TicketCard({ ticket }) {
  const [shareModalSeat, setShareModalSeat] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="border border-gray-200 rounded overflow-hidden mb-6">
      {/* Dark meta bar */}
      <div className="flex text-white text-center" style={{ backgroundColor: "#001529" }}>
        <div className="flex-1 py-3 border-r border-white/15">
          <div className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Order Date</div>
          <div className="text-sm font-bold">{ticket.purchase_date}</div>
        </div>
        <div className="flex-1 py-3">
          <div className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Order Number</div>
          <div className="text-sm font-bold">{ticket.order_number}</div>
        </div>
      </div>

      {/* Artist section */}
      <div className="flex p-4 items-start gap-4">
        <img
          src={ticket.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"}
          alt={ticket.event_name}
          className="w-[70px] h-[70px] rounded-full object-cover bg-gray-200"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800 m-0 mb-1">{ticket.event_name}</h2>
          <p className="text-sm text-gray-600 leading-snug">
            <strong>{ticket.event_date} - {ticket.ticket_type || "Admit"}</strong>
          </p>
          <p className="text-sm text-gray-600">{ticket.venue_name}</p>
        </div>
      </div>

      {/* Seating info */}
      <div className="flex text-center border-t border-gray-200 bg-gray-100">
        <div className="flex-1 py-3">
          <div className="text-sm text-gray-600">{ticket.ticket_type || "Reserve"}</div>
        </div>
        <div className="w-px bg-gray-300 my-2" />
        <div className="flex-1 py-3">
          <div className="text-sm text-gray-600">Admit</div>
        </div>
      </div>
      <div className="flex text-center bg-gray-100">
        <div className="flex-1 py-3">
          <div className="text-xs text-gray-500 uppercase mb-1">Section</div>
          <div className="font-bold text-gray-800">{ticket.section_bay || "-"}</div>
        </div>
        <div className="w-px bg-gray-300 my-2" />
        <div className="flex-1 py-3">
          <div className="text-xs text-gray-500 uppercase mb-1">Row</div>
          <div className="font-bold text-gray-800">{ticket.row || "-"}</div>
        </div>
        <div className="w-px bg-gray-300 my-2" />
        <div className="flex-1 py-3">
          <div className="text-xs text-gray-500 uppercase mb-1">Seat</div>
          <div className="font-bold text-gray-800">{ticket.seat_number}</div>
        </div>
      </div>

      {/* Dotted separator */}
      <div className="mx-4 border-t-2 border-dashed border-gray-300 my-0" />

      {/* Marketplace banner */}
      {ticket.marketplace_notice && (
        <div className="flex items-center gap-3 mx-4 my-3 px-3 py-3 rounded" style={{ backgroundColor: "#fef3c7" }}>
          <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#f59e0b" }}>
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="white"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </div>
          <span className="text-sm text-gray-800">This ticket was purchased on Ticketek Marketplace.</span>
        </div>
      )}

      {/* Buttons */}
        <ShareModal seatNumber={shareModalSeat} onClose={() => setShareModalSeat(null)} />
      )}
    </div>
  );
}