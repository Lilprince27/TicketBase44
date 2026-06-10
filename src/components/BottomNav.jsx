import { useLocation, Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const isAndroid = () => /android/i.test(navigator.userAgent);

const navItems = [
  {
    id: "events",
    label: "Events",
    path: "/",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? "#2d66f7" : "none"} stroke={active ? "none" : "#111"} strokeWidth="1.8">
        <path d="M3 10L12 3L21 10V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10Z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    path: "/account",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? "#2d66f7" : "#111"}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? "#2d66f7" : "#111"} style={{ transform: "rotate(-30deg)" }}>
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
  const [pressedId, setPressedId] = useState(null);
  const [ripples, setRipples] = useState({});

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

  const handlePress = (id) => {
    setPressedId(id);
    setRipples(prev => ({ ...prev, [id]: Date.now() }));
    setTimeout(() => setPressedId(null), 300);
  };

  const android = isAndroid();

  if (android) {
    return (
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: "#f0f4ff", borderTop: "1px solid rgba(0,0,0,0.08)",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        height: 64, paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          const handleClick = item.id === "account" ? handleAccountTap : undefined;
          return (
            <Link key={item.id} to={item.path} onClick={handleClick}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textDecoration: "none", color: active ? "#2d66f7" : "#555", gap: 3, paddingTop: 8 }}>
              <div style={{ width: 64, height: 32, borderRadius: 16, backgroundColor: active ? "rgba(45,102,247,0.12)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
                {item.icon(active)}
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.2 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // iOS 26 Liquid Glass / Watery nav
  return (
    <>
      <style>{`
        @keyframes liquidRipple {
          0% { transform: scale(0.6); opacity: 0.5; }
          60% { transform: scale(1.15); opacity: 0.15; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes glassShimmer {
          0% { opacity: 0.4; transform: translateX(-60%) skewX(-15deg); }
          100% { opacity: 0; transform: translateX(160%) skewX(-15deg); }
        }
        .ios-nav-pill {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, sans-serif;
        }
        .ios-nav-bg {
          background: rgba(242, 242, 247, 0.72);
          backdrop-filter: blur(28px) saturate(1.8) brightness(1.05);
          -webkit-backdrop-filter: blur(28px) saturate(1.8) brightness(1.05);
          border-radius: 100px;
          padding: 7px;
          box-shadow:
            0 2px 24px rgba(0,0,0,0.13),
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 -1px 0 rgba(0,0,0,0.06) inset;
          border: 1px solid rgba(255,255,255,0.55);
          display: flex;
          gap: 4px;
          position: relative;
          overflow: hidden;
        }
        .ios-nav-bg::before {
          content: '';
          position: absolute;
          top: 0; left: -60%; width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: glassShimmer 3.5s ease-in-out infinite;
          pointer-events: none;
        }
        .ios-nav-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 9px 22px 7px;
          border-radius: 90px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.22s ease;
          min-width: 68px;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          user-select: none;
        }
        .ios-nav-item.active {
          background: rgba(228, 228, 235, 0.85);
          box-shadow:
            0 2px 10px rgba(0,0,0,0.07),
            0 1px 0 rgba(255,255,255,0.85) inset;
        }
        .ios-nav-item:not(.active):hover {
          background: rgba(0,0,0,0.04);
        }
        .ios-nav-item:active, .ios-nav-item.pressed {
          transform: scale(0.88);
        }
        .ios-nav-ripple {
          position: absolute;
          top: 50%; left: 50%;
          width: 80px; height: 80px;
          border-radius: 50%;
          margin-top: -40px; margin-left: -40px;
          background: radial-gradient(circle, rgba(45,102,247,0.25) 0%, transparent 70%);
          animation: liquidRipple 0.45s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
          pointer-events: none;
        }
        .ios-nav-label {
          font-size: 11px;
          font-weight: 600;
          margin-top: 3px;
          letter-spacing: 0.1px;
          transition: color 0.2s;
        }
      `}</style>
      <nav
        className="ios-nav-pill"
        style={{ bottom: `calc(18px + env(safe-area-inset-bottom))` }}
      >
        <div className="ios-nav-bg">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const pressed = pressedId === item.id;
            const handleClick = item.id === "account" ? handleAccountTap : undefined;
            const rippleKey = ripples[item.id];

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={(e) => {
                  handlePress(item.id);
                  if (handleClick) handleClick(e);
                }}
                onTouchStart={() => handlePress(item.id)}
                className={`ios-nav-item${active ? " active" : ""}${pressed ? " pressed" : ""}`}
                style={{ color: active ? "#2d66f7" : "#1c1c1e" }}
              >
                {/* Water ripple on tap */}
                {rippleKey && (
                  <span key={rippleKey} className="ios-nav-ripple" />
                )}
                {item.icon(active)}
                <span className="ios-nav-label" style={{ color: active ? "#2d66f7" : "#3c3c43" }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}