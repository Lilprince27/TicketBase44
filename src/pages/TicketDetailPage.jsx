import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const tickets = await base44.entities.Ticket.filter({ id });
      if (tickets.length > 0) setTicket(tickets[0]);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Ticket not found
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${ticket.serial_number}`;

  return (
    <div className="bg-white min-h-screen max-w-[400px] mx-auto">
      {/* Nav header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/tickets")} className="text-2xl text-gray-800 mr-auto font-light">
          ‹
        </button>
        <span className="text-base font-medium absolute left-1/2 -translate-x-1/2">{ticket.event_name}</span>
        <div className="w-6" />
      </div>

      {/* Brand banner */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ backgroundColor: "#003057" }}>
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-11.5 8.5 4.3-11.4-6.2-4.5h7.6z" fill="white" />
          </svg>
          <span className="absolute text-[13px] font-black" style={{ color: "#003057", top: "55%", left: "50%", transform: "translate(-50%,-50%)" }}>T</span>
        </div>
        <div className="text-white font-black text-2xl tracking-tight uppercase">TICKETEK</div>
      </div>

      {/* Event details */}
      <div className="text-center py-5 px-2 text-gray-500 text-sm">
        {ticket.venue_name}<br />
        {ticket.presenter}
        <h2 className="text-gray-800 text-lg mt-1 uppercase font-bold">{ticket.event_name}</h2>
      </div>

      {/* Barcode section */}
      <div className="flex justify-between items-center px-6">
        <div className="text-xs text-gray-500 w-24 text-left leading-tight">
          {ticket.ticket_type || "Admit"}<br />
          <b>{ticket.price}</b>
        </div>
        <img src={qrUrl} alt="QR Code" className="w-[140px] h-[140px]" />
        <div className="text-xs text-gray-800 w-24 text-right leading-tight">
          Held by {ticket.holder_name}
        </div>
      </div>

      <div className="text-center text-sm font-bold mt-1 text-gray-800">{ticket.serial_number}</div>
      <div className="text-center text-sm mt-1 mb-5 text-gray-800 uppercase">{ticket.event_date}</div>

      {/* Divider */}
      <div className="border-t-2 mx-2.5 mb-5" style={{ borderColor: "#a5d1d6" }} />

      {/* Entry level */}
      <div className="text-center text-xl font-bold uppercase mb-5">
        {ticket.entry_gate}<br />{ticket.level_stand}
      </div>

      {/* Seating grid */}
      <div className="grid grid-cols-4 text-center px-2.5 pb-5">
        <div>
          <div className="text-sm font-bold text-gray-800 mb-1">Door</div>
          <div className="text-xl text-gray-800">{ticket.door_area || "-"}</div>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800 mb-1">Section</div>
          <div className="text-xl text-gray-800">{ticket.section_bay || "-"}</div>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800 mb-1">Row</div>
          <div className="text-xl text-gray-800">{ticket.row || "-"}</div>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800 mb-1">Seat</div>
          <div className="text-xl text-gray-800">{ticket.seat_number}</div>
        </div>
      </div>

      {/* Meta data */}
      <div className="flex justify-around py-2.5 px-1 text-[10px] text-gray-800 text-center font-bold">
        <div>Event<span className="block font-normal text-[11px] mt-0.5">{ticket.event_code}</span></div>
        <div>Trans No.<span className="block font-normal text-[11px] mt-0.5">{ticket.transaction_number}</span></div>
        <div>Purchased<span className="block font-normal text-[11px] mt-0.5">{ticket.purchase_date}</span></div>
        <div>Seller<span className="block font-normal text-[11px] mt-0.5">{ticket.seller_id}</span></div>
        <div>Pax No.<span className="block font-normal text-[11px] mt-0.5">{ticket.pax_number}</span></div>
      </div>

      {/* Action area */}
      <div className="px-5 py-5 flex flex-col gap-4">
        <a href="#" className="flex items-center justify-center bg-black text-white rounded-lg py-3.5 no-underline font-medium">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Apple_Wallet_Icon.svg/1024px-Apple_Wallet_Icon.svg.png" alt="Wallet" className="h-5 mr-2.5" />
          Add to Apple Wallet
        </a>
        <button className="py-4 rounded-full text-white text-base font-bold uppercase border-none cursor-pointer leading-snug" style={{ backgroundColor: "#f1a340" }}>
          Click Here To<br />Check-in To The Arena
        </button>
      </div>

      {/* Legal text */}
      <div className="px-5 pb-24 text-xs text-gray-800 leading-relaxed">
        <div className="font-bold mb-2">Ticketek Pty Limited ABN 92 010 129 110</div>
        <p>Each mobile ticket has a unique bar code. This bar code allows one entry only so please ensure that each individual attending the event has his or her own mobile ticket.</p>
        <p className="mt-2">Do not give a copy of your mobile ticket to anyone and do not buy a mobile ticket except from Ticketek's website, mobile site, call centre or agencies.</p>
      </div>
    </div>
  );
}