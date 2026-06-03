import { useLocation, Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

const isAndroid = () => /android/i.test(navigator.userAgent);
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

const navItems = [
  {
    id: "events",
    label: "Events",
    path: "/",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} strokeWidth="1.5">
        <path d="M3 10L12 3L21 10V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10Z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    path: "/account",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ transform: "rotate(-30deg)" }}>
        <path d="M22 10V6H4v4c1.1 0 2 .9 2 2s-.9 2-2 2v4h18v-4c-1.1 0-2-.9-2-2s.9-2 2-2z"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const accountTapCount = useRef(0);
  const accountTapTimer = useRef(null);

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleAccountTap = (e) => {
    e.preventDefault();
    accountTapCount.current += 1;
    clearTimeout(accountTapTimer.current);
    accountTapTimer.current = setTimeout(() => {
      if (accountTapCount.current >= 2) {
        navigate("/subscriptions");
      } else {
        navigate("/account");
      }
      accountTapCount.current = 0;
    }, 300);
  };

  const android = isAndroid();

  // Android Material Design nav
  if (android) {
    return (
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "#f0f4ff",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: 64,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          const handleClick = item.id === "account" ? handleAccountTap : undefined;
          return (
            <Link key={item.id} to={item.path} onClick={handleClick}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textDecoration: "none", color: active ? "#3b5bdb" : "#555", gap: 3, paddingTop: 8 }}>
              <div style={{ width: 64, height: 32, borderRadius: 16, backgroundColor: active ? "rgba(59,91,219,0.12)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
                {item.icon(active)}
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.2 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // iOS Cupertino style (default)
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-50 flex"
      style={{
        transform: "translateX(-50%)",
        bottom: "calc(20px + env(safe-area-inset-bottom))",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "100px",
        padding: "8px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        border: "1px solid rgba(255,255,255,0.35)",
        gap: "5px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, sans-serif",
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        const handleClick = item.id === "account" ? handleAccountTap : undefined;
        return (
          <Link key={item.id} to={item.path} onClick={handleClick}
            className="flex flex-col items-center justify-center no-underline"
            style={{
              padding: "10px 24px",
              borderRadius: "100px",
              background: active ? "#f2f2f2" : "transparent",
              color: active ? "#2d66f7" : "#000000",
              transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
              minWidth: 72,
            }}>
            {item.icon(active)}
            <span style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}