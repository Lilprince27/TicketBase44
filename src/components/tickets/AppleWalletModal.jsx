import TicketekLogo from "../TicketekLogo";

export default function AppleWalletModal({ ticket, onClose }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket?.serial_number || ticket?.id || "ticket"}`;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ backgroundColor: "#1a1a1a", paddingTop: "env(safe-area-inset-top)", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif" }}>
      {/* Top bar with Done */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "14px 20px" }}>
        <span onClick={onClose} style={{ fontSize: 17, fontWeight: 600, color: "#ffffff", cursor: "pointer" }}>Done</span>
      </div>

      {/* Centered ticket card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px 30px" }}>
        <div style={{ backgroundColor: "#000000", borderRadius: 14, overflow: "hidden", width: "100%", maxWidth: 360, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          {/* Top: TICKETEK logo + date/event in lime */}
          <div style={{ padding: "16px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <TicketekLogo size={18} variant="white" />
              <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>TICKETEK</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#dfff00", fontSize: 11, fontWeight: 600 }}>{ticket?.event_date || ""}</div>
              <div style={{ color: "#dfff00", fontSize: 17, fontWeight: 700, marginTop: 2, lineHeight: 1.1 }}>{ticket?.event_name || ""}</div>
            </div>
          </div>

          {/* Event image */}
          {ticket?.event_image ? (
            <img src={ticket.event_image} alt={ticket?.event_name} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: 150, background: "linear-gradient(135deg, #111111 0%, #333333 100%)" }} />
          )}

          {/* Body details */}
          <div style={{ padding: "16px" }}>
            <div style={{ color: "#dfff00", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{ticket?.venue_name || ""}</div>
            <div style={{ color: "#ffffff", fontSize: 22, fontWeight: 700, margin: "6px 0 16px" }}>{ticket?.level_stand || "FLOOR LEVEL"}</div>

            {/* Metadata grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, paddingBottom: 16 }}>
              {[
                { label: "SECTION", val: ticket?.section_bay || "GA" },
                { label: "ROW/SEAT", val: ticket?.row ? `${ticket.row}/${ticket.seat_number || "-"}` : (ticket?.seat_number || "-") },
                { label: "DOOR/GATE", val: ticket?.door_area || ticket?.entry_gate || "Entry A" },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: i === 1 ? "center" : i === 2 ? "right" : "left" }}>
                  <div style={{ color: "#dfff00", fontSize: 9, fontWeight: 700, letterSpacing: 0.5 }}>{item.label}</div>
                  <div style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, marginTop: 4 }}>{item.val}</div>
                </div>
              ))}
            </div>

            {/* Barcode in white rounded container */}
            <div style={{ background: "#ffffff", borderRadius: 10, padding: 14, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src={qrUrl} alt="Barcode" style={{ width: 150, height: 150, objectFit: "contain" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}