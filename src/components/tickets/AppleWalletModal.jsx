import { useState, useRef } from "react";

export default function AppleWalletModal({ ticket, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const index = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth);
    setActiveIndex(index);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ backgroundColor: "#f2f2f7", paddingTop: "env(safe-area-inset-top)", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif" }}>
      {!showDetails ? (
        <>
          {/* Top Nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px" }}>
            <span style={{ fontSize: 17, fontWeight: 600, cursor: "pointer" }} onClick={onClose}>Done</span>
            <button onClick={() => setShowDetails(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="26" height="26" viewBox="0 0 26 26">
                <circle cx="13" cy="13" r="12" fill="none" stroke="#000" strokeWidth="1.8"/>
                <circle cx="8.5" cy="13" r="1.3" fill="#000"/>
                <circle cx="13" cy="13" r="1.3" fill="#000"/>
                <circle cx="17.5" cy="13" r="1.3" fill="#000"/>
              </svg>
            </button>
          </div>

          {/* Carousel */}
          <div ref={carouselRef} onScroll={handleScroll} style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", gap: 12, padding: "10px 20px 30px 20px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {/* Card 1 */}
            <div style={{ flex: "0 0 88%", scrollSnapAlign: "center" }}>
              <div style={{ backgroundColor: "#05141b", borderRadius: 0, position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 15px 30px rgba(0,0,0,0.25)", padding: "32px 0 80px 0", WebkitMaskImage: "radial-gradient(circle at top center, transparent 24px, black 25px)", maskImage: "radial-gradient(circle at top center, transparent 24px, black 25px)" }}>
                <div style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="https://www.image2url.com/r2/default/images/1779969496056-10bd0b34-e92d-476c-95fb-b8812bff87b5.png" style={{ height: 18, width: "auto", filter: "brightness(0) invert(1)" }} alt="Logo" />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#c9ac49", fontSize: 11, fontWeight: 700 }}>{ticket.event_date}</div>
                    <div style={{ color: "white", fontSize: 22, fontWeight: 700, marginTop: 2 }}>{ticket.event_name}</div>
                  </div>
                </div>
                {ticket.event_image ? (
                  <img src={ticket.event_image} alt={ticket.event_name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: 140, background: "linear-gradient(135deg, #001a35 0%, #003060 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No Image</span>
                  </div>
                )}
                <div style={{ padding: "15px 20px" }}>
                  <div style={{ color: "#c9ac49", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{ticket.venue_name}</div>
                  <div style={{ color: "white", fontSize: 24, fontWeight: 500, margin: "4px 0 12px" }}>{ticket.level_stand || "GROUND LEVEL"}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                    {[
                      { label: "SECTION", val: ticket.section_bay || "GA" },
                      { label: "ROW/SEAT", val: ticket.row ? `${ticket.row}/${ticket.seat_number}` : "-" },
                      { label: "DOOR/GATE", val: ticket.door_area || "-" },
                    ].map((item, i) => (
                      <div key={i} style={{ textAlign: i === 0 ? "left" : i === 1 ? "center" : "right" }}>
                        <div style={{ color: "#c9ac49", fontSize: 10, fontWeight: 700 }}>{item.label}</div>
                        <div style={{ color: "white", fontSize: 22, fontWeight: 500, marginTop: 6 }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "8px 0 15px" }}>
            {[0].map(i => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === activeIndex ? "#8e8e93" : "#d1d1d6" }} />
            ))}
          </div>

          {/* NFC */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 40 }}>
            <div style={{ width: 58, height: 58, border: "2px solid #007aff", borderRadius: "50%", display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 12, overflow: "hidden" }}>
              <div style={{ width: 24, height: 34, border: "2px solid #007aff", borderRadius: 4, borderBottom: 0 }} />
            </div>
            <div style={{ color: "#8e8e93", fontSize: 16 }}>Hold Near Reader</div>
          </div>
        </>
      ) : (
        /* Details Screen */
        <div style={{ display: "flex", flexDirection: "column", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 4px" }}>
            <button onClick={() => setShowDetails(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#007aff", display: "flex", alignItems: "center" }}>
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none"><path d="M13 1L2 11L13 21" stroke="#007aff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#007aff" }}>
              <svg width="19" height="27" viewBox="0 0 19 27" fill="none"><path d="M9.5 17V1M9.5 1L5 5.5M9.5 1L14 5.5" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 9V24C1 25.1046 1.89543 26 3 26H16C17.1046 26 18 25.1046 18 24V9" stroke="#007aff" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 4 }}>{ticket.event_name}</h2>
          <p style={{ fontSize: 15, color: "#8e8e93", textAlign: "center", marginBottom: 24 }}>{ticket.event_date}</p>
          <div style={{ background: "white", borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
            {[
              { label: "Venue", value: ticket.venue_name },
              { label: "Section", value: ticket.section_bay || "-" },
              { label: "Row", value: ticket.row || "-" },
              { label: "Seat", value: ticket.seat_number || "-" },
              { label: "Holder", value: ticket.holder_name || "-" },
            ].map((row, i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: i < arr.length - 1 ? "0.5px solid #c6c6c8" : "none", fontSize: 17 }}>
                <span>{row.label}</span>
                <span style={{ color: "#8e8e93" }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", textAlign: "center", color: "#ff3b30", fontSize: 17, cursor: "pointer", marginBottom: 24 }} onClick={onClose}>
            Remove Pass
          </div>
        </div>
      )}
    </div>
  );
}