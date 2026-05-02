import { useLocation, Link } from "react-router-dom";

const navItems = [
  {
    id: "events",
    label: "Events",
    path: "/",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    path: "/account",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ transform: "rotate(-30deg)" }}>
        <path d="M22 10V6H4v4c1.1 0 2 .9 2 2s-.9 2-2 2v4h18v-4c-1.1 0-2-.9-2-2s.9-2 2-2z"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

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
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.id}
            to={item.path}
            className="flex flex-col items-center justify-center no-underline"
            style={{
              padding: "10px 24px",
              borderRadius: "100px",
              background: active ? "#f2f2f2" : "transparent",
              color: active ? "#2d66f7" : "#000000",
              transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
              minWidth: 72,
            }}
          >
            {item.icon}
            <span style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}