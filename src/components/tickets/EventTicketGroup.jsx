import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShareModal from "./ShareModal";

function formatOrderDate(dateStr) {
  if (!dateStr) return "-";
  // If already in "23 Sep 2026" format, return as is
  if (/^\d{1,2} [A-Za-z]+ \d{4}/.test(dateStr)) return dateStr;
  // Try to parse
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

export default function EventTicketGroup({ tickets, uiPreference = "ui1" }) {
  const navigate = useNavigate();
  const [shareModalSeat, setShareModalSeat] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const first = tickets[0];

  if (uiPreference === "ui2") {
    return <EventTicketGroupUI2 tickets={tickets} />;
  }

  return (
    <div className="border border-gray-200 rounded overflow-hidden mb-5 bg-white">
      {/* Shared dark header */}
      <div className="flex text-white text-center" style={{ backgroundColor: "#051c2c" }}>
        <div className="flex-1 py-3 border-r border-white/20">
          <div className="text-[10px] uppercase tracking-wide" style={{ color: "#a0acb5" }}>Order Date</div>
          <div className="text-sm font-bold mt-1">{formatOrderDate(first.purchase_date)}</div>
        </div>
        <div className="flex-1 py-3">
          <div className="text-[10px] uppercase tracking-wide" style={{ color: "#a0acb5" }}>Order Number</div>
          <div className="text-[11px] font-bold mt-1 px-2 break-all">{first.order_number}</div>
        </div>
      </div>

      {/* Shared event info with collapse toggle */}
      <div className="flex p-4 items-center gap-4 relative">
        <img
          src={first.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"}
          alt={first.event_name}
          className="w-[68px] h-[68px] rounded-full object-cover bg-gray-200 flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-semibold text-gray-800">{first.event_name}</h2>
            {/* Collapse toggle button - close to event name, dark navy */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: "#051c2c" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points={collapsed ? "6 9 12 15 18 9" : "18 15 12 9 6 15"} />
              </svg>
            </button>
          </div>
          <div className="text-sm font-bold text-gray-700 mt-1">{first.event_date}</div>
          <div className="text-xs text-gray-500 mt-0.5">{first.venue_name}</div>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Marketplace notice */}
          {first.marketplace_notice && (
            <div className="flex items-stretch mx-4 mb-3 overflow-hidden" style={{ border: "1px solid #e0e0e0", borderRadius: 6 }}>
              <div className="flex items-center justify-center flex-shrink-0 px-3.5" style={{ backgroundColor: "#fcd246" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#111111">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-1.5 1.5v1h15v-1L18 16z"/>
                </svg>
              </div>
              <div className="px-4 py-3 text-[15px] text-gray-700 leading-snug flex-1">
                This ticket was purchased on<br />Ticketek Marketplace.
              </div>
            </div>
          )}

          {/* Per-seat blocks */}
          <div style={{ backgroundColor: "#f1f1f1" }} className="border-t border-gray-200">
            {tickets.map((ticket, idx) => (
              <div key={ticket.id}>
                {idx > 0 && <div className="border-t border-gray-300 mx-4" />}
                <div className="px-5 py-4">
                  <div className="flex text-center border-b border-gray-300 pb-3 mb-3">
                    <div className="flex-1 text-sm font-bold text-gray-600">{ticket.ticket_type || "Reserve"}</div>
                    <div className="w-px bg-gray-300" />
                    <div className="flex-1 text-sm font-bold text-gray-600">Admit</div>
                  </div>
                  <div className="flex text-center">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 uppercase mb-1">Section</div>
                      <div className="font-bold text-gray-700 text-base">{ticket.section_bay || "-"}</div>
                    </div>
                    <div className="w-px bg-gray-300 my-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 uppercase mb-1">Row</div>
                      <div className="font-bold text-gray-700 text-base">{ticket.row || "-"}</div>
                    </div>
                    <div className="w-px bg-gray-300 my-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 uppercase mb-1">Seat</div>
                      <div className="font-bold text-gray-700 text-base">{ticket.seat_number}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shared buttons */}
          <div className="flex gap-3 px-4 py-4 bg-white">
            <button
              onClick={() => navigate(`/ticket-detail/${first.id}`)}
              className="flex-1 py-3 text-white font-bold text-sm border-none cursor-pointer"
              style={{ backgroundColor: "#5a823a" }}
            >
              View
            </button>
            <button
              onClick={() => setShareModalSeat(first.seat_number)}
              className="flex-1 py-3 text-white font-bold text-sm border-none cursor-pointer"
              style={{ backgroundColor: "#2a4e7e" }}
            >
              Share
            </button>
          </div>
          <div className="mx-4 border-t-2 border-dashed border-gray-300 mb-2" />
        </>
      )}

      {shareModalSeat && (
        <ShareModal seatNumber={shareModalSeat} onClose={() => setShareModalSeat(null)} />
      )}
    </div>
  );
}

// UI 2 - Modern card design
function EventTicketGroupUI2({ tickets }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const first = tickets[0];

  return (
    <div style={{ width: "100%", background: "#ffffff", borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden", marginBottom: 20 }}>
      {/* Dark header */}
      <div style={{ backgroundColor: "#06162c", color: "#fff", display: "flex", padding: "16px 24px", textAlign: "center" }}>
        <div style={{ flex: 1, borderRight: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", color: "#a0a0a0", marginBottom: 6 }}>Order Date</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{formatOrderDate(first.purchase_date)}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", color: "#a0a0a0", marginBottom: 6 }}>Order Number</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{first.order_number}</div>
        </div>
      </div>

      {/* Event section */}
      <div style={{ display: "flex", alignItems: "flex-start", padding: "24px 20px", position: "relative" }}>
        <img
          src={first.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"}
          alt={first.event_name}
          style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", marginRight: 16 }}
        />
        <div style={{ flex: 1, paddingRight: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#111", marginBottom: 4, letterSpacing: "-0.3px" }}>{first.event_name}</h2>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 4 }}>{first.event_date}</div>
          <div style={{ fontSize: 13, color: "#444", lineHeight: 1.4 }}>{first.venue_name}</div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ position: "absolute", top: 24, right: 20, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "none", border: "none" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#06162c">
            {collapsed
              ? <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v-6h3l-4-4-4 4h3v6z"/>
              : <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm1 4h-2v6H8l4 4 4-4h-3V8z"/>
            }
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div style={{ padding: "0 20px 24px 20px", borderTop: "1px solid #f0f0f0" }}>
          {tickets.map((ticket, idx) => (
            <div key={ticket.id} style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111", maxWidth: "45%" }}>{ticket.entry_gate || "GATE"}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111", textAlign: "right" }}>{ticket.ticket_type || "RESERVED"}</div>
              </div>
              {/* Dotted divider */}
              <div style={{ height: 3, backgroundImage: "repeating-linear-gradient(90deg, #777, #777 3px, transparent 3px, transparent 8px)", margin: "18px 0" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", marginBottom: 16 }}>
                <div><div style={{ fontSize: 10, textTransform: "uppercase", color: "#666", marginBottom: 6 }}>Section</div><div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{ticket.section_bay || "-"}</div></div>
                <div><div style={{ fontSize: 10, textTransform: "uppercase", color: "#666", marginBottom: 6 }}>Row</div><div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{ticket.row || "-"}</div></div>
                <div><div style={{ fontSize: 10, textTransform: "uppercase", color: "#666", marginBottom: 6 }}>Seat</div><div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{ticket.seat_number}</div></div>
              </div>
              <div style={{ height: 3, backgroundImage: "repeating-linear-gradient(90deg, #777, #777 3px, transparent 3px, transparent 8px)", margin: "18px 0" }} />
              <button
                onClick={() => navigate(`/ticket-detail/${ticket.id}`)}
                style={{ width: "100%", backgroundColor: "#0c1c2c", color: "#fff", border: "none", borderRadius: 8, padding: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 20 }}
              >
                View ticket
              </button>
              <button
                style={{ width: "100%", backgroundColor: "#4c7638", color: "#fff", border: "none", padding: "14px", fontSize: 15, fontWeight: 500, cursor: "pointer", marginTop: 12 }}
              >
                Manage ticket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}