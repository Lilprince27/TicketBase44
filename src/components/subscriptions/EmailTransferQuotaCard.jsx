/**
 * Displays the user's remaining email transfer count below the subscription status.
 */
export default function EmailTransferQuotaCard({ quota, used }) {
  const remaining = Math.max(0, (quota || 0) - (used || 0));
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        padding: "16px 18px",
        marginBottom: 24,
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, color: "#212121" }}>Transfer emails</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#66bb6a" }}>{remaining} left</span>
    </div>
  );
}