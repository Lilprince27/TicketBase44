import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const menuItems = [
  {
    label: "Your Profile",
    path: "/profile",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    label: "Your Tickets",
    path: "/tickets",
    icon: (
      <svg width="22" height="16" viewBox="0 0 24 16" fill="#8e8e93">
        <rect x="0" y="0" width="24" height="16" rx="0"/>
        <circle cx="0" cy="8" r="4" fill="white"/>
        <circle cx="24" cy="8" r="4" fill="white"/>
      </svg>
    ),
  },
  {
    label: "Your Subscriptions",
    path: "/subscriptions",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    label: "Terms & Conditions",
    path: "#",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    label: "Privacy Policy",
    path: "#",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    label: "Help",
    path: "#",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    label: "Delete account",
    path: "#",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
  },
];

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const displayName = user?.display_name || user?.full_name || "there";
  const firstName = displayName.split(" ")[0];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif", background: "#fff", minHeight: "100vh", maxWidth: 414, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      {/* Sticky header */}
      <header style={{
        background: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        paddingTop: "calc(env(safe-area-inset-top, 20px) + 8px)",
        paddingBottom: 15,
        textAlign: "center",
        borderBottom: "none",
      }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.5px" }}>Your Account</div>
        <div style={{ fontSize: 13.5, color: "#333", marginTop: 3 }}>
          Customer ID: {user?.id ? String(user.id).slice(0, 7) : "..."}
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "30px 20px 160px 20px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 35 }}>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: "#2c2c2e", margin: 0 }}>Hi {firstName}</h1>
          <p style={{ fontSize: 18, color: "#3a3a3c", marginTop: 5, marginBottom: 0 }}>Welcome.</p>
        </div>

        {/* Menu */}
        <div style={{ borderTop: "1px solid #f2f2f7" }}>
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "20px 0",
                borderBottom: "1px solid #f2f2f7",
                textDecoration: "none",
                color: "#005689",
              }}
            >
              <div style={{ width: 38, display: "flex", alignItems: "center", flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, fontSize: 18, fontWeight: 400 }}>{item.label}</div>
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="#c7c7cc" strokeWidth="2">
                <polyline points="1 1 7 7 1 13"/>
              </svg>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 30 }}>
          <button
            onClick={() => base44.auth.logout()}
            style={{ color: "#005689", fontSize: 17, fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Sign out
          </button>
          <div style={{ textAlign: "right", color: "#8e8e93", fontSize: 13, margin: "25px 0 15px" }}>Version 3.2.7</div>
          <a href="#" style={{ display: "block", textAlign: "center", color: "#005689", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
            Cookie &amp; Performance Monitoring Consent
          </a>
        </div>
      </div>
    </div>
  );
}