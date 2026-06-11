import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", background: "#f5f5f5" }}>
      {/* Scrollable content area — sits above the fixed nav */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", paddingBottom: "calc(90px + env(safe-area-inset-bottom))" }}>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}