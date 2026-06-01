import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppleWalletModal from "../components/tickets/AppleWalletModal";
import ShareModal from "../components/tickets/ShareModal";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

const TicketShareIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(12, 12) scale(0.85) translate(-12, -12) rotate(-45 12 12)">
      <path d="M 5 7 H 19 V 10 C 16.5 10 16.5 14 19 14 V 17 H 5 V 14 C 7.5 14 7.5 10 5 10 Z" fill="white"/>
    </g>
    <g transform="translate(3.5, 3.5)">
      <circle cx="5" cy="5" r="5.5" fill="rgba(67,130,42,1)" />
      <circle cx="5" cy="5" r="4.5" fill="white"/>
      <polygon points="4.2,3.2 7.0,3.2 7.0,6.0" fill="rgba(67,130,42,1)"/>
      <path d="M 3.6 6.4 L 5.2 4.8" stroke="rgba(67,130,42,1)" strokeWidth="1" strokeLinecap="round"/>
    </g>
  </svg>
);

function TicketGroup({ group, onWallet, hideSettings }) {
  const [expanded, setExpanded] = useState(true);
  const [shareTicket, setShareTicket] = useState(null);
  const navigate = useNavigate();
  const first = group[0];

  const addOns = first.add_ons && first.add_ons.length > 0 ? first.add_ons : null;

  return (
    <>
      {shareTicket && <ShareModal ticket={shareTicket} onClose={() => setShareTicket(null)} />}
      <div style={{ marginTop: 15, borderRadius: 8, overflow: "hidden", border: "1.5px solid #e0e0e0" }}>
        {/* Navy order bar */}
        <div style={{ background: "#001a2c", color: "white", display: "flex", padding: "16px 0", alignItems: "center" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 5, textTransform: "uppercase" }}>Order Date</div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{first.purchase_date || "-"}</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.2)", height: 28 }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 5, textTransform: "uppercase" }}>Order Number</div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{first.order_number || "-"}</div>
          </div>
          <button onClick={() => setExpanded(e => !e)} style={{ background: "none", border: "none", cursor: "pointer", paddingRight: 16, paddingLeft: 8, color: "white" }}>
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Event info */}
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, background: "white", borderBottom: expanded ? "1px solid #f0f0f0" : "none" }}>
          <img src={first.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"} alt={first.event_name}
            style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 16, margin: 0, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{first.event_name}</h2>
            <p style={{ fontSize: 13, margin: "2px 0", fontWeight: 400 }}>{first.event_date}</p>
            <p style={{ fontSize: 13, margin: 0, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{first.venue_name}</p>
            {addOns && addOns.map((ao, i) => (
              <p key={i} style={{ fontSize: 11, margin: "2px 0 0", color: "#555", fontWeight: 400 }}>Ticket includes {ao}</p>
            ))}
          </div>
        </div>

        {/* Expandable */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div key="details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
              {first.marketplace_notice && (
                <div style={{ margin: "0 20px 10px", padding: "10px 12px", background: "#fef3c7", borderRadius: 8, fontSize: 13 }}>
                  ⚠️ This ticket was purchased on Ticketek Marketplace.
                </div>
              )}
              <div style={{ padding: "0 20px 16px", background: "white" }}>
                {group.map((ticket, idx) => (
                  <div key={ticket.id} style={{ marginTop: idx === 0 ? 0 : 12, border: "1.5px solid #f2f2f2", borderRadius: 18, padding: 20, background: "#fafafa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                      <div>
                        <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase" }}>Section</div>
                        <div style={{ fontWeight: 500, marginTop: 6, fontSize: 15 }}>{ticket.section_bay || "-"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase" }}>Row</div>
                        <div style={{ fontWeight: 500, marginTop: 6, fontSize: 15 }}>{ticket.row || "-"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase" }}>Seat</div>
                        <div style={{ fontWeight: 500, marginTop: 6, fontSize: 15 }}>{ticket.seat_number || "-"}</div>
                      </div>
                    </div>
                    <div style={{ borderTop: "1.5px dotted #ddd", margin: "15px 0" }} />
                    <p style={{ fontSize: 13, fontWeight: 400, color: "#222", margin: "0 0 15px" }}>
                      {ticket.ticket_type || "General Admission"} · Admit 1
                    </p>
                    <div style={{ borderTop: "1.5px dotted #ddd", margin: "15px 0" }} />

                    {/* Wallet button */}
                    {!hideSettings?.hide_wallet_button && (
                      isAndroid() ? (
                        <button onClick={() => onWallet(ticket)} style={{ width: "100%", padding: "12px 24px", borderRadius: 8, border: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, background: "#000", color: "white", cursor: "pointer", marginBottom: 10 }}>
                          <img src="https://www.image2url.com/r2/default/images/1779671280742-1ae995e2-3a65-482a-9305-9de9fedcb5da.jpeg" alt="Google Wallet" style={{ width: 32, height: 32, objectFit: "contain" }} />
                          Add to Google Wallet
                        </button>
                      ) : (
                        <button onClick={() => onWallet(ticket)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "none", fontWeight: 500, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#000", color: "white", cursor: "pointer", marginBottom: 10 }}>
                          <img src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/f6963ff4b_IMG_7127.jpeg" alt="Wallet Icon" style={{ width: 30, height: "auto", objectFit: "contain" }} />
                          Add to Apple Wallet
                        </button>
                      )
                    )}

                    {/* Share button */}
                    {!hideSettings?.hide_share_button && (
                      <button onClick={() => setShareTicket(ticket)} style={{ width: "100%", padding: "12px", borderRadius: 4, border: "none", fontWeight: 500, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#43822a", color: "white", cursor: "pointer", marginBottom: 10 }}>
                        <TicketShareIcon />
                        Share ticket
                      </button>
                    )}

                    <button onClick={() => navigate(`/ticket-detail/${ticket.id}`)} style={{ width: "100%", padding: "14px", borderRadius: 4, border: "none", fontWeight: 500, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", background: "#427926", color: "white", cursor: "pointer" }}>
                      Manage ticket
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletTicket, setWalletTicket] = useState(null);
  const [hideSettings, setHideSettings] = useState(null);

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me();
      setUser(me);
      const allTickets = await base44.entities.Ticket.filter({ owner_email: me.email });
      const hidden = JSON.parse(localStorage.getItem("hidden_tickets") || "[]");
      setTickets(allTickets.filter(t => !hidden.includes(t.id)));
      const hs = await base44.entities.HideSettings.list().catch(() => []);
      if (hs.length > 0) setHideSettings(hs[0]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
    </div>
  );

  const grouped = tickets.reduce((acc, t) => {
    const key = t.order_number || t.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});
  const groups = Object.values(grouped);

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {walletTicket && <AppleWalletModal ticket={walletTicket} onClose={() => setWalletTicket(null)} />}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 text-center" style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)", paddingBottom: 12 }}>
        <h1 style={{ fontSize: 19, margin: 0, fontWeight: 500 }}>Ticket wallet</h1>
        <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0 0" }}>Customer ID: {user?.id ? String(user.id).slice(0, 8) : "..."}</p>
      </header>
      <div style={{ padding: "0 15px", paddingBottom: 140 }}>
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-green-600 flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="#16a34a" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No upcoming events</h2>
            <p className="text-gray-500 text-base mb-8">Browse events to find tickets</p>
          </div>
        ) : (
          groups.map((group) => (
            <TicketGroup key={group[0].order_number || group[0].id} group={group} onWallet={setWalletTicket} hideSettings={hideSettings} />
          ))
        )}
      </div>
    </div>
  );
}