/**
 * Shows the share/transfer status under a ticket card:
 *  - Pending: "Pending acceptance by [Name]" (amber clock icon)
 *  - Accepted: "This ticket has been accepted by [Name]" (yellow bell icon)
 */
function nameFromEmail(email) {
  if (!email) return "recipient";
  const prefix = email.split("@")[0];
  return prefix
    .replace(/[._+-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function SharedTicketStatus({ shareRecord }) {
  const isAccepted = !!shareRecord.accepted_by;
  const name = nameFromEmail(shareRecord.accepted_by || shareRecord.recipient_email);

  if (isAccepted) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderTop: "1px solid #f0f0f0",
          background: "#fffdf5",
        }}
      >
        <span style={{ fontSize: 13, color: "#555" }}>
          This ticket has been accepted by {name}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC107">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-1.5 1.5v1h15v-1L18 16z" />
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
        Pending acceptance by {name}
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </div>
  );
}