import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppleWalletModal from "../components/tickets/AppleWalletModal";
import ShareModal from "../components/tickets/ShareModal";
import SendTicketModal from "../components/tickets/SendTicketModal";


const isAndroid = () => /android/i.test(navigator.userAgent);

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hideSettings, setHideSettings] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const showWallet = searchParams.get('modal') === 'wallet';
  const showShare = searchParams.get('modal') === 'share';
  const showSend = searchParams.get('modal') === 'send';

  useEffect(() => {
    base44.entities.HideSettings.list().then(list => {
      if (list.length > 0) setHideSettings(list[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id || id === ':id') { setLoading(false); return; }
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

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket.serial_number}`;

  return (
    <div style={{ margin: "0 auto", backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "-apple-system, system-ui, sans-serif", color: "#000", maxWidth: 500 }}>
      {showWallet && <AppleWalletModal ticket={ticket} onClose={() => navigate(-1)} />}
      {showShare && <ShareModal ticket={ticket} onClose={() => navigate(-1)} onTransferred={() => navigate("/tickets", { replace: true })} />}
      {showSend && <SendTicketModal ticket={ticket} onClose={() => navigate(-1)} />}

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "white", height: 55, display: "flex", alignItems: "center", borderBottom: "1px solid #ddd" }}>
        <button onClick={() => navigate("/tickets")} style={{ padding: "0 15px", background: "none", border: "none", cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div style={{ flex: 1, textAlign: "center", fontWeight: 500, fontSize: 18, marginRight: 45 }}>Ticket</div>
      </div>

      <div style={{ padding: 12 }}>
        {/* Top card */}
        <div style={{ background: "white", marginBottom: 8, padding: "30px 0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 25 }}>
            <p style={{ fontSize: 13, color: "#777", margin: 0 }}>{ticket.venue_name}</p>
            <h1 style={{ fontSize: 26, margin: "6px 0", fontWeight: 700, letterSpacing: "-0.5px" }}>{ticket.event_name}</h1>
            <p style={{ fontSize: 13, color: "#333", margin: 0 }}>{ticket.presenter}</p>
          </div>

          {ticket.barcode_locked ? (
            /* Locked barcode — centered */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#000" }}>
                  <strong>{ticket.ticket_type || "Adult"}</strong><br />{ticket.price}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#000", textAlign: "right" }}>
                  <strong>Held by</strong><br />{ticket.holder_name}
                </div>
              </div>
              <div style={{ position: "relative", width: 110, height: 110, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src={qrUrl} alt="QR" style={{ width: "100%", height: "100%" }} />
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.5)", backdropFilter: "blur(2px)" }} />
                <div style={{ position: "absolute", zIndex: 10 }}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="#000033">
                    <path d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm3 8H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: 11, marginTop: 10, color: "#000", textAlign: "center" }}>
                {ticket.auth_message || "This ticket will be unlocked prior to the event"}
              </span>
            </div>
          ) : (
            /* Unlocked — normal layout */
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 25px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, width: 90, color: "#000" }}>
                  <strong>{ticket.ticket_type || "Adult"}</strong><br />{hideSettings.hide_ticket_price ? "" : ticket.price}
                </div>
              <div style={{ textAlign: "center" }}>
                <img src={qrUrl} alt="QR Code" style={{ width: 95, height: 95 }} />
                <span style={{ display: "block", fontSize: 11, marginTop: 10, color: "#000" }}>{ticket.serial_number}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, width: 90, color: "#000", textAlign: "right" }}>
                <strong>Held by</strong><br />{ticket.holder_name}
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, marginTop: 25, color: "#000" }}>
            {ticket.event_date}
          </div>
        </div>

        {/* Bottom card */}
        <div style={{ background: "white", marginBottom: 8, padding: "20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: 30 }}>
            {[
              { label: "Enter Via Door", val: hideSettings.hide_entrance ? "-" : (ticket.door_area || "-") },
              { label: "Section", val: ticket.section_bay || "-" },
              { label: "Row", val: ticket.row || "-" },
              { label: "Seat", val: ticket.seat_number || "-" },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <span style={{ fontSize: 10, color: "#000", textTransform: "uppercase", display: "block" }}>{item.label}</span>
                <strong style={{ display: "block", fontSize: 17, marginTop: 4, color: "#000" }}>{item.val}</strong>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            {[
              { label: "Event", val: ticket.event_code },
              { label: "Trans No.", val: ticket.transaction_number },
              { label: "Purchased", val: hideSettings.hide_purchase_date ? "-" : ticket.purchase_date },
              { label: "Seller", val: ticket.seller_id },
              { label: "Pax No.", val: ticket.pax_number },
            ].map(item => (
              <div key={item.label} style={{ fontSize: "9.5px", color: "#000", fontWeight: 500 }}>
                <span style={{ fontSize: 10, color: "#000", textTransform: "uppercase", display: "block" }}>{item.label}</span>
                {item.val}
              </div>
            ))}
          </div>
        </div>

        {/* Share button */}
        {!hideSettings.hide_share_button && (
          <button
            onClick={() => setSearchParams({ modal: 'share' })}
            style={{ backgroundColor: "#43822a", color: "white", width: "100%", border: "none", padding: "12px", fontSize: 17, borderRadius: 4, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" }}
          >
            <svg style={{ width: 32, height: 32 }} viewBox="0 0 24 24" fill="none">
              <g transform="translate(12, 12) scale(0.85) translate(-12, -12) rotate(-45 12 12)">
                <path d="M 5 7 H 19 V 10 C 16.5 10 16.5 14 19 14 V 17 H 5 V 14 C 7.5 14 7.5 10 5 10 Z" fill="white"/>
              </g>
              <g transform="translate(3.5, 3.5)">
                <circle cx="5" cy="5" r="5.5" fill="#43822a"/>
                <circle cx="5" cy="5" r="4.5" fill="white"/>
                <polygon points="4.2,3.2 7.0,3.2 7.0,6.0" fill="#43822a"/>
                <path d="M 3.6 6.4 L 5.2 4.8" stroke="#43822a" strokeWidth="1" strokeLinecap="round"/>
              </g>
            </svg>
            Share ticket
          </button>
        )}

        {/* Send to any email - secure link + PDF (no transfer, no registration required) */}
        <button
          onClick={() => setSearchParams({ modal: 'send' })}
          style={{ backgroundColor: "#003057", color: "white", width: "100%", border: "none", padding: "12px", fontSize: 17, borderRadius: 4, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" }}
        >
          <svg style={{ width: 26, height: 26 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>
          </svg>
          Send to email
        </button>

        {/* Wallet button - switches between Apple/Google based on OS */}
        {!hideSettings.hide_wallet_button && (
          isAndroid() ? (
            <button
              onClick={() => setSearchParams({ modal: 'wallet' })}
              style={{ backgroundColor: "#000", color: "white", width: "100%", border: "none", padding: "12px 24px", fontSize: 20, borderRadius: 8, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 0, cursor: "pointer", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
            >
              <img src="https://www.image2url.com/r2/default/images/1779671280742-1ae995e2-3a65-482a-9305-9de9fedcb5da.jpeg" alt="Google Wallet" style={{ width: 32, height: 32, marginRight: 14, objectFit: "contain", display: "block" }} />
              Add to Google Wallet
            </button>
          ) : (
            <button
              onClick={() => setSearchParams({ modal: 'wallet' })}
              style={{ backgroundColor: "black", color: "white", width: "100%", border: "none", padding: "8px", fontSize: 16, borderRadius: 6, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}
            >
              <img src="https://www.image2url.com/r2/default/images/1777758037946-fd4ad460-0bfd-4c21-9c8f-3949e32a0c92.jpeg" alt="Wallet Icon" style={{ height: 32 }} />
              Add to Apple Wallet
            </button>
          )
        )}

        {/* Fine print */}
        <div className="selectable-text" style={{ padding: "25px 8px", fontSize: "10.5px", color: "#777", lineHeight: 1.4 }}>
          <p><strong>Ticketek Pty Limited ABN 92 010 129 110</strong></p>
          <p>Each mobile ticket has a unique bar code. This bar code allows one entry only so please ensure that each individual attending the event has his or her own mobile ticket.</p>
          <p>Do not give a copy of your mobile ticket to anyone and do not buy a mobile ticket except from Ticketek's website, mobile site, call centre or agencies. If there are multiple copies of a mobile ticket, only the 1st copy to be scanned on arrival at the event will allow the ticket holder entry. Additional copies will fail the scanning process and will not be granted entry.</p>
        </div>
      </div>


    </div>
  );
}