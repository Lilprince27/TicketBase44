/**
 * Shows "This ticket has been accepted by [Name]" with a yellow bell icon
 * under a ticket card that has been shared and accepted by a recipient.
 */
function nameFromEmail(email) {
  if (!email) return "recipient";
  const prefix = email.split("@")[0];
  return prefix
    .replace(/[._+-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function SharedTicketStatus({ shareRecord }) {
  const name = nameFromEmail(shareRecord.accepted_by || shareRecord.recipient_email);
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