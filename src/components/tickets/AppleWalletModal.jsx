import TicketekLogo from "../TicketekLogo";

const YELLOW = "#FFD700";

export default function AppleWalletModal({ ticket, onClose }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket?.serial_number || ticket?.id || "ticket"}`;
  const eventName = (ticket?.event_name || "").toUpperCase();
  const venue = (ticket?.venue_name || "").toUpperCase();
  const ticketType = (ticket?.ticket_type || "General Admission - Admit").toUpperCase();
  const sectionVal = (ticket?.level_stand || ticket?.section_bay || "FLOOR").toUpperCase();
  const rowSeatVal = ticket?.row ? `${ticket.row}/${ticket.seat_number || "-"}` : (ticket?.seat_number || "GA1");
  const aisleVal = ticket?.door_area || ticket?.entry_gate || "6/7";

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ backgroundColor: "#000000", paddingTop: "env(safe-area-inset-top)", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif" }}>
      {/* Top bar with Done */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "14px 20px" }}>
        <span onClick={onClose} style={{ fontSize: 17, fontWeight: 600, color: "#ffffff", cursor: "pointer" }}>Done</span>
      </div>

      {/* Centered ticket card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px 30px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 360 }}>
          {/* Die-cut notch at top center */}
          <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", width: 20, height: 20, borderRadius: "50%", background: "#000000", zIndex: 2 }} />

          <div style={{ backgroundColor: "#000000", borderRadius: 12, overflow: "hidden" }}>
            {/* Header: TICKETEK left, date + event right */}
            <div style={{ padding: "16px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <TicketekLogo size={18} variant="white" />
                <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>TICKETEK</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#ffffff", fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>{ticket?.event_date || ""}</div>
                <div style={{ color: "#ffffff", fontSize: 15, fontWeight: 800, marginTop: 2, lineHeight: 1.1 }}>{eventName}</div>
              </div>
            </div>

            {/* Event image */}
            {ticket?.event_image ? (
              <img src={ticket.event_image} alt={ticket?.event_name} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: 150, background: "linear-gradient(135deg, #111111 0%, #333333 100%)" }} />
            )}

            {/* Venue + ticket type */}
            <div style={{ padding: "16px 16px 8px" }}>
              <div style={{ color: YELLOW, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{venue}</div>
              <div style={{ color: "#ffffff", fontSize: 20, fontWeight: 800, marginTop: 6, textTransform: "uppercase" }}>{ticketType}</div>
            </div>

            {/* Three columns */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px 18px", gap: 8 }}>
              {[
                { label: "SECTION", val: sectionVal },
                { label: "ROW/SEAT", val: rowSeatVal },
                { label: "AISLE", val: aisleVal },
              ].map((col, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ color: YELLOW, fontSize: 9, fontWeight: 700, letterSpacing: 0.5 }}>{col.label}</div>
                  <div style={{ color: "#ffffff", fontSize: 18, fontWeight: 800, marginTop: 4 }}>{col.val}</div>
                </div>
              ))}
            </div>

            {/* Barcode in white block */}
            <div style={{ padding: "0 16px 18px", display: "flex", justifyContent: "center" }}>
              <div style={{ background: "#ffffff", borderRadius: 8, padding: 12, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src={qrUrl} alt="Barcode" style={{ width: 150, height: 80, objectFit: "contain" }} />
              </div>
            </div>

            {/* Footer star logo */}
            <div style={{ padding: "0 16px 16px", display: "flex", justifyContent: "flex-start" }}>
              <TicketekLogo size={18} variant="white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}