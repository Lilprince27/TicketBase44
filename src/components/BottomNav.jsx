import { useLocation, Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

const ACTIVE_COLOR = "#007AFF";
const INACTIVE_COLOR = "#1A1A1A";

// Nav bar only appears on these main pages
const NAV_PATHS = ["/", "/account", "/tickets"];

const navItems = [
  {
    id: "events",
    label: "Events",
    path: "/",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="23" height="23" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR}>
        <path d="M12 3L2 12h3v8h5v-6h4v6h5v-8h3z" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    path: "/account",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="23" height="23" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR}>
        <circle cx="12" cy="7" r="4.5" />
        <path d="M4 14 L4 19 Q4 22 7 22 L17 22 Q20 22 20 19 L20 14 Z" />
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="23" height="23" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR}>
        <path transform="rotate(-45 12 12)" d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" />
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
          padding-bottom: max(env(safe-area-inset-bottom) - 2px, 2px);
          pointer-events: none;
        }
        .tnav-pill {
          display: flex;
          align-items: center;
          background: rgba(248, 248, 248, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-radius: 100px;
          padding: 7px 8px;
          gap: 2px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(0,0,0,0.06);
          pointer-events: all;
        }
        .tnav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5px 16px;
          border-radius: 16px;
          text-decoration: none;
          cursor: pointer;
          border: none;
          background: transparent;
          gap: 3px;
          width: 80px;
          flex-shrink: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s ease;
        }
        .tnav-item:active { transform: scale(0.92); }
        .tnav-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }
        .tnav-icon-wrap.active {
          background: rgba(0, 122, 255, 0.1);
        }
        .tnav-label {
          font-size: 10px;
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