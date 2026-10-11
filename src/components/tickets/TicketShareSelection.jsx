import { useState } from "react";
import { X } from "lucide-react";

/**
 * Full-screen selection page that lets the user pick which event/tickets to share.
 * Opens when "Manage ticket" is tapped on a non-shared ticket.
 * After selection, calls onShare(selectedTickets) — parent opens ShareModal or BulkTransferModal.
 */
export default function TicketShareSelection({ tickets, sharedTicketMap, preSelectedId, onClose, onShare }) {
  const [selectedIds, setSelectedIds] = useState(new Set(preSelectedId ? [preSelectedId] : []));

  // Group tickets by order (same as wallet page)
  const grouped = tickets.reduce((acc, t) => {
    const key = t.order_number || t.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});
  const groups = Object.values(grouped);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedCount = selectedIds.size;

  const handleShare = () => {
    const selected = tickets.filter((t) => selectedIds.has(t.id));
    if (selected.length === 0) return;
    onShare(selected);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#fff", display: "flex", flexDirection: "column", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#001a2c", paddingTop: "calc(env(safe-area-inset-top) + 20px)", paddingBottom: 20, paddingLeft: 20, paddingRight: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 20, margin: 0, fontWeight: 700, color: "white" }}>Select Tickets to Share</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "4px 0 0 0" }}>Choose which tickets you'd like to share</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
          <X size={24} color="white" />
        </button>
      </div>

      {/* Ticket list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 100px" }}>
        {groups.map((group) => {
          const first = group[0];
          return (
            <div key={first.order_number || first.id} style={{ marginBottom: 16, border: "1.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden" }}>
              {/* Event header */}
              <div style={{ padding: "12px 16px", background: "#f8f9fa", display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={first.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop"}
                  alt={first.event_name}
                  style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: 14, margin: 0, fontWeight: 700, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{first.event_name}</h2>
                  <p style={{ fontSize: 12, margin: "2px 0 0", color: "#666" }}>{first.event_date} · {first.venue_name}</p>
                </div>
              </div>

              {/* Individual tickets */}
              {group.map((ticket, idx) => {
                const isShared = !!sharedTicketMap?.[ticket.serial_number]?.accepted_by;
                const isSelected = selectedIds.has(ticket.id);
                return (
                  <div
                    key={ticket.id}
                    onClick={() => !isShared && toggleSelect(ticket.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "14px 16px",
                      borderTop: idx === 0 ? "1px solid #f0f0f0" : "1px solid #f0f0f0",
                      cursor: isShared ? "default" : "pointer",
                      opacity: isShared ? 0.5 : 1,
                      background: isSelected ? "#f0f5ee" : "white",
                    }}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      border: isSelected ? "none" : "2px solid #ccc",
                      background: isSelected ? "#427926" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                      flexShrink: 0,
                    }}>
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                    </div>

                    {/* Ticket info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0 }}>{ticket.ticket_type || "General Admission"}</p>
                      <p style={{ fontSize: 12, color: "#666", margin: "2px 0 0" }}>
                        Sec {ticket.section_bay || "-"} · Row {ticket.row || "-"} · Seat {ticket.seat_number || "-"}
                      </p>
                      {isShared && <p style={{ fontSize: 11, color: "#999", margin: "2px 0 0" }}>Already shared</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom action bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px calc(20px + env(safe-area-inset-bottom))", background: "white", borderTop: "1px solid #e0e0e0", boxShadow: "0 -4px 12px rgba(0,0,0,0.05)" }}>
        <button
          onClick={handleShare}
          disabled={selectedCount === 0}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 100,
            border: "none",
            background: selectedCount > 0 ? "#427926" : "#ccc",
            color: "white",
            fontWeight: 700,
            fontSize: 16,
            cursor: selectedCount > 0 ? "pointer" : "default",
          }}
        >
          {selectedCount > 0 ? `Share ${selectedCount} ${selectedCount === 1 ? "Ticket" : "Tickets"}` : "Select tickets to share"}
        </button>
      </div>
    </div>
  );
}