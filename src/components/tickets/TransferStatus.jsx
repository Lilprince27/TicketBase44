/**
 * Shows the transfer status under a ticket card with a yellow bell notification:
 *  - Pending: "Pending acceptance by [Name]" (yellow bell)
 *  - Accepted: "This ticket has been accepted by [Name]" (yellow bell)
 *  - Declined/Expired/Cancelled: not shown (no longer active)
 */
export default function TransferStatus({ transferRecord }) {
  if (!transferRecord) return null;
  const status = transferRecord.status;
  if (status === "declined" || status === "expired" || status === "cancelled") return null;

  // Extract recipient name from the ticket snapshot (entered by the sender)
  let recipientName = "";
  try {
    const snap = JSON.parse(transferRecord.ticket_snapshot || "{}");
    recipientName = snap.recipient_name || "";
  } catch {}
  if (!recipientName) {
    // Fall back to email-derived name
    const email = transferRecord.recipient_email || "";
    recipientName = email
      .split("@")[0]
      .replace(/[._+-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "recipient";
  }

  const message =
    status === "accepted"
      ? `This ticket has been accepted by ${recipientName}`
      : `Pending acceptance by ${recipientName}`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderTop: "1px solid #f0f0f0",
        background: status === "accepted" ? "#f0fdf4" : "#fffaf0",
      }}
    >
      <span style={{ fontSize: 13, color: "#555" }}>{message}</span>
      {/* Yellow bell notification circle */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#FFC107",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>
    </div>
  );
}