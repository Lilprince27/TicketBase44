import { useLocation, Link } from "react-router-dom";

const navItems = [
  {
    id: "events",
    label: "Events",
    path: "/",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
        <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7z" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    path: "/account",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    icon: (
      <div style={{ transform: "rotate(-45deg)" }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M22 10V6H2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4h20v-4c-1.1 0-2-.9-2-2s.9-2 2-2z"/>
        </svg>
      </div>
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
    <nav className="fixed bottom-0 left-0 w-full bg-white flex justify-around items-center z-50 shadow-[0_-1px_5px_rgba(0,0,0,0.1)]" style={{ paddingTop: 6, paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}>
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className={`flex flex-col items-center flex-1 py-2 text-[13px] font-bold transition-colors duration-200 no-underline ${
            isActive(item.path) ? "text-blue-500" : "text-gray-400"
          }`}
        >
          {item.icon}
          <span className="mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}