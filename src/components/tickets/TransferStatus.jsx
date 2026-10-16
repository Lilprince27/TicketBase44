/**
 * Shows the transfer status under a ticket card:
 *  - Pending: "Pending acceptance by [Name]" (amber clock icon)
 *  - Accepted: "This ticket has been accepted by [Name]" (green check icon)
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

  if (status === "accepted") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderTop: "1px solid #f0f0f0",
          background: "#f0fdf4",
        }}
      >
        <span style={{ fontSize: 13, color: "#555" }}>
          This ticket has been accepted by {recipientName}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
    );
  }

  // Pending
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderTop: "1px solid #f0f0f0",
        background: "#fffaf0",
      }}
    >
      <span style={{ fontSize: 13, color: "#555" }}>
        Pending acceptance by {recipientName}
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </div>
  );
}