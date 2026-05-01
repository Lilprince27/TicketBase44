import { useState, useEffect } from "react";
import LockedBarcode from "../components/tickets/LockedBarcode";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppleWalletModal from "../components/tickets/AppleWalletModal";

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWallet, setShowWallet] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContact, setShareContact] = useState("");
  const [shareName, setShareName] = useState("");

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

  const handleAppleWallet = () => {
    setShowWallet(true);
  };

  return (
    <div className="bg-white min-h-screen max-w-[400px] mx-auto">
      {showWallet && <AppleWalletModal ticket={ticket} onClose={() => setShowWallet(false)} />}
      {/* Nav header */}
      <div className="flex items-center px-4 mt-8 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/tickets")} className="text-2xl text-gray-800 mr-auto font-light">
          ‹
        </button>
        <span className="text-base font-medium absolute left-1/2 -translate-x-1/2">{ticket.event_name}</span>
        <div className="w-6" />
      </div>

      {/* Brand banner */}
      <div style={{ backgroundColor: "#003057" }}>
        <img
          src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/66789a9ba_IMG_7114.jpeg"
          alt="Ticketek"
          className="w-full h-12 object-cover object-left"
        />
      </div>

      {/* Event details */}
      <div className="text-center py-5 px-2 text-gray-500 text-sm">
        {ticket.venue_name}<br />
        {ticket.presenter}
        <h2 className="text-gray-800 text-lg mt-1 uppercase font-bold">{ticket.event_name}</h2>
      </div>

      {/* Barcode section */}
      {ticket.barcode_locked ? (
        <div className="py-4">
          <LockedBarcode holderName={ticket.holder_name} ticketType={ticket.ticket_type} authMessage={ticket.auth_message} />
        </div>
      ) : (
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
      )}

      {!ticket.barcode_locked && <div className="text-center text-sm font-bold mt-1 text-gray-800">{ticket.serial_number}</div>}
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
        <button onClick={handleAppleWallet} className="flex items-center justify-center bg-black text-white rounded-lg py-3.5 font-medium w-full border-none cursor-pointer">
          <img src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/f6963ff4b_IMG_7127.jpeg" alt="Wallet" className="h-7 mr-2.5 object-contain" />
          Add to Apple Wallet
        </button>
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center justify-center text-white rounded-lg py-3.5 font-medium w-full border-none cursor-pointer"
          style={{ backgroundColor: "#001a2c" }}
        >
          Share
        </button>

        {/* Share Modal */}
        {showShareModal && (
          <div
            className="fixed inset-0 z-[9999] flex items-end justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={() => setShowShareModal(false)}
          >
            <div
              className="w-full max-w-[400px] bg-white rounded-t-2xl pb-8"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 pt-6 pb-4 border-b border-gray-200">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="#f0f0f0"/>
                  <path d="M27 13H13a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V15a2 2 0 00-2-2z" stroke="#999" strokeWidth="1.5" fill="none"/>
                  <line x1="20" y1="13" x2="20" y2="27" stroke="#999" strokeWidth="1.5" strokeDasharray="2 2"/>
                  <circle cx="20" cy="13" r="2" fill="#999"/>
                </svg>
                <div>
                  <div className="font-bold text-gray-800 text-base">Share ticket for Seat - {ticket.seat_number}</div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    Securely share tickets.{" "}
                    <span className="text-blue-600 font-medium">How it works</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="px-5 pt-5 pb-4">
                {/* Mobile/Email input */}
                <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3.5 mb-3 bg-white">
                  <input
                    type="text"
                    placeholder="Enter mobile or email"
                    value={shareContact}
                    onChange={e => setShareContact(e.target.value)}
                    className="flex-1 text-base text-gray-700 outline-none bg-transparent placeholder-gray-400"
                  />
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <circle cx="17" cy="17" r="17" fill="#e8f0fa"/>
                    <circle cx="17" cy="12" r="5" fill="#1d4e89"/>
                    <path d="M7 28c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="#1d4e89"/>
                    <circle cx="24" cy="10" r="5" fill="#1d4e89" stroke="white" strokeWidth="1.5"/>
                    <line x1="24" y1="7.5" x2="24" y2="12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="21.5" y1="10" x2="26.5" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* Name input */}
                <div className="border border-gray-300 rounded-xl px-4 py-3.5 mb-4 bg-white">
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={shareName}
                    onChange={e => setShareName(e.target.value)}
                    className="w-full text-base text-gray-700 outline-none bg-transparent placeholder-gray-400"
                  />
                </div>

                {/* Consent text */}
                <p className="text-sm text-gray-400 text-center px-2 mb-4 leading-relaxed">
                  By entering this information you agree that you have the receiver's consent to do so.
                </p>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-4" />

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowShareModal(false); setShareContact(""); setShareName(""); }}
                    className="flex-1 py-3.5 rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold text-base cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!shareContact.trim() || !shareName.trim()}
                    className="flex-1 py-3.5 rounded-xl text-white font-semibold text-base border-none cursor-pointer transition-colors"
                    style={{ backgroundColor: shareContact.trim() && shareName.trim() ? "#001a2c" : "#d1d5db" }}
                  >
                    Share ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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