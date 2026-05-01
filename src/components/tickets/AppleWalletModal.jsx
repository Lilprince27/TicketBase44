import { useState, useEffect, useRef } from "react";

export default function AppleWalletModal({ ticket, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const index = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth);
    setActiveIndex(index);
  };

  const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=pdf417&text=${encodeURIComponent(ticket.serial_number || "29429548996992")}&scale=3&rotate=N`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ backgroundColor: "#f2f2f7", paddingTop: "env(safe-area-inset-top)", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif" }}
    >
      {/* iOS Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px" }}>
        <button
          onClick={onClose}
          style={{ background: "#e5e5ea", width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div style={{ background: "#e5e5ea", height: 32, borderRadius: 16, display: "flex", alignItems: "center", padding: "0 4px" }}>
          <div style={{ padding: "0 10px", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </div>
          <div style={{ width: 1, height: 18, background: "rgba(0,0,0,0.1)" }} />
          <div style={{ padding: "0 10px", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          gap: 12,
          padding: "10px 16px",
          height: "52vh",
          scrollbarWidth: "none",
        }}
      >
        <div style={{
          minWidth: "100%",
          backgroundColor: "#001219",
          borderRadius: 4,
          scrollSnapAlign: "center",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}>
          {/* Wallet notch */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 48, height: 18, backgroundColor: "#f2f2f7",
            borderBottomLeftRadius: 24, borderBottomRightRadius: 24, zIndex: 5,
          }} />

          {/* Ticket header */}
          <div style={{ padding: "24px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <img
                src="https://www.image2url.com/r2/default/images/1776115511261-33f41994-bec5-4f75-8a10-49d856fb6d1f.jpeg"
                style={{ height: 16, width: "auto", filter: "brightness(0) invert(1)" }}
                alt="Logo"
              />
              <span style={{ color: "white", fontWeight: 800, fontSize: 14, letterSpacing: "0.2px", textTransform: "uppercase" }}>Ticketek</span>
            </div>
            <div style={{ textAlign: "right", color: "white" }}>
              <div style={{ color: "#d7e94e", fontSize: 11, fontWeight: 700 }}>{ticket.event_date}</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>{ticket.event_name}</div>
            </div>
          </div>

          {/* Banner image */}
          {ticket.event_image ? (
            <img src={ticket.event_image} alt={ticket.event_name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: 140, background: "linear-gradient(135deg, #001a35 0%, #003060 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No Image</span>
            </div>
          )}

          {/* Ticket body */}
          <div style={{ padding: "15px 20px", flex: 1 }}>
            <div style={{ color: "#d7e94e", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{ticket.venue_name}</div>
            <div style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "4px 0 12px" }}>{ticket.level_stand || "GROUND LEVEL"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div>
                <div style={{ color: "#d7e94e", fontSize: 10, fontWeight: 700, marginBottom: 2 }}>SECTION</div>
                <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>{ticket.section_bay || "GA"}</div>
              </div>
              <div>
                <div style={{ color: "#d7e94e", fontSize: 10, fontWeight: 700, marginBottom: 2 }}>ROW/SEAT</div>
                <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>{ticket.row ? `${ticket.row}/${ticket.seat_number}` : "-"}</div>
              </div>
              <div>
                <div style={{ color: "#d7e94e", fontSize: 10, fontWeight: 700, marginBottom: 2 }}>DOOR/GATE</div>
                <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>{ticket.door_area || "-"}</div>
              </div>
            </div>
          </div>

          {/* Signal waves */}
          <div style={{ position: "absolute", bottom: 15, right: 15, display: "flex", alignItems: "flex-end", gap: 2.5 }}>
            {[
              { width: 14, height: 18 },
              { width: 10, height: 14 },
              { width: 7, height: 10 },
              { width: 4, height: 6 },
            ].map((w, i) => (
              <span key={i} style={{ borderRight: "2px solid rgba(255,255,255,0.8)", borderRadius: "0 100% 100% 0", display: "block", width: w.width, height: w.height }} />
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "15px 0" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === activeIndex ? "#8e8e93" : "#d1d1d6" }} />
        ))}
      </div>

      {/* NFC section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 40 }}>
        <div style={{ width: 58, height: 58, border: "2px solid #007aff", borderRadius: "50%", display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 12, overflow: "hidden" }}>
          <div style={{ width: 24, height: 34, border: "2px solid #007aff", borderRadius: 4, borderBottom: 0, position: "relative", marginBottom: 0 }} />
        </div>
        <div style={{ color: "#8e8e93", fontSize: 16 }}>Hold Near Reader</div>
      </div>
    </div>
  );
}