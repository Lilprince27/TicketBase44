import { useRef, useState, useEffect } from "react";

const THRESHOLD = 70;
const RESISTANCE = 0.5;
const MAX_PULL = 120;

/**
 * Native-like pull-to-refresh for body-scrolled pages.
 * Renders a fixed top indicator; does not wrap children in a transform
 * container so fixed-position modals inside the page keep working.
 */
export default function PullToRefresh({ onRefresh, children }) {
  const [pullDist, setPullDist] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [snapping, setSnapping] = useState(false);

  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const pullDistRef = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => { onRefreshRef.current = onRefresh; }, [onRefresh]);

  useEffect(() => {
    const apply = (v) => { pullDistRef.current = v; setPullDist(v); };

    const onTouchStart = (e) => {
      if (refreshingRef.current) return;
      if (window.scrollY <= 0) {
        startYRef.current = e.touches[0].clientY;
        pullingRef.current = true;
        setSnapping(false);
      } else {
        pullingRef.current = false;
      }
    };

    const onTouchMove = (e) => {
      if (!pullingRef.current || refreshingRef.current) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta <= 0) { apply(0); return; }
      e.preventDefault();
      apply(Math.min(delta * RESISTANCE, MAX_PULL));
    };

    const finish = async () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      setSnapping(true);
      if (pullDistRef.current >= THRESHOLD) {
        refreshingRef.current = true;
        setRefreshing(true);
        apply(THRESHOLD);
        try { await onRefreshRef.current(); } catch {}
        refreshingRef.current = false;
        setRefreshing(false);
      }
      apply(0);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", finish, { passive: true });
    document.addEventListener("touchcancel", finish, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", finish);
      document.removeEventListener("touchcancel", finish);
    };
  }, []);

  const progress = Math.min(pullDist / THRESHOLD, 1);

  return (
    <>
      <style>{`@keyframes ptr-spin { to { transform: rotate(360deg); } }`}</style>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: pullDist,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 60,
          overflow: "hidden",
          transition: snapping ? "height 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: refreshing ? "3px solid rgba(255,255,255,0.25)" : "2.5px solid rgba(255,255,255,0.25)",
            borderTopColor: "#ffffff",
            marginBottom: 8,
            opacity: pullDist > 0 || refreshing ? 1 : 0,
            transform: refreshing ? undefined : `rotate(${progress * 270}deg)`,
            animation: refreshing ? "ptr-spin 0.7s linear infinite" : "none",
          }}
        />
      </div>
      {children}
    </>
  );
}