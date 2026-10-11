import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppleWalletModal from "../components/tickets/AppleWalletModal";
import { ChevronUp, ChevronDown } from "lucide-react";
import { getCustomerId } from "../lib/customerId";
import PullToRefresh from "../components/PullToRefresh";
import SharedTicketStatus from "../components/tickets/SharedTicketStatus";
import SharedTicketManageModal from "../components/tickets/SharedTicketManageModal";
import BulkTransferModal from "../components/tickets/BulkTransferModal";

// Generate a stable random order number in format YYYYMMDD,NNNNN based on ticket id
function getOrderNumber(ticket) {
  if (ticket.order_number) {
    // Replace any / with , in existing order numbers
    return ticket.order_number.replace("/", ",");
  }
  // Generate deterministic number from ticket id
  const seed = ticket.id ? ticket.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) : 12345;
  const date = ticket.purchase_date
    ? ticket.purchase_date.replace(/\D/g, "").slice(0, 8)
    : "20260313";
  const num = String(10000 + (seed % 89999)).padStart(5, "0");
  return `${date},${num}`;
}

const isAndroid = () => /android/i.test(navigator.userAgent);

function TicketGroup({ group, onWallet, sharedTicketMap, onManageShare, selectMode, selectedIds, onToggleSelect }) {
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
          <div style={{ fontWeight: 700, fontSize: 14 }}>{getOrderNumber(first)}</div>
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
            <h2 style={{ fontSize: 16, margin: 0, fontWeight: 700, color: "#111" }}>{first.event_name}</h2>
            {/* Collapse toggle next to event name */}
            <button
              onClick={() => setExpanded(e => !e)}
              style={{ background: "#f0f0f0", border: "none", cursor: "pointer", padding: "4px 8px", color: "#333", borderRadius: 6, display: "flex", alignItems: "center", flexShrink: 0 }}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          <p style={{ fontSize: 13, margin: "2px 0", fontWeight: 600, color: "#111" }}>{first.event_date || "-"}</p>
          <p style={{ fontSize: 13, margin: 0, color: "#666" }}>{first.venue_name}</p>
          {first.add_ons && first.add_ons.length > 0 && first.add_ons.map((addon, i) => (
            <p key={i} style={{ fontSize: 11, margin: "2px 0 0", color: "#888" }}>Ticket includes {addon}</p>
          ))}
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div
          style={{ overflow: "hidden", transition: "max-height 0.25s ease-in-out", maxHeight: expanded ? '9999px' : '0' }}
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
                <div
                  key={ticket.id}
                  onClick={() => { if (selectMode && !sharedTicketMap?.[ticket.serial_number]?.accepted_by) onToggleSelect(ticket.id); }}
                  style={{ marginTop: idx === 0 ? 12 : 16, border: selectedIds?.has(ticket.id) ? "2px solid #001a2c" : "1.5px solid #e0e0e0", borderRadius: 12, overflow: "hidden", background: "white", position: "relative", cursor: selectMode && !sharedTicketMap?.[ticket.serial_number]?.accepted_by ? "pointer" : "default" }}
                >
                  {selectMode && (
                    <div style={{ position: "absolute", top: 10, right: 10, zIndex: 5 }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", border: selectedIds?.has(ticket.id) ? "none" : "2px solid #ccc", background: selectedIds?.has(ticket.id) ? "#001a2c" : "white", display: "flex", alignItems: "center", justifyContent: "center", opacity: sharedTicketMap?.[ticket.serial_number]?.accepted_by ? 0.3 : 1 }}>
                        {selectedIds?.has(ticket.id) && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Gate / Level header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", background: "white" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111", textTransform: "uppercase" }}>{ticket.entry_gate ? `Gate ${ticket.entry_gate}` : (ticket.door_area ? `Door ${ticket.door_area}` : "Gate A")}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111", textTransform: "uppercase" }}>{ticket.level_stand ? `Level ${ticket.level_stand}` : "Level 3"}</span>
                  </div>
                  <div style={{ borderTop: "1.5px dotted #ccc", margin: "0 16px" }} />
                  {/* Door / Section / Row Seat */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px 4px" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#666", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Door/Aisle</div>
                      <div style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>{ticket.door_area || "-"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#666", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Section</div>
                      <div style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>{ticket.section_bay || "-"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#666", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Row/Seat</div>
                      <div style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>{ticket.row || "-"}/{ticket.seat_number || "-"}</div>
                    </div>
                  </div>
                  <div style={{ borderTop: "1.5px dotted #ccc", margin: "8px 16px" }} />
                  <div style={{ padding: "4px 16px 14px" }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#222", margin: "0 0 2px" }}>
                      {ticket.ticket_type || "General Admission"}
                    </p>
                    <p style={{ fontSize: 13, color: "#555", margin: 0 }}>Admit</p>
                  </div>
                  <div style={{ borderTop: "1.5px dotted #ccc", margin: "0 16px 14px" }} />
                  <div style={{ padding: "0 16px 16px" }}>
                    {!sharedTicketMap?.[ticket.serial_number]?.accepted_by && (
                    isAndroid() ? (
                      <button onClick={() => onWallet(ticket)}
                        style={{ width: "100%", padding: "14px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "#000", color: "white", cursor: "pointer", marginBottom: 10 }}
                      >
                        <img src="https://www.image2url.com/r2/default/images/1779671280742-1ae995e2-3a65-482a-9305-9de9fedcb5da.jpeg" alt="Google Wallet" style={{ width: 28, height: 28, marginRight: 12, objectFit: "contain" }} />
                        Add to Google Wallet
                      </button>
                    ) : (
                      <button onClick={() => onWallet(ticket)}
                        style={{ width: "100%", padding: "14px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#000", color: "white", cursor: "pointer", marginBottom: 10 }}
                      >
                        <img src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/f6963ff4b_IMG_7127.jpeg" alt="Wallet" style={{ width: 28, height: "auto", objectFit: "contain" }} />
                        Add to Apple Wallet
                      </button>
                    )
                    )}
                    <button
                      onClick={() => {
                        const share = sharedTicketMap?.[ticket.serial_number];
                        if (share) onManageShare(ticket, share);
                        else navigate(`/ticket-detail/${ticket.id}`);
                      }}
                      style={{ width: "100%", padding: "14px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "#427926", color: "white", cursor: "pointer" }}
                    >
                      Manage ticket
                    </button>
                  </div>
                  {sharedTicketMap?.[ticket.serial_number] && (
                    <SharedTicketStatus shareRecord={sharedTicketMap[ticket.serial_number]} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

export default function TicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletTicket, setWalletTicket] = useState(null);
  const [sharedTicketMap, setSharedTicketMap] = useState({});
  const [manageShareTicket, setManageShareTicket] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkTransferTickets, setBulkTransferTickets] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const walletOpen = searchParams.get('modal') === 'wallet';

  const openWallet = useCallback((ticket) => {
    setWalletTicket(ticket);
    setSearchParams({ modal: 'wallet' });
  }, []);

  useEffect(() => {
    if (!walletOpen) setWalletTicket(null);
  }, [walletOpen]);

  const loadTickets = useCallback(async () => {
    const me = await base44.auth.me();
    // Get display name from UserProfile (the name on confirmation email)
    const profiles = await base44.entities.UserProfile.filter({ user_email: me.email }).catch(() => []);
    const profile = profiles[0];
    const displayName = profile?.first_name
      ? `${profile.first_name}${profile.last_name ? " " + profile.last_name : ""}`
      : (me.display_name || me.full_name || "");
    setUser({ ...me, display_name: displayName });
    const allTickets = await base44.entities.Ticket.filter({ owner_email: me.email });
    const hidden = JSON.parse(localStorage.getItem("hidden_tickets") || "[]");
    setTickets(allTickets.filter(t => !hidden.includes(t.id)));
    // Load accepted shared tickets to show status under each ticket
    const sharedTickets = await base44.entities.SharedTicket.filter({ owner_email: me.email });
    const shareMap = {};
    for (const s of sharedTickets) {
      // Skip rejected shares — they are no longer active
      if (s.rejected_by) continue;
      try {
        const snap = JSON.parse(s.ticket_snapshot);
        if (snap.serial_number) shareMap[snap.serial_number] = s;
      } catch {}
    }
    setSharedTicketMap(shareMap);
    setLoading(false);
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  // Live-update share status when a recipient accepts/rejects
  useEffect(() => {
    const unsubscribe = base44.entities.SharedTicket.subscribe((event) => {
      const s = event.data;
      if (!s) return;
      try {
        const snap = JSON.parse(s.ticket_snapshot || "{}");
        if (!snap.serial_number) return;
        setSharedTicketMap((prev) => {
          // Only update if this share belongs to the current user's ticket
          if (!prev[snap.serial_number] && event.type !== "create") return prev;
          const next = { ...prev };
          if (event.type === "delete" || s.rejected_by) {
            delete next[snap.serial_number];
          } else {
            next[snap.serial_number] = s;
          }
          return next;
        });
      } catch {}
    });
    return unsubscribe;
  }, []);

  const handleCancelShare = async (shareRecord, ticket, sendEmail = true) => {
    await base44.entities.SharedTicket.delete(shareRecord.id);
    await base44.entities.Ticket.update(ticket.id, { transfer_status: "active", active_transfer_id: null });
    if (sendEmail) {
      try {
        const html = `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;"><div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;"><h2 style="color: #FFC107; margin: 0 0 8px;">Ticket Share Cancelled</h2></div><div style="background: #fff; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none;"><p style="color: #333; font-size: 15px; margin: 0 0 16px;">The sender has cancelled the shared ticket for <strong>${ticket.event_name}</strong>.</p><p style="color: #666; font-size: 13px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p></div></div>`;
        await base44.integrations.Core.SendEmail({
          to: shareRecord.accepted_by || shareRecord.recipient_email,
          subject: `Ticket share cancelled: ${ticket.event_name}`,
          body: html,
        });
      } catch {}
    }
    setManageShareTicket(null);
    loadTickets();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const selectedTickets = tickets.filter((t) => selectedIds.has(t.id));

  const handleBulkTransfer = () => {
    if (selectedTickets.length === 0) return;
    setBulkTransferTickets(selectedTickets);
  };

  const grouped = tickets.reduce((acc, t) => {
    const key = t.order_number || t.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});
  const groups = Object.values(grouped);

  return (
    <PullToRefresh onRefresh={loadTickets}>
    <div style={{ background: "white", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", minHeight: "100vh" }}>
      {walletOpen && walletTicket && <AppleWalletModal ticket={walletTicket} onClose={() => navigate(-1)} />}

      {manageShareTicket && (
        <SharedTicketManageModal
          ticket={manageShareTicket.ticket}
          shareRecord={manageShareTicket.share}
          onClose={() => setManageShareTicket(null)}
          onCancelShare={handleCancelShare}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: "#001a2c", paddingTop: "calc(env(safe-area-inset-top) + 20px)", paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 26, margin: 0, fontWeight: 700, color: "white" }}>Ticket Wallet</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "4px 0 0 0" }}>
              Customer ID: {getCustomerId(user?.id || "")}
            </p>
          </div>
          {groups.length > 0 && (
            <button
              onClick={() => selectMode ? exitSelectMode() : setSelectMode(true)}
              style={{ background: selectMode ? "rgba(255,255,255,0.15)" : "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 18px", borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              {selectMode ? "Done" : "Select"}
            </button>
          )}
        </div>
      </header>

      <div style={{ padding: "0 20px", paddingBottom: "calc(140px + env(safe-area-inset-bottom))", paddingTop: 0 }}>
        {groups.length === 0 ? (
          <div style={{ padding: "40px 24px 32px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#000", margin: "0 0 16px" }}>Events</h2>
            <p style={{ fontSize: 16, color: "#000", margin: "0 0 6px", lineHeight: 1.5 }}>You don't have any upcoming events.</p>
            <p style={{ fontSize: 16, color: "#000", margin: "0 0 40px", lineHeight: 1.5 }}>Browse events to find tickets to hundreds of amazing experiences.</p>
            {/* Primary button */}
            <button
              onClick={() => navigate("/account")}
              style={{ width: "100%", padding: "17px", borderRadius: 100, border: "none", background: "#001a2c", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", letterSpacing: "0.2px", marginBottom: 12 }}
            >
              Order History
            </button>
            {/* Secondary button */}
            <button
              onClick={() => navigate("/")}
              style={{ width: "100%", padding: "17px", borderRadius: 100, border: "1.5px solid #d1d5db", background: "#fff", color: "#000", fontWeight: 700, fontSize: 16, cursor: "pointer", letterSpacing: "0.2px" }}
            >
              Browse events
            </button>
          </div>
        ) : (
          groups.map((group) => (
            <TicketGroup key={group[0].order_number || group[0].id} group={group} onWallet={openWallet} sharedTicketMap={sharedTicketMap} onManageShare={(ticket, share) => setManageShareTicket({ ticket, share })} selectMode={selectMode} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
          ))
        )}
      </div>

      {/* Multi-select bottom action bar */}
      {selectMode && selectedIds.size > 0 && (
        <div style={{ position: "fixed", bottom: "calc(90px + env(safe-area-inset-bottom))", left: 0, right: 0, display: "flex", justifyContent: "center", padding: "0 20px", zIndex: 100 }}>
          <div style={{ background: "#001a2c", borderRadius: 100, padding: "8px 8px 8px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", width: "100%", maxWidth: 400 }}>
            <span style={{ color: "white", fontSize: 14, fontWeight: 600, flex: 1 }}>
              {selectedIds.size} {selectedIds.size === 1 ? "ticket" : "tickets"} selected
            </span>
            <button
              onClick={handleBulkTransfer}
              style={{ background: "#427926", color: "white", border: "none", padding: "12px 24px", borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Transfer Selected
            </button>
          </div>
        </div>
      )}

      {/* Bulk transfer modal */}
      {bulkTransferTickets && (
        <BulkTransferModal
          tickets={bulkTransferTickets}
          user={user}
          senderName={user?.display_name || user?.full_name || ""}
          onClose={() => { setBulkTransferTickets(null); exitSelectMode(); loadTickets(); }}
        />
      )}
    </div>
    </PullToRefresh>
  );
}