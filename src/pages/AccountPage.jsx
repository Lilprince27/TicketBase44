import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import OrderHistorySheet from "../components/tickets/OrderHistorySheet";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [showTickets, setShowTickets] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const firstName = (user?.display_name || user?.full_name || "there").split(" ")[0];
  const customerId = user?.id ? String(user.id).slice(0, 7) : "...";

  const menuItems = [
    {
      label: "Your Profile",
      onClick: () => navigate("/profile"),
      icon: <svg viewBox="0 0 24 24" fill="none" width="26" height="26"><path d="M19.5 19.5C19.5 16.5 17 14 12 14C7 14 4.5 16.5 4.5 19.5C4.5 20.3 5.2 21 6 21H18C18.8 21 19.5 20.3 19.5 19.5Z" stroke="#8e8e8e" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="12" cy="11.5" r="4" fill="#ffffff" stroke="#8e8e8e" strokeWidth="1.2"/></svg>,
    },
    {
      label: "Your Tickets",
      onClick: () => setShowTickets(true),
      icon: <svg viewBox="0 0 24 24" fill="none" width="26" height="26"><g transform="rotate(-45 12 12)"><path d="M 2 7 H 22 V 10.5 C 20.6 10.5 19.5 11.2 19.5 12 C 19.5 12.8 20.6 13.5 22 13.5 V 17 H 2 V 13.5 C 3.4 13.5 4.5 12.8 4.5 12 C 4.5 11.2 3.4 10.5 2 10.5 Z" stroke="#8e8e8e" strokeWidth="1" strokeLinejoin="miter"/></g></svg>,
    },
    {
      label: "Your Subscriptions",
      onClick: () => navigate("/subscriptions"),
      icon: <svg viewBox="0 0 24 24" fill="none" width="26" height="26"><path d="M20 3H3V17H15.5L20 20.5V3ZM19 4V18.3L15.9 16H4V4H19Z" fill="#8e8e8e"/><rect x="6.5" y="7.5" width="10" height="1" fill="#8e8e8e"/><rect x="6.5" y="11.5" width="10" height="1" fill="#8e8e8e"/></svg>,
    },
    {
      label: "Terms & Conditions",
      onClick: () => {},
      icon: <svg viewBox="0 0 24 24" fill="none" width="26" height="26"><path d="M20 2H4V22H12.5V21H5V3H19V12.5H20V2Z" fill="#8e8e8e"/><rect x="6.5" y="6.5" width="7" height="1" fill="#8e8e8e"/><rect x="6.5" y="10.5" width="10" height="1" fill="#8e8e8e"/><rect x="6.5" y="14.5" width="5" height="1" fill="#8e8e8e"/><path d="M12.5 17.5L13.2 16.8L15.5 19.1L21.3 13.3L22 14L15.5 20.5L12.5 17.5Z" fill="#8e8e8e"/></svg>,
    },
    {
      label: "Privacy Policy",
      onClick: () => {},
      icon: <svg viewBox="0 0 24 24" fill="none" width="26" height="26"><path d="M7 10V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V10" stroke="#b0b0b0" strokeWidth="0.8" strokeLinecap="round"/><rect x="4" y="10" width="16" height="12" rx="2" stroke="#b0b0b0" strokeWidth="0.8"/><path d="M12 13.5C12.55 13.5 13 13.05 13 12.5C13 11.95 12.55 11.5 12 11.5C11.45 11.5 11 11.95 11 12.5C11 13.05 11.45 13.5 12 13.5ZM12 13.5V16.5" stroke="#b0b0b0" strokeWidth="0.8" strokeLinecap="round"/></svg>,
    },
    {
      label: "Help",
      onClick: () => navigate("/profile"),
      icon: <svg viewBox="0 0 24 24" fill="none" width="26" height="26"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" stroke="#b0b0b0" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    },
    {
      label: "Delete account",
      onClick: () => {},
      icon: <svg viewBox="0 0 100 100" width="26" height="26"><circle cx="50" cy="50" r="40" stroke="#b0b0b0" strokeWidth="12" fill="none"/><line x1="21.7" y1="21.7" x2="78.3" y2="78.3" stroke="#b0b0b0" strokeWidth="12" strokeLinecap="butt"/></svg>,
    },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", background: "#fff", minHeight: "100vh", maxWidth: 600, margin: "0 auto" }}>
      {/* Sticky header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 100 }}>
        <div style={{ height: 48 }} />
        <div style={{ textAlign: "center", paddingBottom: 4 }}>
          <h1 style={{ fontSize: 21, fontWeight: 500, color: "#000", letterSpacing: "-0.2px", margin: 0 }}>Your Account</h1>
          <div style={{ fontSize: 13.5, color: "#555", marginTop: 5 }}>Customer ID: {customerId}</div>
        </div>
      </div>

      <div style={{ padding: "0 24px 160px 24px" }}>
        {/* Welcome */}
        <div style={{ padding: "36px 0 16px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 500, color: "#333", marginBottom: 12 }}>Hi {firstName}</h2>
          <p style={{ fontSize: 17, color: "#555", fontWeight: 400 }}>Welcome.</p>
        </div>

        {/* Menu */}
        <nav style={{ marginTop: 12 }}>
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.onClick}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid #eef0f2", width: "100%", background: "none", border: "none", borderBottom: "1px solid #eef0f2", cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
                <span style={{ fontSize: 17, color: "#2c5270", fontWeight: 400 }}>{item.label}</span>
              </div>
              <span style={{ color: "#b3b3b3", fontSize: 15 }}>❯</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "40px 0", position: "relative" }}>
          <button onClick={() => base44.auth.logout()}
            style={{ fontSize: 16, color: "#2c5270", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 24 }}>
            Sign out
          </button>
          <div style={{ fontSize: 14, color: "#888", position: "absolute", right: 0, top: 40 }}>Version 3.2.7</div>
          <div style={{ width: "100%", textAlign: "center", marginTop: 12 }}>
            <a href="#" style={{ fontSize: 14, color: "#2c5270", textDecoration: "none", fontWeight: 500 }}>Cookie &amp; Performance Monitoring Consent</a>
          </div>
        </div>
      </div>

      {/* Order History Bottom Sheet */}
      {showTickets && <OrderHistorySheet user={user} onClose={() => setShowTickets(false)} />}
    </div>
  );
}