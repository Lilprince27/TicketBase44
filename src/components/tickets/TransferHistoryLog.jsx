import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { buildTransferUrl } from "@/lib/ticketUtils";

const STATUS_CONFIG = {
  pending: { label: "Pending", bg: "#fef3c7", color: "#b45309", dot: "#e6a700" },
  accepted: { label: "Accepted", bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  cancelled: { label: "Cancelled", bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" },
  declined: { label: "Declined", bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
  expired: { label: "Expired", bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" },
};

export default function TransferHistoryLog({ userEmail }) {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);

  useEffect(() => {
    if (!userEmail) return;
    loadTransfers();
  }, [userEmail]);

  const loadTransfers = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.TicketTransfer.list("-created_date", 50);
      setTransfers(list.filter(t => t.sender_email === userEmail));
    } catch (e) {}
    setLoading(false);
  };

  const handleCancel = async (transfer) => {
    if (cancellingId) return;
    if (!window.confirm(`Cancel this transfer to ${transfer.recipient_email}? The recipient will be notified by email.`)) return;
    setCancellingId(transfer.id);
    try {
      await base44.entities.TicketTransfer.update(transfer.id, {
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      });
      try {
        await base44.entities.TransferAuditLog.create({
          transfer_id: transfer.id,
          secure_token: transfer.secure_token,
          action: "cancelled",
          actor_email: userEmail,
          metadata: JSON.stringify({ previous_status: transfer.status }),
        });
      } catch (e) {}
      try {
        await base44.entities.TicketHistory.create({
          ticket_name: transfer.event_name || "Transferred ticket",
          owner_email: userEmail,
          action: "cancelled",
          actor_email: userEmail,
          recipient_email: transfer.recipient_email,
          details: `Transfer cancelled by sender (was ${transfer.status})`,
        });
      } catch (e) {}
      try {
        await base44.integrations.Core.SendEmail({
          to: transfer.recipient_email,
          subject: `Ticket transfer cancelled: ${transfer.event_name || "Ticket"}`,
          body: buildCancellationEmailHtml(transfer),
        });
      } catch (e) {}
      loadTransfers();
    } catch (e) {
      alert("Could not cancel transfer.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleResend = async (transfer) => {
    if (resendingId) return;
    setResendingId(transfer.id);
    try {
      const url = buildTransferUrl(transfer.secure_token);
      let ticketData = {};
      try { ticketData = JSON.parse(transfer.ticket_snapshot); } catch (e) {}
      try {
        await base44.integrations.Core.SendEmail({
          to: transfer.recipient_email,
          subject: `Reminder: You've received a ticket transfer for ${transfer.event_name || "an event"}`,
          body: buildResendEmailHtml(transfer, ticketData, url, userEmail),
        });
      } catch (e) {}
      try {
        await base44.entities.TransferAuditLog.create({
          transfer_id: transfer.id,
          secure_token: transfer.secure_token,
          action: "resend",
          actor_email: userEmail,
          metadata: JSON.stringify({ recipient_email: transfer.recipient_email }),
        });
      } catch (e) {}
      try {
        await base44.entities.TicketHistory.create({
          ticket_name: transfer.event_name || "Transferred ticket",
          owner_email: userEmail,
          action: "sent",
          actor_email: userEmail,
          recipient_email: transfer.recipient_email,
          details: `Transfer email resent to ${transfer.recipient_email}`,
        });
      } catch (e) {}
      alert(`Transfer email resent to ${transfer.recipient_email}`);
    } catch (e) {
      alert("Could not resend transfer email.");
    } finally {
      setResendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 p-4 mb-4">
        <h3 className="text-base font-bold text-gray-800 mb-2">Transfer History</h3>
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 p-4 mb-4">
        <h3 className="text-base font-bold text-gray-800 mb-1">Transfer History</h3>
        <p className="text-xs text-gray-400">No ticket transfers yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 p-4 mb-4">
      <h3 className="text-base font-bold text-gray-800 mb-3">Transfer History</h3>
      <div className="space-y-3">
        {transfers.map(t => {
          const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
          const canCancel = t.status === "pending" || t.status === "accepted";
          const canResend = t.status === "pending";
          const date = t.created_date ? new Date(t.created_date) : null;
          const dateStr = date ? date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : "";
          return (
            <div key={t.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex-shrink-0 mt-1">
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: cfg.dot }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-gray-800 truncate flex-1">{t.event_name || "Unknown event"}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase", background: cfg.bg, color: cfg.color, whiteSpace: "nowrap" }}>{cfg.label}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">To: {t.recipient_email}</p>
                {t.venue_name && <p className="text-xs text-gray-400 truncate">{t.venue_name} · {t.event_date || ""}</p>}
                <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
                {(canResend || canCancel) && (
                  <div className="flex gap-2 mt-2">
                    {canResend && (
                      <button
                        onClick={() => handleResend(t)}
                        disabled={resendingId === t.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
                        style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
                      >
                        {resendingId === t.id ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 border border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : "Resend Email"}
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(t)}
                        disabled={cancellingId === t.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
                        style={{ background: "transparent", color: "#ef4444", border: "1px solid #ef4444" }}
                      >
                        {cancellingId === t.id ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 border border-red-300 border-t-red-500 rounded-full animate-spin" />
                            Cancelling...
                          </span>
                        ) : "Cancel Transfer"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildCancellationEmailHtml(transfer) {
  return `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
    <div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
      <h2 style="color: #fff; margin: 0 0 8px;">Ticket Transfer Cancelled</h2>
      <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">The sender has cancelled this ticket transfer.</p>
    </div>
    <div style="background: #fff; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
      <div style="background: #f8f9fa; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
        <p style="color: #001f2d; font-size: 18px; font-weight: 700; margin: 0 0 8px;">${transfer.event_name || "Event"}</p>
        <p style="color: #666; font-size: 14px; margin: 0 0 4px;"><strong>Date:</strong> ${transfer.event_date || "TBD"}</p>
        <p style="color: #666; font-size: 14px; margin: 0;"><strong>Venue:</strong> ${transfer.venue_name || "TBD"}</p>
      </div>
      <p style="color: #333; font-size: 14px; margin: 0 0 16px; line-height: 1.5;">
        The ticket transfer from ${transfer.sender_email} has been cancelled. The transfer link is no longer valid. If you have any questions, please contact the sender.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
    </div>
  </div>`;
}

function buildResendEmailHtml(transfer, ticketData, url, senderEmail) {
  return `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
    <div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
      <h2 style="color: #fff; margin: 0 0 8px;">Ticket Transfer Reminder</h2>
      <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">You still have a pending ticket transfer waiting for you.</p>
    </div>
    <div style="background: #fff; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
      <div style="background: #f8f9fa; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
        <p style="color: #001f2d; font-size: 18px; font-weight: 700; margin: 0 0 8px;">${transfer.event_name || "Event"}</p>
        <p style="color: #666; font-size: 14px; margin: 0 0 4px;"><strong>Date:</strong> ${transfer.event_date || "TBD"}</p>
        <p style="color: #666; font-size: 14px; margin: 0 0 4px;"><strong>Venue:</strong> ${transfer.venue_name || "TBD"}</p>
        <p style="color: #666; font-size: 14px; margin: 0;"><strong>Section:</strong> ${ticketData.section_bay || "-"} · Row ${ticketData.row || "-"} · Seat ${ticketData.seat_number || "-"}</p>
      </div>
      <p style="color: #333; font-size: 14px; margin: 0 0 20px; line-height: 1.5;">
        This is a reminder that ${senderEmail} has transferred a ticket to you. Please accept it before the link expires.
      </p>
      <a href="${url}" style="display: block; text-align: center; padding: 16px 0; background: #4e783e; color: #fff; font-weight: 700; font-size: 17px; border-radius: 8px; text-decoration: none; margin-bottom: 16px;">Accept Ticket</a>
      <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">If the button doesn't work, copy this link: ${url}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
    </div>
  </div>`;
}