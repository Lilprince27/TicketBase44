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
      <svg viewBox="0 0 24 24" width="30" height="30" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR}>
        <path d="M12 3L2 12h3v8h5v-6h4v6h5v-8h3z M15.5 3.5h2v5h-2z" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    path: "/account",
    icon: (active) => (
      <img
        src="https://media.base44.com/images/public/6a29092b3d99cb9d297711be/350de300c_47218F83-6EEA-4C87-8F4C-CE116550CBC5.png"
        alt="Account"
        style={{ width: 46, height: 46, objectFit: "contain", mixBlendMode: "multiply", display: "block", flexShrink: 0 }}
      />
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="28" height="28" fill={active ? ACTIVE_COLOR : INACTIVE_COLOR}>
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
          padding: 6px 14px;
          padding-bottom: calc(env(safe-area-inset-bottom) + 2px);
          pointer-events: none;
          background: rgba(255, 255, 255, 0.62);
          -webkit-backdrop-filter: saturate(160%) blur(18px);
          backdrop-filter: saturate(160%) blur(18px);
          border-top: 1px solid rgba(220, 220, 220, 0.6);
        }
        .tnav-pill {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #ECECEC;
          border-radius: 34px;
          padding: 6px;
          gap: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          pointer-events: all;
        }
        .tnav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px 14px;
          border-radius: 24px;
          text-decoration: none;
          cursor: pointer;
          border: none;
          background: transparent;
          gap: 2px;
          width: 72px;
          flex-shrink: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s ease;
        }
        .tnav-item:active { transform: scale(0.94); }
        .tnav-item.active {
          background: transparent;
          position: relative;
          isolation: isolate;
        }
        .tnav-item.active::before {
          content: "";
          position: absolute;
          inset: 3px;
          background: #EBEBEB;
          border-radius: 20px;
          z-index: -1;
        }
        .tnav-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
        }
        @media (hover: hover) {
          .tnav-item:not(.active):hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
        }
        .tnav-label {
          font-size: 13px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          letter-spacing: 0.1px;
          line-height: 1.1;
          transition: color 0.25s ease;
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
              >
                <div className="tnav-icon-wrap">
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