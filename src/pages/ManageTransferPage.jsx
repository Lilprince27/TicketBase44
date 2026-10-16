import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, XCircle, Gift, Mail, MailX } from "lucide-react";

const NAVY = "#0A2540";

export default function ManageTransferPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [transfer, setTransfer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("main"); // "main" | "cancelOptions"
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const t = await base44.entities.Ticket.get(id);
        setTicket(t);
        const me = await base44.auth.me();
        const transfers = await base44.entities.TicketTransfer.filter({ sender_email: me.email });
        for (const tr of transfers) {
          if (tr.status === "declined" || tr.status === "expired" || tr.status === "cancelled") continue;
          try {
            const snap = JSON.parse(tr.ticket_snapshot || "{}");
            if (snap.serial_number === t.serial_number) {
              setTransfer(tr);
              break;
            }
          } catch {}
        }
      } catch (e) {
        console.error("Failed to load transfer:", e);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleCancel = async (sendEmail) => {
    if (!transfer || !ticket) return;
    setCancelling(true);
    try {
      await base44.entities.TicketTransfer.update(transfer.id, {
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      });
      const me = await base44.auth.me();
      try {
        await base44.entities.TransferAuditLog.create({
          transfer_id: transfer.id,
          secure_token: transfer.secure_token,
          action: "cancelled",
          actor_email: me.email,
          metadata: JSON.stringify({ previous_status: transfer.status }),
        });
      } catch {}
      try {
        await base44.entities.TicketHistory.create({
          ticket_id: ticket.id,
          ticket_name: ticket.event_name,
          owner_email: me.email,
          action: "cancelled",
          actor_email: me.email,
          recipient_email: transfer.recipient_email,
          details: `Transfer cancelled by sender (was ${transfer.status})`,
        });
      } catch {}
      if (sendEmail) {
        try {
          const html = `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
              <h2 style="color: #fff; margin: 0 0 8px;">Ticket Transfer Cancelled</h2>
              <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">The sender has cancelled this ticket transfer.</p>
            </div>
            <div style="background: #fff; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
              <div style="background: #f8f9fa; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #001f2d; font-size: 18px; font-weight: 700; margin: 0 0 8px;">${ticket.event_name || "Event"}</p>
                <p style="color: #666; font-size: 14px; margin: 0 0 4px;"><strong>Date:</strong> ${ticket.event_date || "TBD"}</p>
                <p style="color: #666; font-size: 14px; margin: 0;"><strong>Venue:</strong> ${ticket.venue_name || "TBD"}</p>
              </div>
              <p style="color: #333; font-size: 14px; margin: 0 0 16px; line-height: 1.5;">
                The ticket transfer from ${me.email} has been cancelled. The transfer link is no longer valid.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
            </div>
          </div>`;
          await base44.integrations.Core.SendEmail({
            to: transfer.recipient_email,
            subject: `Ticket transfer cancelled: ${ticket.event_name || "Ticket"}`,
            body: html,
          });
        } catch (e) {
          console.error("Email send failed:", e);
        }
      }
      navigate("/tickets");
    } catch (e) {
      console.error("Cancel transfer failed:", e);
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#FAFAFA" }}>
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: "#001a2c", paddingTop: "calc(env(safe-area-inset-top) + 20px)", paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => (view === "cancelOptions" ? setView("main") : navigate(-1))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <ChevronLeft size={24} color="white" />
          </button>
          <h1 style={{ fontSize: 18, margin: 0, fontWeight: 700, color: "white" }}>
            {view === "cancelOptions" ? "Cancel share" : "Manage ticket"}
          </h1>
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 480, margin: "0 auto" }}>
        {view === "main" ? (
          <>
            <button
              onClick={() => setView("cancelOptions")}
              style={{
                width: "100%",
                padding: "18px 20px",
                borderRadius: 14,
                border: "none",
                background: "#ffffff",
                color: NAVY,
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <XCircle size={22} color={NAVY} />
              Cancel share
            </button>
            <button
              onClick={() => navigate(`/ticket-detail/${id}`)}
              style={{
                width: "100%",
                padding: "18px 20px",
                borderRadius: 14,
                border: "none",
                background: "#ffffff",
                color: NAVY,
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Gift size={22} color={NAVY} />
              Event info
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => !cancelling && handleCancel(false)}
              disabled={cancelling}
              style={{
                width: "100%",
                padding: "18px 20px",
                borderRadius: 14,
                border: "none",
                background: "#ffffff",
                color: NAVY,
                fontWeight: 600,
                fontSize: 16,
                cursor: cancelling ? "not-allowed" : "pointer",
                opacity: cancelling ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <MailX size={22} color={NAVY} />
              {cancelling ? "Cancelling..." : "Cancel share without email"}
            </button>
            <button
              onClick={() => !cancelling && handleCancel(true)}
              disabled={cancelling}
              style={{
                width: "100%",
                padding: "18px 20px",
                borderRadius: 14,
                border: "none",
                background: "#ffffff",
                color: NAVY,
                fontWeight: 600,
                fontSize: 16,
                cursor: cancelling ? "not-allowed" : "pointer",
                opacity: cancelling ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Mail size={22} color={NAVY} />
              {cancelling ? "Cancelling..." : "Cancel share with email"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}