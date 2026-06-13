import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import PageTransition from "./PageTransition";

export default function Layout() {
  return (
    <>
      <PageTransition>
        <Outlet />
      </PageTransition>
      <BottomNav />
    </>
  );
}