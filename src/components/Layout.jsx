import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <>
      {/* Pages scroll naturally — BottomNav is fixed overlay */}
      <div style={{ minHeight: "100dvh", background: "#f5f5f5", paddingBottom: "calc(90px + env(safe-area-inset-bottom))" }}>
        <Outlet />
      </div>
      <BottomNav />
    </>
  );
}