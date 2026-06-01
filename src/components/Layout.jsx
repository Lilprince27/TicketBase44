import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]" style={{ paddingBottom: 80 }}>
      <Outlet />
      <BottomNav />
    </div>
  );
}