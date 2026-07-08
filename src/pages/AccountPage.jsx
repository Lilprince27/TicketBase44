import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import OrderHistorySheet from "../components/tickets/OrderHistorySheet";
import { getCustomerId } from "../lib/customerId";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [showTickets, setShowTickets] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const firstName = (user?.display_name || user?.full_name || "there").split(" ")[0];
  const customerId = getCustomerId(user?.id || "");

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", background: "#fff" }}>

      {/* Dark navy header — matches real Ticketek */}
      <div style={{ background: "#001a2c", paddingTop: "calc(env(safe-area-inset-top) + 28px)", paddingBottom: 28, paddingLeft: 20, paddingRight: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Hello, {firstName}</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0 }}>Customer ID: {customerId}</p>
      </div>

      <div className="page-scroll-padding">

        {/* Account section */}
        <div style={{ padding: "24px 20px 8px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Account</h2>
        </div>

        <MenuItem
          icon={<ProfileIcon />}
          label="Profile"
          onClick={() => navigate("/profile")}
        />
        <MenuItem
          icon={<TicketIcon />}
          label="Your tickets"
          onClick={() => setShowTickets(true)}
        />
        <MenuItem
          icon={<SettingsIcon />}
          label="Settings"
          onClick={() => navigate("/subscriptions")}
          bottomDivider
        />

        {/* Info section */}
        <MenuItem
          icon={<DocIcon />}
          label="Privacy Policy"
          onClick={() => {}}
        />
        <MenuItem
          icon={<HelpIcon />}
          label="Help"
          onClick={() => {}}
        />
        <MenuItem
          icon={<InfoIcon />}
          label="Terms & conditions"
          onClick={() => {}}
          bottomDivider
        />

        {/* Sign out */}
        <MenuItem
          icon={<SignOutIcon />}
          label="Sign out"
          onClick={() => base44.auth.logout()}
        />

        {/* Delete account — red destructive action */}
        <button
          onClick={async () => {
            if (window.confirm("Are you sure you want to delete your account? This will permanently delete your profile and all tickets. This cannot be undone.")) {
              try {
                if (user) {
                  // Delete all user tickets
                  const tickets = await base44.entities.Ticket.filter({ owner_email: user.email }).catch(() => []);
                  await Promise.all(tickets.map(t => base44.entities.Ticket.delete(t.id).catch(() => {})));
                  // Delete user profile
                  const profiles = await base44.entities.UserProfile.filter({ user_email: user.email }).catch(() => []);
                  await Promise.all(profiles.map(p => base44.entities.UserProfile.delete(p.id).catch(() => {})));
                }
              } finally {
                base44.auth.logout();
              }
            }
          }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "16px 20px",
            background: "none", border: "none", borderBottom: "1px solid #f0f0f2",
            cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{ fontSize: 16, color: "#e53e3e", fontWeight: 400 }}>Delete account</span>
          <ChevronRight />
        </button>

        {/* Build number */}
        <div style={{ textAlign: "right", padding: "16px 20px 40px", fontSize: 13, color: "#999" }}>
          Build number 3.3.2 (1227)
        </div>
      </div>

      {showTickets && <OrderHistorySheet user={user} onClose={() => setShowTickets(false)} />}
    </div>
  );
}

function MenuItem({ icon, label, onClick, bottomDivider }) {
  return (
    <>
      <button
        onClick={onClick}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "22px 20px",
          background: "none", border: "none", borderBottom: "1px solid #f0f0f2",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>
            {icon}
          </div>
          <span style={{ fontSize: 16, color: "#111", fontWeight: 400 }}>{label}</span>
        </div>
        <ChevronRight />
      </button>
      {bottomDivider && <div style={{ height: 8, background: "#f5f5f5" }} />}
    </>
  );
}

const ChevronRight = () => (
  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
    <path d="M1 1L7 7L1 13" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#555" strokeWidth="1.6">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
  </svg>
);

const TicketIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#555" strokeWidth="1.6">
    <path d="M3 7h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4V7z" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#555" strokeWidth="1.6">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const DocIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#555" strokeWidth="1.6">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round"/>
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#555" strokeWidth="1.6">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="0.5" fill="#555"/>
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#555" strokeWidth="1.6">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="8" r="0.5" fill="#555"/>
    <path d="M12 12v5" strokeLinecap="round"/>
  </svg>
);

const SignOutIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#555" strokeWidth="1.6">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round"/>
    <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);