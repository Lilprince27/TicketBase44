import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <>
      {/* Page content — scrolls freely with the document */}
      <div style={{ paddingBottom: "calc(90px + env(safe-area-inset-bottom))" }}>
        <Outlet />
      </div>
      {/* BottomNav floats on top, never participates in scroll */}
      <BottomNav />
    </>
  );
}