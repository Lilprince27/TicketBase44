import { useState } from "react";

/**
 * Shown to a recipient whose ticket was sent by text message, so no email
 * address is on the share record. Collecting it gives them a sign-in identity
 * and an address for the accepted-ticket emails.
 */
export default function RecipientEmailStep({ senderName, eventName, busy, onSave, error: serverError }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = emailRegex.test(email.trim());

  const handleContinue = () => {
    if (!valid) { setError("Please enter a valid email address."); return; }
    setError("");
    onSave(email.trim());
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Confirm your email</h2>
      <p style={{ fontSize: 14, color: "#666", margin: "0 0 20px" }}>
        {senderName || "A Ticketek member"} sent you a ticket for {eventName || "an event"} by text message.
        Enter your email so we can send you the ticket and sign you in.
      </p>

      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 8 }}>Email*</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@email.com"
        autoCapitalize="none"
        autoCorrect="off"
        style={{ width: "100%", padding: "14px 16px", borderRadius: 8, border: "1px solid #d0d0d0", color: "#000", fontSize: 16, outline: "none", boxSizing: "border-box", background: "#fff", marginBottom: 16 }}
      />

      {(error || serverError) && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error || serverError}</p>}

      <button onClick={handleContinue} disabled={!valid || busy}
        style={{ display: "block", width: "100%", padding: "18px 0", borderRadius: 8, background: !valid || busy ? "#9cb89a" : "#4e783e", color: "#fff", fontWeight: 700, fontSize: 18, border: "none", cursor: !valid || busy ? "default" : "pointer" }}>
        {busy ? "Saving…" : "Continue"}
      </button>
    </div>
  );
}