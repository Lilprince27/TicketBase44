import { useLocation, Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

const navItems = [
  {
    id: "events",
    label: "Events",
    path: "/",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="28" height="28" fill={active ? "#2563eb" : "#111"}>
        <path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10.5Z"/>
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    path: "/account",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="28" height="28" fill={active ? "#2563eb" : "#111"}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="28" height="28" fill={active ? "#2563eb" : "#111"}>
        <path d="M22 10V6H4v4c1.1 0 2 .9 2 2s-.9 2-2 2v4h18v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" transform="rotate(-30 12 12)"/>
      </svg>
    ),
  },
];

// Persist scroll positions per route
const scrollPositions = {};

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const accountTapCount = useRef(0);
  const accountTapTimer = useRef(null);

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  // Save scroll position before leaving current page
  const saveScroll = () => {
    scrollPositions[location.pathname] = window.scrollY;
  };

  // Restore scroll after navigation
  const restoreScroll = (path) => {
    const saved = scrollPositions[path] || 0;
    setTimeout(() => window.scrollTo({ top: saved, behavior: "instant" }), 50);
  };

  const handleAccountTap = (e) => {
    e.preventDefault();
    saveScroll();
    accountTapCount.current += 1;
    clearTimeout(accountTapTimer.current);
    accountTapTimer.current = setTimeout(() => {
      const dest = accountTapCount.current >= 2 ? "/subscriptions" : "/account";
      accountTapCount.current = 0;
      navigate(dest);
      restoreScroll(dest);
    }, 300);
  };

  return (
    <>
      <style>{`
        .tnav-wrap {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          display: flex;
          justify-content: center;
          padding-bottom: calc(8px + env(safe-area-inset-bottom));
          padding-top: 6px;
          /* pointer-events only on the pill, not the entire bottom strip */
          pointer-events: none;
          /* ensure it never creates a scroll-blocking region */
          touch-action: none;
        }
        .tnav-pill {
          display: flex;
          align-items: center;
          background: rgba(245, 245, 247, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 100px;
          padding: 6px 8px;
          gap: 2px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06);
          pointer-events: all;
        }
        .tnav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 20px;
          border-radius: 80px;
          text-decoration: none;
          cursor: pointer;
          border: none;
          background: transparent;
          gap: 3px;
          min-width: 80px;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s ease;
        }
        .tnav-item:active { transform: scale(0.92); }
        .tnav-item.active { background: rgba(220, 220, 230, 0.9); }
        .tnav-label {
          font-size: 11px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          letter-spacing: 0.1px;
        }
      `}</style>
      <div className="tnav-wrap">
        <div className="tnav-pill">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const handleClick = item.id === "account" ? handleAccountTap : undefined;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={(e) => {
                  saveScroll();
                  if (handleClick) { handleClick(e); return; }
                  restoreScroll(item.path);
                }}
                className={`tnav-item${active ? " active" : ""}`}
                style={{ color: active ? "#2563eb" : "#3c3c43" }}
              >
                {item.icon(active)}
                <span className="tnav-label" style={{ color: active ? "#2563eb" : "#3c3c43" }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}