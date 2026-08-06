import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function SharedTicketPage() {
  const { token } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return; }
    base44.entities.SharedTicket.filter({ share_token: token }).then(list => {
      if (list.length > 0) {
        try { setTicket(JSON.parse(list[0].ticket_snapshot)); }
        catch { setNotFound(true); }
      } else {
        setNotFound(true);
      }
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ticket not available</h2>
        <p className="text-gray-500">This secure ticket link is invalid or has been removed.</p>
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.serial_number || "")}`;

  return (
    <div style={{ margin: "0 auto", backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "-apple-system, system-ui, sans-serif", color: "#000", maxWidth: 500 }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#003057", color: "white", padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 17l-5.5 3 1-6.3L3 9l6-.9z"/>
        </svg>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Ticketek · Secure Ticket</div>
      </div>

      <div style={{ padding: 12 }}>
        {/* Sender banner */}
        {ticket.sender_name && (
          <div style={{ background: "#eaf3fb", borderRadius: 8, padding: "12px 14px", marginBottom: 8, fontSize: 13, color: "#003057" }}>
            This ticket was shared with you by <strong>{ticket.sender_name}</strong>.
          </div>
        )}

        {/* Event image */}
        {ticket.event_image && (
          <div style={{ background: "white", marginBottom: 8, overflow: "hidden", borderRadius: 6 }}>
            <img src={ticket.event_image} alt={ticket.event_name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
          </div>
        )}

        {/* Top card */}
        <div style={{ background: "white", marginBottom: 8, padding: "30px 0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 25, padding: "0 20px" }}>
            <p style={{ fontSize: 13, color: "#777", margin: 0 }}>{ticket.venue_name}</p>
            <h1 style={{ fontSize: 24, margin: "6px 0", fontWeight: 700, letterSpacing: "-0.5px" }}>{ticket.event_name}</h1>
            <p style={{ fontSize: 13, color: "#333", margin: 0 }}>{ticket.presenter}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 25px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, width: 90, color: "#000" }}>
              <strong>{ticket.ticket_type || "Adult"}</strong><br />{ticket.price}
            </div>
            <div style={{ textAlign: "center" }}>
              <img src={qrUrl} alt="QR Code" style={{ width: 120, height: 120 }} />
              <span style={{ display: "block", fontSize: 11, marginTop: 10, color: "#000" }}>{ticket.serial_number}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, width: 90, color: "#000", textAlign: "right" }}>
              <strong>Held by</strong><br />{ticket.holder_name}
            </div>
          </div>

          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, marginTop: 25, color: "#000" }}>
            {ticket.event_date}
          </div>
        </div>

        {/* Bottom card */}
        <div style={{ background: "white", marginBottom: 8, padding: "20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: 30 }}>
            {[
              { label: "Enter Via Door", val: ticket.door_area || "-" },
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
              { label: "Purchased", val: ticket.purchase_date },
              { label: "Seller", val: ticket.seller_id },
              { label: "Pax No.", val: ticket.pax_number },
            ].map(item => (
              <div key={item.label} style={{ fontSize: "9.5px", color: "#000", fontWeight: 500 }}>
                <span style={{ fontSize: 10, color: "#000", textTransform: "uppercase", display: "block" }}>{item.label}</span>
                {item.val || "-"}
              </div>
            ))}
          </div>
        </div>

        {/* Notice */}
        <div className="selectable-text" style={{ background: "white", borderRadius: 6, padding: "16px 18px", fontSize: 11.5, color: "#555", lineHeight: 1.5, marginBottom: 8 }}>
          <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#003057" }}>Secure view-only ticket</p>
          <p style={{ margin: 0 }}>This ticket was shared with you via a secure link. Each mobile ticket has a unique barcode that allows one entry only. Do not duplicate or forward this ticket.</p>
        </div>

        <div className="selectable-text" style={{ padding: "8px 8px 24px", fontSize: "10.5px", color: "#777", lineHeight: 1.4 }}>
          <p><strong>Ticketek Pty Limited ABN 92 010 129 110</strong></p>
          <p>Do not buy a mobile ticket except from Ticketek's website, mobile site, call centre or agencies. If there are multiple copies of a mobile ticket, only the 1st copy to be scanned on arrival will allow entry.</p>
        </div>
      </div>
    </div>
  );
}