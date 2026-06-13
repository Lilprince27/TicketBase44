import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppleWalletModal from "../components/tickets/AppleWalletModal";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { getCustomerId } from "../lib/customerId";

const isAndroid = () => /android/i.test(navigator.userAgent);

function TicketGroup({ group, onWallet }) {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const first = group[0];

  return (
    <div style={{ marginTop: 15, borderRadius: 8, overflow: "hidden", border: "1.5px solid #e0e0e0" }}>
      {/* Navy order bar */}
      <div style={{ background: "#001a2c", color: "white", display: "flex", padding: "16px 0", alignItems: "center" }}>
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

      {/* Always-visible event info row */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, background: "white", borderBottom: expanded ? "1px solid #f0f0f0" : "none" }}>
        <img
          src={first.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"}
          alt={first.event_name}
          style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 16, margin: 0, fontWeight: 700 }}>{first.event_name}</h2>
            {/* Collapse toggle next to event name */}
            <button
              onClick={() => setExpanded(e => !e)}
              style={{ background: "#f0f0f0", border: "none", cursor: "pointer", padding: "4px 8px", color: "#333", borderRadius: 6, display: "flex", alignItems: "center", flexShrink: 0 }}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          <p style={{ fontSize: 13, margin: "2px 0", fontWeight: 600 }}>{first.purchase_date || first.event_date || "-"}</p>
          <p style={{ fontSize: 13, margin: 0, color: "#666" }}>{first.venue_name}</p>
          {first.add_ons && first.add_ons.length > 0 && first.add_ons.map((addon, i) => (
            <p key={i} style={{ fontSize: 11, margin: "2px 0 0", color: "#888" }}>Ticket includes {addon}</p>
          ))}
        </div>
      </div>

      {/* Expandable details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {/* Marketplace notice - styled banner */}
            {first.marketplace_notice && (
              <div style={{ margin: "12px 20px 0", display: "flex", alignItems: "stretch", border: "1px solid #e0e0e0", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ backgroundColor: "#fcd246", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 14px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#111">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-1.5 1.5v1h15v-1L18 16z"/>
                  </svg>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  <p style={{ color: "#222", fontSize: 14, margin: 0, lineHeight: 1.35 }}>This ticket was purchased on<br/>Ticketek Marketplace.</p>
                </div>
              </div>
            )}

            {/* Individual seat cards */}
            <div style={{ padding: "0 20px 16px", background: "white" }}>
              {group.map((ticket, idx) => (
                <div key={ticket.id} style={{ marginTop: idx === 0 ? 0 : 12, border: "1.5px solid #f2f2f2", borderRadius: 18, padding: 20, background: "#fafafa" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#666", fontWeight: 600, textTransform: "uppercase" }}>Section</div>
                      <div style={{ fontWeight: 700, marginTop: 6, fontSize: 15 }}>{ticket.section_bay || "-"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#666", fontWeight: 600, textTransform: "uppercase" }}>Row</div>
                      <div style={{ fontWeight: 700, marginTop: 6, fontSize: 15 }}>{ticket.row || "-"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#666", fontWeight: 600, textTransform: "uppercase" }}>Seat</div>
                      <div style={{ fontWeight: 700, marginTop: 6, fontSize: 15 }}>{ticket.seat_number || "-"}</div>
                    </div>
                  </div>
                  <div style={{ borderTop: "1.5px dotted #ddd", margin: "15px 0" }} />
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#222", margin: "0 0 15px" }}>
                    {ticket.ticket_type || "General Admission"} · Admit 1
                  </p>
                  <div style={{ borderTop: "1.5px dotted #ddd", margin: "15px 0" }} />
                  {isAndroid() ? (
                    <button onClick={() => onWallet(ticket)}
                      style={{ width: "100%", padding: "12px 24px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#000", color: "white", cursor: "pointer", marginBottom: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
                    >
                      <img src="https://www.image2url.com/r2/default/images/1779671280742-1ae995e2-3a65-482a-9305-9de9fedcb5da.jpeg" alt="Google Wallet" style={{ width: 32, height: 32, marginRight: 14, objectFit: "contain" }} />
                      Add to Google Wallet
                    </button>
                  ) : (
                    <button onClick={() => onWallet(ticket)}
                      style={{ width: "100%", padding: "14px", borderRadius: 4, border: "none", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#000", color: "white", cursor: "pointer", marginBottom: 10 }}
                    >
                      <img src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/f6963ff4b_IMG_7127.jpeg" alt="Wallet" style={{ width: 30, height: "auto", objectFit: "contain" }} />
                      Add to Apple Wallet
                    </button>
                  )}
                  <div style={{ display: "flex", gap: 0 }}>
                    <button
                      onClick={() => navigate(`/ticket-detail/${ticket.id}`)}
                      style={{ flex: 1, padding: "14px", border: "none", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", background: "#427926", color: "white", cursor: "pointer" }}
                    >
                      Manage ticket
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const shareText = `🎫 ${ticket.event_name}\n📅 ${ticket.event_date}\n📍 ${ticket.venue_name}\n💺 Section ${ticket.section_bay || "-"}, Row ${ticket.row || "-"}, Seat ${ticket.seat_number}\n\nView ticket: ${window.location.origin}/ticket-detail/${ticket.id}`;
                        if (navigator.share) {
                          navigator.share({ title: ticket.event_name, text: shareText });
                        } else {
                          await navigator.clipboard.writeText(shareText);
                          alert("Ticket details copied to clipboard!");
                        }
                      }}
                      style={{ width: 56, padding: "14px", border: "none", borderLeft: "1px solid rgba(255,255,255,0.2)", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "#427926", color: "white", cursor: "pointer" }}
                      title="Share ticket"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                        <polyline points="16 6 12 2 8 6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletTicket, setWalletTicket] = useState(null);

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

  const grouped = tickets.reduce((acc, t) => {
    const key = t.order_number || t.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});
  const groups = Object.values(grouped);

  return (
    <div style={{ background: "white", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {walletTicket && <AppleWalletModal ticket={walletTicket} onClose={() => setWalletTicket(null)} />}

      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: "#001a2c", paddingTop: "calc(env(safe-area-inset-top) + 20px)", paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontWeight: 700, color: "white" }}>Ticket Wallet</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "4px 0 0 0" }}>
          Customer ID: {getCustomerId(user?.id || "")}
        </p>
      </header>

      <div style={{ padding: "0 15px", paddingBottom: "calc(120px + env(safe-area-inset-bottom))", paddingTop: 8 }}>
        {groups.length === 0 ? (
          <div style={{ padding: "40px 24px 32px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 16 }}>Events</h2>
            <p style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>You don't have any upcoming events.</p>
            <p style={{ fontSize: 16, color: "#333", marginBottom: 40 }}>Browse events to find tickets to hundreds of amazing experiences.</p>
            <button
              onClick={() => window.location.href = "/"}
              style={{ width: "100%", padding: "18px", borderRadius: 100, border: "none", background: "#001a2c", color: "white", fontWeight: 700, fontSize: 16, cursor: "pointer", marginBottom: 14 }}
            >
              Order History
            </button>
            <button
              onClick={() => window.location.href = "/"}
              style={{ width: "100%", padding: "18px", borderRadius: 100, border: "1.5px solid #111", background: "#f5f5f5", color: "#111", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
            >
              Browse events
            </button>
          </div>
        ) : (
          groups.map((group) => (
            <TicketGroup key={group[0].order_number || group[0].id} group={group} onWallet={setWalletTicket} />
          ))
        )}
      </div>
    </div>
  );
}