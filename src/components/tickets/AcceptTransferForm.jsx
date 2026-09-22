import { useState } from "react";
import { Link } from "react-router-dom";
import TicketekLogo from "@/components/TicketekLogo";
import { buildTicketekMobiUrl } from "@/lib/ticketUtils";

const TK_NAVY = "#001f2d";
const TK_GREEN = "#4f7e3c";
const TK_DARK_BLUE = "#002d5c";

/**
 * Acceptance page matching the official Ticketek transfer acceptance design.
 * Shows a ticket icon, sender/event info, a privacy checkbox, and two buttons:
 * "Sign in and accept" (green) and "Create account" (white outline).
 */
export default function AcceptTransferForm({ senderName, eventName, orderNumber, onAccept, busy, redirectPath }) {
  const [checked, setChecked] = useState(true);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "-apple-system, system-ui, sans-serif", color: "#000" }}>
      {/* Navy header */}
      <div style={{ background: TK_NAVY, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TicketekLogo size={24} variant="white" />
        <Link to="/" style={{ color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>Done</Link>
      </div>

      {/* Content */}
      <div style={{ padding: "50px 24px 40px", textAlign: "center" }}>
        {/* Ticket icon — two overlapping ticket stubs */}
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <g transform="rotate(-12 36 24)">
              <rect x="12" y="10" width="44" height="28" rx="4" fill="#667e91" />
              <circle cx="12" cy="24" r="3" fill="#fff" />
              <circle cx="56" cy="24" r="3" fill="#fff" />
              <line x1="30" y1="14" x2="30" y2="34" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            </g>
            <g transform="rotate(8 36 48)">
              <rect x="16" y="34" width="44" height="28" rx="4" fill="#667e91" />
              <circle cx="16" cy="48" r="3" fill="#fff" />
              <circle cx="60" cy="48" r="3" fill="#fff" />
              <line x1="34" y1="38" x2="34" y2="58" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            </g>
          </svg>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#000", margin: "0 0 12px", lineHeight: 1.3 }}>
          Accept ticket from {senderName} for {eventName}
        </h1>

        {/* Sub-heading */}
        <p style={{ fontSize: 15, color: "#333", margin: "0 0 32px", lineHeight: 1.4 }}>
          Sign in or create an account to save this ticket to your ticket wallet
        </p>

        {/* Checkbox */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 28, textAlign: "left", maxWidth: 340, margin: "0 auto 28px" }}>
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} style={{ marginTop: 2, width: 18, height: 18, accentColor: "#0066cc", flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: "#333", margin: 0, lineHeight: 1.4 }}>
            I would like to receive information regarding events directly from the venue and event organisers.{" "}
            <span style={{ color: TK_DARK_BLUE, textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </div>

        {/* Sign in and accept button */}
        <a href={buildTicketekMobiUrl(orderNumber)} target="_blank" rel="noopener noreferrer" onClick={onAccept}
          style={{ display: "block", width: "100%", maxWidth: 340, margin: "0 auto 12px", padding: "16px 0", borderRadius: 8, background: busy ? "#3a5e2e" : TK_GREEN, color: "#fff", fontWeight: 700, fontSize: 17, border: "none", cursor: busy ? "default" : "pointer", textDecoration: "none", boxSizing: "border-box" }}>
          {busy ? "Accepting…" : "Sign in and accept"}
        </a>

        {/* Create account button */}
        <Link to={`/login?next=${encodeURIComponent(redirectPath)}&mode=signup`}
          style={{ display: "block", width: "100%", maxWidth: 340, margin: "0 auto", padding: "16px 0", borderRadius: 8, background: "#fff", color: "#000", fontWeight: 600, fontSize: 17, border: "1px solid #ccc", cursor: "pointer", textDecoration: "none", boxSizing: "border-box" }}>
          Create account
        </Link>
      </div>
    </div>
  );
}