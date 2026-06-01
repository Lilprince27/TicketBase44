import { useState, useRef } from "react";

export default function AppleWalletModal({ ticket, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.offsetWidth;
    const idx = Math.round(carouselRef.current.scrollLeft / (width * 0.85));
    setActiveIndex(Math.max(0, Math.min(idx, 1)));
  };

  const PassCard = ({ theme = "default" }) => (
    <div style={{
      backgroundColor: theme === "alt" ? "#1a0b2e" : "#05141b",
      borderRadius: 0,
      position: "relative",
      boxShadow: "0 15px 30px rgba(0,0,0,0.25)",
      padding: "32px 0px 120px 0px",
      display: "flex",
      flexDirection: "column",
      WebkitMaskImage: "radial-gradient(circle at top center, transparent 24px, black 25px)",
      maskImage: "radial-gradient(circle at top center, transparent 24px, black 25px)",
    }}>
      <div style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <img
          src="https://www.image2url.com/r2/default/images/1779969496056-10bd0b34-e92d-476c-95fb-b8812bff87b5.png"
          style={{ height: 18, width: "auto" }}
          alt="Ticketek"
        />
        <div style={{ textAlign: "right" }}>
          <div style={{ color: theme === "alt" ? "#b38eff" : "#c9ac49", fontSize: 11, fontWeight: 700 }}>{ticket.event_date}</div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginTop: 2 }}>{ticket.event_name}</div>
        </div>
      </div>

      {ticket.event_image ? (
        <img src={ticket.event_image} alt={ticket.event_name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
      ) : (
        <div style={{ width: "100%", height: 140, background: "linear-gradient(135deg, #001a35, #003060)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No Image</span>
        </div>
      )}

      <div style={{ padding: "15px 20px" }}>
        <div style={{ color: theme === "alt" ? "#b38eff" : "#c9ac49", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{ticket.venue_name}</div>
        <div style={{ color: "#fff", fontSize: 24, fontWeight: 500, margin: "4px 0 12px" }}>{ticket.level_stand || "GROUND LEVEL"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#c9ac49", fontSize: 10, fontWeight: 700 }}>SECTION</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 500, marginTop: 6 }}>{ticket.section_bay || "GA"}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#c9ac49", fontSize: 10, fontWeight: 700 }}>ROW/SEAT</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 500, marginTop: 6 }}>{ticket.row ? `${ticket.row}/${ticket.seat_number}` : ticket.seat_number}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#c9ac49", fontSize: 10, fontWeight: 700 }}>DOOR/GATE</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 500, marginTop: 6 }}>{ticket.door_area || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ backgroundColor: "#f2f2f7", paddingTop: "env(safe-area-inset-top)", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif" }}>

      {!showDetails ? (
        <>
          {/* Nav bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", position: "relative" }}>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 600, color: "#000" }}>Done</button>
            <div style={{ position: "relative" }}>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              >
                <svg width="26" height="26" viewBox="0 0 26 26">
                  <circle cx="13" cy="13" r="12" fill="none" stroke="#000" strokeWidth="1.8"/>
                  <circle cx="8.5" cy="13" r="1.3" fill="#000"/>
                  <circle cx="13" cy="13" r="1.3" fill="#000"/>
                  <circle cx="17.5" cy="13" r="1.3" fill="#000"/>
                </svg>
              </button>
              {menuOpen && (
                <div style={{ position: "absolute", top: 38, right: 0, width: 242, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: 13, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", border: "0.5px solid rgba(0,0,0,0.08)", overflow: "hidden", zIndex: 200 }}
                  onClick={e => e.stopPropagation()}
                >
                  <button onClick={() => { setShowDetails(true); setMenuOpen(false); }} style={{ width: "100%", background: "none", border: "none", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, cursor: "pointer", borderBottom: "0.5px solid rgba(0,0,0,0.12)" }}>
                    <span>Pass Details</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2.2"/></svg>
                  </button>
                  <button onClick={() => setMenuOpen(false)} style={{ width: "100%", background: "none", border: "none", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, color: "#ff3b30", cursor: "pointer" }}>
                    <span>Remove Pass</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            onClick={() => setMenuOpen(false)}
            style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", gap: 12, padding: "10px 20px 30px", scrollbarWidth: "none" }}
          >
            <div style={{ flex: "0 0 88%", scrollSnapAlign: "center" }}>
              <PassCard theme="default" />
            </div>
            <div style={{ flex: "0 0 88%", scrollSnapAlign: "center" }}>
              <PassCard theme="alt" />
            </div>
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
        <>
          {/* Details screen */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", backgroundColor: "#f2f2f7" }}>
            <button onClick={() => setShowDetails(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#007aff", fontSize: 17, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
                <path d="M13 1L2 11L13 21" stroke="#007aff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div style={{ fontSize: 17, fontWeight: 600 }}>Pass Details</div>
            <div style={{ width: 40 }} />
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: "0 24px 40px" }}>
            <div style={{ fontWeight: 700, fontSize: 22, textAlign: "center", marginBottom: 4, marginTop: 10 }}>{ticket.event_name}</div>
            <div style={{ fontSize: 13, color: "#8e8e93", textAlign: "center", marginBottom: 20 }}>{ticket.event_date}</div>

            <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", marginBottom: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              {[
                { label: "Venue", value: ticket.venue_name },
                { label: "Section", value: ticket.section_bay },
                { label: "Row / Seat", value: ticket.row ? `${ticket.row} / ${ticket.seat_number}` : ticket.seat_number },
                { label: "Door / Gate", value: ticket.door_area },
                { label: "Level / Stand", value: ticket.level_stand },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", fontSize: 16, borderBottom: "0.5px solid #e5e5ea" }}>
                  <span>{row.label}</span>
                  <span style={{ color: "#8e8e93" }}>{row.value || "-"}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 12, textAlign: "center", padding: 14, color: "#ff3b30", fontSize: 17, cursor: "pointer", marginTop: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
              onClick={() => { setShowDetails(false); onClose(); }}
            >
              Remove Pass
            </div>
          </div>
        </>
      )}
    </div>
  );
}