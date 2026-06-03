export default function MaintenanceFeeScreen() {
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", backgroundColor: "#f8f9fa", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", margin: 0, padding: "0 16px" }}>
      <div style={{ backgroundColor: "#ffffff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: 32, maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ color: "#333", fontSize: 24, margin: "0 0 16px 0", fontWeight: 700 }}>Access Restricted</h1>
        <p style={{ color: "#666", fontSize: 15, lineHeight: 1.5, margin: "0 0 24px 0" }}>
          Your account is currently locked because the new month has started.
        </p>
        <div style={{ backgroundColor: "#fff9db", borderLeft: "4px solid #fcc419", padding: 16, textAlign: "left", borderRadius: 4, marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, color: "#925400", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>What this means:</h2>
          <p style={{ color: "#454545", fontSize: 14, margin: 0 }}>
            To maintain your account, a monthly maintenance fee of <strong>₦6,000</strong> is required at the beginning of every month.
          </p>
        </div>
        <div style={{ backgroundColor: "#e8f4fd", borderLeft: "4px solid #2196f3", padding: 16, textAlign: "left", borderRadius: 4, marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, color: "#0d47a1", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>How to regain access:</h2>
          <p style={{ color: "#1565c0", fontSize: 14, margin: 0 }}>
            Please message the Admin immediately to make your payment and reactivate your account.
          </p>
        </div>
        <a href="https://t.me/ebuka43" target="_blank" rel="noopener noreferrer"
          style={{ display: "block", backgroundColor: "#007bff", color: "#fff", textDecoration: "none", padding: "12px 24px", borderRadius: 6, fontWeight: 600, fontSize: 15, width: "100%", boxSizing: "border-box" }}>
          Message Admin
        </a>
      </div>
    </div>
  );
}