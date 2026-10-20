import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { sendEmailWithRetry } from "@/lib/sendEmailWithRetry";

const TK_NAVY = "#001f2d";
const TK_GREEN = "#4e783e";

export default function AdminTransferPanel() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadTransfers(); }, []);

  const loadTransfers = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.TicketTransfer.list("-created_date", 100);
      setTransfers(list);
    } catch (e) {}
    setLoading(false);
  };

  const handleCancel = async (transfer) => {
    if (!window.confirm(`Cancel this transfer to ${transfer.recipient_email}? The recipient will be notified by email.`)) return;
    try {
      await base44.entities.TicketTransfer.update(transfer.id, {
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      });
      await base44.entities.TransferAuditLog.create({
        transfer_id: transfer.id,
        secure_token: transfer.secure_token || "",
        action: "cancelled",
        actor_email: "admin",
        metadata: JSON.stringify({ previous_status: transfer.status }),
      });
      try {
        await base44.integrations.Core.SendEmail({
          to: transfer.recipient_email,
          subject: `Ticket transfer cancelled: ${transfer.event_name || "Ticket"}`,
          body: `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
              <h2 style="color: #fff; margin: 0 0 8px;">Ticket Transfer Cancelled</h2>
              <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">This ticket transfer has been cancelled.</p>
            </div>
            <div style="background: #fff; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
              <div style="background: #f8f9fa; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #001f2d; font-size: 18px; font-weight: 700; margin: 0 0 8px;">${transfer.event_name || "Event"}</p>
                <p style="color: #666; font-size: 14px; margin: 0 0 4px;"><strong>Date:</strong> ${transfer.event_date || "TBD"}</p>
                <p style="color: #666; font-size: 14px; margin: 0;"><strong>Venue:</strong> ${transfer.venue_name || "TBD"}</p>
              </div>
              <p style="color: #333; font-size: 14px; margin: 0 0 16px; line-height: 1.5;">
                The ticket transfer from ${transfer.sender_email} has been cancelled. The transfer link is no longer valid.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
            </div>
          </div>`,
        });
      } catch (e) {}
      loadTransfers();
    } catch (e) { alert("Could not cancel transfer."); }
  };

  const handleResend = async (transfer) => {
    try {
      const ticketData = JSON.parse(transfer.ticket_snapshot);
      const url = `${window.location.origin}/transfer/${transfer.secure_token}`;
      const html = `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
          <h2 style="color: #fff; margin: 0 0 8px;">You've received a ticket transfer</h2>
        </div>
        <div style="background: #fff; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 14px; margin: 0 0 16px;">${ticketData.event_name || "Event"} — ${ticketData.venue_name || ""}</p>
          <a href="${url}" style="display: block; text-align: center; padding: 16px; background: #4e783e; color: #fff; font-weight: 700; border-radius: 8px; text-decoration: none;">Accept Ticket</a>
        </div>
      </div>`;
      const result = await sendEmailWithRetry({
        to: transfer.recipient_email,
        subject: "Reminder: You've received a Ticketek ticket transfer",
        body: html,
      });
      if (!result.ok) {
        alert(`Could not resend email to ${transfer.recipient_email}: ${result.error}`);
        return;
      }
      await base44.entities.TransferAuditLog.create({
        transfer_id: transfer.id,
        secure_token: transfer.secure_token,
        action: "resend",
        actor_email: "admin",
        metadata: "{}",
      });
      alert("Transfer email resent.");
    } catch (e) { alert("Could not resend email."); }
  };

  const handleDelete = async (transfer) => {
    if (!window.confirm(`Delete this transfer (${transfer.event_name || "Unknown event"} → ${transfer.recipient_email})?`)) return;
    try {
      await base44.entities.TicketTransfer.delete(transfer.id);
      setTransfers(prev => prev.filter(item => item.id !== transfer.id));
    } catch (e) {
      alert("Could not delete transfer.");
    }
  };

  const handleDeleteFiltered = async () => {
    const listToDelete = filter === "all" ? transfers : transfers.filter(t => t.status === filter);
    if (listToDelete.length === 0) return;
    const label = filter === "all" ? "ALL" : filter.toUpperCase();
    if (!window.confirm(`Delete ${listToDelete.length} ${label} transfer record(s)? This cannot be undone.`)) return;
    try {
      for (const t of listToDelete) {
        await base44.entities.TicketTransfer.delete(t.id);
      }
      await loadTransfers();
    } catch (e) {
      alert("Could not delete transfers.");
    }
  };

  const filtered = filter === "all" ? transfers : transfers.filter(t => t.status === filter);

  const statusColors = {
    pending: "#e6a700",
    accepted: "#4caf50",
    declined: "#ef4444",
    expired: "#999",
    cancelled: "#999",
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: 0 }}>Ticket Transfers</h3>
        {filtered.length > 0 && (
          <button
            onClick={handleDeleteFiltered}
            style={{ padding: "6px 12px", borderRadius: 8, background: "#fef2f2", color: "#dc2626", fontWeight: 600, fontSize: 12, border: "1px solid #fecaca", cursor: "pointer" }}
          >
            Delete {filter === "all" ? `All (${filtered.length})` : `${filter.charAt(0).toUpperCase() + filter.slice(1)} (${filtered.length})`}
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "pending", "accepted", "declined", "expired", "cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "6px 14px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: filter === s ? TK_NAVY : "#f0f0f0", color: filter === s ? "#fff" : "#666", textTransform: "capitalize" }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 20, color: "#999" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20, color: "#999" }}>No transfers found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ border: "1px solid #e8e8e8", borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: "0 0 2px" }}>{t.event_name || "Unknown event"}</p>
                  <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{t.id.slice(-8).toUpperCase()}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12, textTransform: "uppercase", color: "#fff", background: statusColors[t.status] || "#999" }}>{t.status}</span>
              </div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                <p style={{ margin: "0 0 2px" }}><strong>From:</strong> {t.sender_email}</p>
                <p style={{ margin: "0 0 2px" }}><strong>To:</strong> {t.recipient_email}</p>
                <p style={{ margin: "0 0 2px" }}><strong>Created:</strong> {new Date(t.created_date).toLocaleString()}</p>
                <p style={{ margin: "0 0 2px" }}><strong>Expires:</strong> {t.expires_at ? new Date(t.expires_at).toLocaleString() : "-"}</p>
                {t.accepted_at && <p style={{ margin: "0 0 2px" }}><strong>Accepted:</strong> {new Date(t.accepted_at).toLocaleString()}</p>}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {t.status === "pending" && (
                  <button onClick={() => handleResend(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 6, background: "#f0f4ff", color: TK_NAVY, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>Resend Email</button>
                )}
                {(t.status === "pending" || t.status === "accepted") && (
                  <button onClick={() => handleCancel(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 6, background: "transparent", color: "#ef4444", fontWeight: 600, fontSize: 13, border: "1px solid #ef4444", cursor: "pointer" }}>Cancel Transfer</button>
                )}
                <button onClick={() => handleDelete(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 6, background: "#fef2f2", color: "#dc2626", fontWeight: 600, fontSize: 13, border: "1px solid #fecaca", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}