import { useLocation, Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

const ACTIVE_COLOR = "#007AFF";
const INACTIVE_COLOR = "#000000";

// Nav bar only appears on these main pages
const NAV_PATHS = ["/", "/account", "/tickets"];

const navItems = [
  {
    id: "events",
    label: "Events",
    path: "/",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR}>
        <path d="M3 11.5 L12 3 L16.2 7 L16.2 4.5 L18.8 4.5 L18.8 9.4 L21 11.5 L21 21 L15 21 L15 15 L9 15 L9 21 L3 21 Z" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    path: "/account",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-2.7 5.3-4 8-4s8 1.3 8 4z" />
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR} fillRule="evenodd">
        <g transform="rotate(45 12 12)">
          <rect x="4" y="7" width="16" height="10" rx="2.5" />
          <circle cx="12" cy="7" r="2" />
          <circle cx="12" cy="17" r="2" />
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

  // Only render on main pages — hidden everywhere else (chat, create ticket, profile, etc.)
  if (!NAV_PATHS.includes(location.pathname)) return null;

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const saveScroll = () => {
    scrollPositions[location.pathname] = window.scrollY;
  };

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
          align-items: flex-end;
          padding: 0 16px;
          padding-bottom: max(env(safe-area-inset-bottom) - 10px, 6px);
          pointer-events: none;
        }
        .tnav-pill {
          display: flex;
          align-items: center;
          background: rgba(242, 242, 242, 0.88);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-radius: 100px;
          padding: 6px 8px;
          gap: 4px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.05);
          pointer-events: all;
        }
        .tnav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 20px;
          border-radius: 26px;
          text-decoration: none;
          cursor: pointer;
          border: none;
          background: transparent;
          gap: 1.5px;
          width: 82px;
          flex-shrink: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          transition: background-color 0.18s ease, transform 0.15s ease;
        }
        .tnav-item:active { transform: scale(0.92); }
        .tnav-item.active {
          background: rgba(0, 0, 0, 0.06);
        }
        .tnav-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 28px;
        }
        .tnav-label {
          font-size: 10.5px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          letter-spacing: 0.1px;
          line-height: 1;
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
                className="tnav-item"
              >
                <div className={`tnav-icon-wrap${active ? " active" : ""}`}>
                  {item.icon(active)}
                </div>
                <span className="tnav-label" style={{ color: active ? ACTIVE_COLOR : INACTIVE_COLOR }}>
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