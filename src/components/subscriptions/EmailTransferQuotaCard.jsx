/**
 * Displays the user's email transfer quota in a card matching the reference design:
 *  - Email address on the left, "N left" in green on the right
 *  - "N used of M" in gray below
 */
export default function EmailTransferQuotaCard({ email, quota, used }) {
  const remaining = Math.max(0, (quota || 0) - (used || 0));
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        padding: "16px 18px",
        marginBottom: 24,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#212121" }}>{email || ""}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#66bb6a" }}>{remaining} left</span>
      </div>
      <div style={{ fontSize: 13, color: "#9e9e9e", marginTop: 4 }}>
        {used || 0} used of {quota || 0}
      </div>
    </div>
  );
}