import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppleWalletModal from "../components/tickets/AppleWalletModal";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletTicket, setWalletTicket] = useState(null);
  const navigate = useNavigate();

  const hiddenIds = JSON.parse(localStorage.getItem("hidden_tickets") || "[]");

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me();
      setUser(me);
      const allTickets = await base44.entities.Ticket.filter({ owner_email: me.email });
      const hidden = JSON.parse(localStorage.getItem("hidden_tickets") || "[]");
      setTickets(allTickets.filter(t => !hidden.includes(t.id)));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  // Group tickets by order_number
  const grouped = tickets.reduce((acc, t) => {
    const key = t.order_number || t.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const groups = Object.values(grouped);

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      {walletTicket && <AppleWalletModal ticket={walletTicket} onClose={() => setWalletTicket(null)} />}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white text-center" style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)", paddingBottom: 12 }}>
        <h1 style={{ fontSize: 19, margin: 0, fontWeight: 700 }}>Ticket wallet</h1>
        <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0 0" }}>
          Customer ID: {user?.id ? String(user.id).slice(0, 8) : "..."}
        </p>
      </header>

      <div style={{ padding: "0 15px", paddingBottom: 140 }}>
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-green-600 flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="#16a34a" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">You don't have any upcoming events</h2>
            <p className="text-gray-500 text-base mb-8">Start browsing now to find tickets to hundreds of amazing experiences</p>
            <button className="w-full py-4 rounded-lg text-white font-semibold text-base mb-4 border-none cursor-pointer" style={{ backgroundColor: "#1d4e89" }}>Order History</button>
            <button onClick={() => navigate("/")} className="w-full py-4 rounded-lg font-semibold text-base border-2 bg-white cursor-pointer" style={{ color: "#1d4e89", borderColor: "#1d4e89" }}>Browse events</button>
          </div>
        ) : (
          groups.map((group) => {
            const first = group[0];
            return (
              <div key={first.order_number || first.id} style={{ marginTop: 15 }}>
                {/* Navy order bar */}
                <div style={{
                  background: "#001a2c",
                  color: "white",
                  display: "flex",
                  padding: "16px 0",
                  borderRadius: "8px 8px 0 0",
                  alignItems: "center",
                }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 5, textTransform: "uppercase" }}>Order Date</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{first.purchase_date || "-"}</div>
                  </div>
                  <div style={{ width: 1, background: "rgba(255,255,255,0.2)", height: 28 }} />
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 5, textTransform: "uppercase" }}>Order Number</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{first.order_number || "-"}</div>
                  </div>
                </div>

                {/* Side lines container */}
                <div style={{
                  borderLeft: "1.5px solid #e0e0e0",
                  borderRight: "1.5px solid #e0e0e0",
                  paddingBottom: 16,
                }}>
                  {/* Artist / event info */}
                  <div style={{ padding: "20px 25px 10px 25px", display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                      src={first.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"}
                      alt={first.event_name}
                      style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>{first.event_name}</h2>
                      <p style={{ fontSize: 13, margin: "2px 0", fontWeight: 600 }}>{first.event_date}</p>
                      <p style={{ fontSize: 13, margin: 0, color: "#444" }}>{first.venue_name}</p>
                    </div>
                    <div style={{
                      width: 22, height: 22, border: "2px solid #001a2c", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: "#001a2c", flexShrink: 0,
                    }}>›</div>
                  </div>

                  {/* Marketplace notice */}
                  {first.marketplace_notice && (
                    <div style={{ margin: "0 25px 10px", padding: "10px 12px", background: "#fef3c7", borderRadius: 8, fontSize: 13 }}>
                      ⚠️ This ticket was purchased on Ticketek Marketplace.
                    </div>
                  )}

                  {/* Individual seat cards */}
                  {group.map((ticket, idx) => (
                    <div key={ticket.id} style={{ margin: idx === 0 ? "0 25px" : "12px 25px 0", border: "1.5px solid #f2f2f2", borderRadius: 18, padding: 20, background: "white" }}>
                      {/* Seat grid */}
                      <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#666", fontWeight: 600, textTransform: "uppercase" }}>Door/Aisle</div>
                          <div style={{ fontWeight: 700, marginTop: 6, fontSize: 15 }}>{ticket.door_area || "-"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "#666", fontWeight: 600, textTransform: "uppercase" }}>Section</div>
                          <div style={{ fontWeight: 700, marginTop: 6, fontSize: 15 }}>{ticket.section_bay || "-"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "#666", fontWeight: 600, textTransform: "uppercase" }}>Row/Seat</div>
                          <div style={{ fontWeight: 700, marginTop: 6, fontSize: 15 }}>{ticket.row ? `${ticket.row}/${ticket.seat_number}` : ticket.seat_number || "-"}</div>
                        </div>
                      </div>

                      <div style={{ borderTop: "1.5px dotted #ddd", margin: "15px 0" }} />

                      <p style={{ fontSize: 13, fontWeight: 500, color: "#222", margin: "0 0 15px" }}>
                        {ticket.ticket_type || "General Admission"}<br />Admit
                      </p>

                      <div style={{ borderTop: "1.5px dotted #ddd", margin: "15px 0" }} />

                      {/* Buttons */}
                      <button
                        onClick={() => setWalletTicket(ticket)}
                        style={{ width: "100%", padding: "14px", borderRadius: 4, border: "none", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#000", color: "white", cursor: "pointer", marginBottom: 10 }}
                      >
                        <img src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/f6963ff4b_IMG_7127.jpeg" alt="Wallet" style={{ width: 30, height: "auto", objectFit: "contain" }} />
                        Add to Apple Wallet
                      </button>
                      <button
                        onClick={() => navigate(`/ticket-detail/${ticket.id}`)}
                        style={{ width: "100%", padding: "14px", borderRadius: 4, border: "none", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", background: "#427926", color: "white", cursor: "pointer" }}
                      >
                        Manage ticket
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}