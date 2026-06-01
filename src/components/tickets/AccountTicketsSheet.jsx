import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function AccountTicketsSheet({ onClose, user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) return;
    base44.entities.Ticket.filter({ owner_email: user.email }).then(t => {
      setTickets(t);
      setLoading(false);
    });
  }, [user?.email]);

  const grouped = tickets.reduce((acc, t) => {
    const key = t.order_number || t.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});
  const groups = Object.values(grouped);
  const displayName = user?.display_name || user?.full_name || "";
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");
  const customerId = user?.id ? String(user.id).slice(0, 7) : "...";

  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "sticky", top: 0, padding: 16, borderBottom: "1px solid #edf2f7", background: "#fff", zIndex: 100, boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", position: "absolute", left: 16, cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M10 2L2 10L10 18" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 500, color: "#333", margin: 0 }}>Order History</h1>
      </header>

      {/* Profile */}
      <div style={{ padding: "20px 20px 0" }}>
        <h2 style={{ fontSize: 19, fontWeight: 500, color: "#000", marginBottom: 4 }}>{firstName} {lastName}</h2>
        <p style={{ fontSize: 14, color: "#4a5568", margin: 0 }}>Customer ID: <span style={{ fontWeight: 500, color: "#000" }}>{customerId}</span></p>
      </div>

      {/* Toggle row */}
      <div onClick={() => setExpanded(e => !e)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="18" height="14" viewBox="0 0 20 16" fill="none">
            <path d="M1 4C1 2.89543 1.89543 2 3 2H17C18.1046 2 19 2.89543 19 4V6.5C18.1716 6.5 17.5 7.17157 17.5 8C17.5 8.82843 18.1716 9.5 19 9.5V12C19 13.1046 18.1046 14 17 14H3C1.89543 14 1 13.1046 1.00001 12V9.5C1.82843 9.5 2.5 8.82843 2.5 8C2.5 7.17157 1.82843 6.5 1 6.5V4Z" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
            <line x1="7" y1="5" x2="7" y2="11" stroke="#000" strokeWidth="1.2" strokeDasharray="2 2"/>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 500, color: "#000" }}>Order history</span>
        </div>
        <svg style={{ transition: "transform 0.2s", transform: expanded ? "rotate(0deg)" : "rotate(-180deg)" }} width="12" height="8" viewBox="0 0 14 8" fill="none">
          <path d="M1 1L7 7L13 1" stroke="#102A43" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {expanded && (
        <div style={{ padding: "0 20px 120px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#999" }}>Loading tickets...</div>
          ) : groups.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#999" }}>No tickets found.</div>
          ) : (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 500, color: "#000411", marginBottom: 16 }}>Orders</h3>
              {groups.map((group) => {
                const first = group[0];
                return (
                  <div key={first.order_number || first.id} style={{ marginBottom: 32 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 500, color: "#002b49", lineHeight: 1.3, margin: "0 0 4px" }}>{first.event_name}</h4>
                        <div style={{ fontSize: 13, color: "#718096", lineHeight: 1.4 }}>{first.event_date}<br/>{first.venue_name}</div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#f7f9fa", borderRadius: 6, padding: "12px 0", textAlign: "center", marginBottom: 16 }}>
                      <div style={{ borderRight: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: 11, color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Order Placed</div>
                        <div style={{ fontSize: 16, color: "#1a202c" }}>{first.purchase_date || "-"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Order Number</div>
                        <div style={{ fontSize: 16, color: "#1a202c" }}>{first.order_number || "-"}</div>
                      </div>
                    </div>

                    <div style={{ background: "#001524", color: "#fff", borderRadius: 6, padding: 16, marginBottom: 16 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                        <thead>
                          <tr>
                            <th style={{ fontSize: 11, fontWeight: 500, color: "#a0aec0", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Section</th>
                            <th style={{ fontSize: 11, fontWeight: 500, color: "#a0aec0", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Row</th>
                            <th style={{ fontSize: 11, fontWeight: 500, color: "#a0aec0", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Seat</th>
                            <th style={{ fontSize: 11, fontWeight: 500, color: "#a0aec0", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Price Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.map(t => (
                            <tr key={t.id}>
                              <td style={{ fontSize: 15, fontWeight: 500, paddingTop: 12, textAlign: "left" }}>{t.section_bay || "-"}</td>
                              <td style={{ fontSize: 15, fontWeight: 500, paddingTop: 12, textAlign: "center" }}>{t.row || "-"}</td>
                              <td style={{ fontSize: 15, fontWeight: 500, paddingTop: 12, textAlign: "center" }}>{t.seat_number || "-"}</td>
                              <td style={{ fontSize: 15, fontWeight: 500, paddingTop: 12, textAlign: "right" }}>{t.ticket_type || "General"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: "#a0aec0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Delivery Method</div>
                        <div style={{ fontSize: 15, fontWeight: 500 }}>Mobile Ticket (via SMS)</div>
                      </div>
                    </div>

                    <button onClick={() => { onClose(); setTimeout(() => navigate(`/ticket-detail/${first.id}`), 100); }}
                      style={{ display: "block", width: "100%", background: "#fff", border: "1px solid #cbd5e0", color: "#004b87", fontSize: 15, fontWeight: 500, padding: 12, borderRadius: 6, cursor: "pointer", textAlign: "center", marginBottom: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                      View Ticket Details
                    </button>
                    <h5 style={{ fontSize: 15, fontWeight: 500, color: "#1a202c", textAlign: "center", margin: "20px 0 12px" }}>Download Your Tickets</h5>
                    <button onClick={() => { onClose(); setTimeout(() => navigate(`/ticket-detail/${first.id}`), 100); }}
                      style={{ display: "block", width: "100%", background: "#38761d", color: "#fff", border: "none", fontSize: 15, fontWeight: 500, padding: 12, borderRadius: 6, cursor: "pointer", textAlign: "center", marginBottom: 12 }}>
                      Mobile Ticket
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}