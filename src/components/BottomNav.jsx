import { useLocation, Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

const ACTIVE_COLOR = "#007AFF";
const INACTIVE_COLOR = "#000000";

const navItems = [
  {
    id: "events",
    label: "Events",
    path: "/",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR}>
        <path d="M12 3L2 12h3v8h5v-6h4v6h5v-8h3z" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    path: "/account",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR}>
        <circle cx="12" cy="8" r="4.2" />
        <path d="M5 21c0-3.87 3.13-7 7-7s7 3.13 7 7v1H5z" />
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR}>
        <path transform="rotate(45 12 12)" d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" />
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
          padding-bottom: calc(env(safe-area-inset-bottom) + 6px);
          pointer-events: none;
        }
        .tnav-pill {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border-radius: 100px;
          padding: 6px 8px;
          gap: 2px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.04);
          pointer-events: all;
        }
        .tnav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 14px;
          border-radius: 80px;
          text-decoration: none;
          cursor: pointer;
          border: none;
          background: transparent;
          gap: 3px;
          width: 96px;
          flex-shrink: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s ease, background-color 0.15s ease;
        }
        .tnav-item:active { transform: scale(0.92); }
        .tnav-item.active { background: #EBEBEB; }
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
                style={{ color: active ? ACTIVE_COLOR : INACTIVE_COLOR }}
              >
                {item.icon(active)}
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