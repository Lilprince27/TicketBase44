import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { getCustomerId } from "../../lib/customerId";

function VenueMapModal({ ticket, onClose }) {
  const section = ticket.section_bay || "-";
  const row = ticket.row || "-";
  const seat = ticket.seat_number || "-";

  // Calculate approximate marker position based on section
  const sectionNum = parseInt(section) || 0;
  const angle = ((sectionNum % 36) / 36) * 360;
  const rad = (angle * Math.PI) / 180;
  const markerX = 50 + 30 * Math.sin(rad);
  const markerY = 50 - 30 * Math.cos(rad);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-lg overflow-hidden shadow-2xl" style={{ maxHeight: "80vh" }} onClick={e => e.stopPropagation()}>
        <div style={{ backgroundColor: "#1a1a1a", color: "white", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>Venue Seating Map – {ticket.venue_name}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", backgroundColor: "#f0f2f5", minHeight: 320 }}>
          {/* Map canvas */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 20, position: "relative" }}>
            <div style={{ width: 280, height: 280, position: "relative" }}>
              {/* Oval stadium shape */}
              <svg viewBox="0 0 200 200" width="280" height="280">
                <ellipse cx="100" cy="100" rx="90" ry="75" fill="#e8e8e8" stroke="#aaa" strokeWidth="8"/>
                <ellipse cx="100" cy="100" rx="55" ry="42" fill="#7ec850" stroke="#5a9e35" strokeWidth="2"/>
                <rect x="82" y="88" width="36" height="24" fill="#6bba3e" stroke="#5a9e35" strokeWidth="1"/>
                {/* Stage */}
                <rect x="75" y="22" width="50" height="18" rx="3" fill="#333" />
                <text x="100" y="34" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">STAGE</text>
                {/* Section labels */}
                {[0,1,2,3,4,5,6,7].map(i => {
                  const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                  const x = 100 + 78 * Math.cos(a);
                  const y = 100 + 65 * Math.sin(a);
                  return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#555" fontSize="7">{100 + i * 10}</text>;
                })}
                {/* Highlighted section marker */}
                <circle cx={markerX * 2} cy={markerY * 2} r="12" fill="rgba(0,86,179,0.25)" stroke="#0056b3" strokeWidth="2" strokeDasharray="4 2">
                  <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite"/>
                </circle>
                <text x={markerX * 2} y={markerY * 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#0056b3" fontSize="6" fontWeight="bold">{section}</text>
              </svg>
            </div>
          </div>
          {/* Sidebar */}
          <div style={{ backgroundColor: "white", borderLeft: "1px solid #ddd", padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", color: "#777", marginBottom: 10, fontWeight: "bold" }}>Your Allocation</div>
              <div style={{ backgroundColor: "#e6f0fa", borderLeft: "4px solid #0056b3", padding: 12, marginBottom: 16, borderRadius: "0 4px 4px 0" }}>
                <p style={{ margin: "4px 0", fontSize: 14 }}><strong>Section:</strong> {section}</p>
                <p style={{ margin: "4px 0", fontSize: 14 }}><strong>Row:</strong> {row}</p>
                <p style={{ margin: "4px 0", fontSize: 14 }}><strong>Seat:</strong> {seat}</p>
              </div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.4 }}>
                Your section is highlighted with a flashing dashed outline on the map to help identify your gate entry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderHistorySheet({ user, onClose }) {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [venueMapTicket, setVenueMapTicket] = useState(null);

  useEffect(() => {
    if (!user) return;
    base44.entities.Ticket.filter({ owner_email: user.email })
      .then(t => { setTickets(t); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const grouped = tickets.reduce((acc, t) => {
    const key = t.order_number || t.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});
  const groups = Object.values(grouped);

  const toggleOrder = (key) => setExpandedOrders(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      {venueMapTicket && <VenueMapModal ticket={venueMapTicket} onClose={() => setVenueMapTicket(null)} />}
      <div className="fixed inset-0 z-[999]" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div className="fixed inset-0 z-[1000] bg-white overflow-hidden" style={{ display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top)" }}>
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-center relative px-4 py-4 border-b border-gray-100 shadow-sm">
          <button onClick={onClose} className="absolute left-4 bg-none border-none cursor-pointer p-1">
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path d="M10 2L2 10L10 18" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 style={{ fontSize: 17, fontWeight: 500, color: "#333", margin: 0 }}>Order History</h1>
        </div>

        <div className="overflow-y-auto pb-8">
          {/* Profile */}
          <div className="px-5 py-5">
            <h2 style={{ fontSize: 19, fontWeight: 500, color: "#000", marginBottom: 4 }}>
              {user?.display_name || user?.full_name || ""}
            </h2>
            <p style={{ fontSize: 14, color: "#4a5568" }}>
              Customer ID: <span style={{ fontWeight: 500, color: "#000" }}>{getCustomerId(user?.id || "")}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No tickets found</div>
          ) : (
            groups.map(group => {
              const first = group[0];
              const key = first.order_number || first.id;
              const isExpanded = expandedOrders[key] !== false; // default expanded
              return (
                <div key={key}>
                  {/* Toggle row */}
                  <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleOrder(key)}>
                    <div className="flex items-center gap-2.5">
                      <svg width="18" height="14" viewBox="0 0 20 16" fill="none">
                        <path d="M1 4C1 2.9 1.9 2 3 2H17C18.1 2 19 2.9 19 4V6.5C18.2 6.5 17.5 7.2 17.5 8C17.5 8.8 18.2 9.5 19 9.5V12C19 13.1 18.1 14 17 14H3C1.9 14 1 13.1 1 12V9.5C1.8 9.5 2.5 8.8 2.5 8C2.5 7.2 1.8 6.5 1 6.5V4Z" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
                        <line x1="7" y1="5" x2="7" y2="11" stroke="#000" strokeWidth="1.2" strokeDasharray="2 2"/>
                      </svg>
                      <span style={{ fontSize: 15, fontWeight: 500 }}>Order history</span>
                    </div>
                    <svg width="12" height="8" viewBox="0 0 14 8" fill="none" style={{ transition: "transform 0.2s", transform: isExpanded ? "rotate(0deg)" : "rotate(-180deg)" }}>
                      <path d="M1 1L7 7L13 1" stroke="#102A43" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5">
                      <h3 style={{ fontSize: 20, fontWeight: 500, color: "#000411", marginBottom: 16 }}>Orders</h3>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 style={{ fontSize: 16, fontWeight: 500, color: "#002b49", lineHeight: 1.3 }}>{first.event_name}</h4>
                          <div style={{ fontSize: 13, color: "#718096", marginTop: 4 }}>{first.event_date}<br/>{first.venue_name}</div>
                        </div>
                      </div>

                      {/* Order meta */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", backgroundColor: "#f7f9fa", borderRadius: 6, padding: "12px 0", textAlign: "center", marginBottom: 16 }}>
                        <div style={{ borderRight: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: 11, color: "#718096", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Order Placed</div>
                          <div style={{ fontSize: 16, color: "#1a202c" }}>{first.purchase_date || "-"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "#718096", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Order Number</div>
                          <div style={{ fontSize: 16, color: "#1a202c" }}>{first.order_number || "-"}</div>
                        </div>
                      </div>

                      {/* Seating panel */}
                      <div style={{ backgroundColor: "#001524", color: "white", borderRadius: 6, padding: 16, marginBottom: 16 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                          <thead>
                            <tr>
                              <th style={{ fontSize: 11, fontWeight: 500, color: "#a0aec0", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "left", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Section</th>
                              <th style={{ fontSize: 11, fontWeight: 500, color: "#a0aec0", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Row</th>
                              <th style={{ fontSize: 11, fontWeight: 500, color: "#a0aec0", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Seat</th>
                              <th style={{ fontSize: 11, fontWeight: 500, color: "#a0aec0", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "right", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.map((t, i) => (
                              <tr key={i}>
                                <td style={{ fontSize: 15, fontWeight: 500, paddingTop: 12 }}>{t.section_bay || "-"}</td>
                                <td style={{ fontSize: 15, fontWeight: 500, paddingTop: 12, textAlign: "center" }}>{t.row || "-"}</td>
                                <td style={{ fontSize: 15, fontWeight: 500, paddingTop: 12, textAlign: "center" }}>{t.seat_number || "-"}</td>
                                <td style={{ fontSize: 15, fontWeight: 500, paddingTop: 12, textAlign: "right" }}>{t.ticket_type || "Admit 1"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, fontWeight: 500, color: "#a0aec0", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Delivery Method</div>
                          <div style={{ fontSize: 15, fontWeight: 500 }}>Mobile Ticket (via SMS)</div>
                        </div>
                      </div>

                      <button onClick={() => setVenueMapTicket(first)}
                        style={{ display: "block", width: "100%", backgroundColor: "#fff", border: "1px solid #cbd5e0", color: "#004b87", fontSize: 15, fontWeight: 500, padding: 12, borderRadius: 6, cursor: "pointer", textAlign: "center", marginBottom: 10 }}>
                        View Venue Map
                      </button>
                      <button onClick={() => { onClose(); navigate(`/ticket-detail/${first.id}`); }}
                        style={{ display: "block", width: "100%", backgroundColor: "#fff", border: "1px solid #cbd5e0", color: "#004b87", fontSize: 15, fontWeight: 500, padding: 12, borderRadius: 6, cursor: "pointer", textAlign: "center", marginBottom: 16 }}>
                        View Event Details
                      </button>

                      <h5 style={{ fontSize: 15, fontWeight: 500, color: "#1a202c", textAlign: "center", margin: "0 0 12px 0" }}>Download Your Tickets</h5>
                      <button onClick={() => { onClose(); navigate(`/ticket-detail/${first.id}`); }}
                        style={{ display: "block", width: "100%", backgroundColor: "#38761d", color: "#fff", border: "none", fontSize: 15, fontWeight: 500, padding: 12, borderRadius: 6, cursor: "pointer", textAlign: "center", marginBottom: 10 }}>
                        Mobile Ticket
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}