import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <>
      {/* Page content — no overflow restrictions, natural document scroll */}
      <Outlet />
      {/* BottomNav is fixed, never clips scroll */}
      <BottomNav />
    </>
  );
}