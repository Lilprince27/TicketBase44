import { useLocation, Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

const navItems = [
  {
    id: "events",
    label: "Events",
    path: "/",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? "#2563eb" : "#1c1c1e"}>
        {/* House body */}
        <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    path: "/account",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? "#2563eb" : "#1c1c1e"}>
        {/* Circle head */}
        <circle cx="12" cy="7" r="4"/>
        {/* Rounded shoulders body */}
        <path d="M4 20C4 16.134 7.582 13 12 13C16.418 13 20 16.134 20 20H4Z"/>
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? "#2563eb" : "#1c1c1e"}>
        {/* Diagonal ticket — rotated rectangle with notch cutouts */}
        <g transform="rotate(-45 12 12)">
          <rect x="3" y="8" width="18" height="8" rx="1"/>
          <circle cx="3" cy="12" r="2" fill="white"/>
          <circle cx="21" cy="12" r="2" fill="white"/>
        </g>
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
      // If already on account, reset to root of account
      if (location.pathname === dest || location.pathname.startsWith(dest)) {
        navigate(dest, { replace: true });
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        navigate(dest);
        restoreScroll(dest);
      }
    }, 300);
  };

  const handleNavTap = (e, item) => {
    // If tapping the already-active tab, scroll to top / reset to root
    if (isActive(item.path)) {
      e.preventDefault();
      saveScroll();
      scrollPositions[item.path] = 0;
      navigate(item.path, { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    saveScroll();
    restoreScroll(item.path);
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
          /* pass all scroll/touch gestures through the transparent strip */
          touch-action: pan-y;
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
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={(e) => {
                  if (item.id === "account") { handleAccountTap(e); return; }
                  handleNavTap(e, item);
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