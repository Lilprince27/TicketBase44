import { useState, useRef, useCallback } from "react";

const THRESHOLD = 72;

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const containerRef = useRef(null);

  const onTouchStart = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    // Only activate when already scrolled to top
    if (window.scrollY > 0) return;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (startY.current === null || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0 && window.scrollY <= 0) {
      setPulling(true);
      setPullY(Math.min(dy * 0.45, THRESHOLD + 20));
    }
  }, [refreshing]);

  const onTouchEnd = useCallback(async () => {
    if (!pulling) return;
    if (pullY >= THRESHOLD) {
      setRefreshing(true);
      setPullY(THRESHOLD);
      await onRefresh();
      setRefreshing(false);
    }
    setPulling(false);
    setPullY(0);
    startY.current = null;
  }, [pulling, pullY, onRefresh]);

  const progress = Math.min(pullY / THRESHOLD, 1);

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ position: "relative" }}
    >
      {/* Indicator */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: pullY || (refreshing ? THRESHOLD : 0),
        overflow: "hidden",
        transition: pulling ? "none" : "height 0.3s ease",
        zIndex: 10,
        pointerEvents: "none",
      }}>
        {(pulling || refreshing) && (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "3px solid #e5e7eb",
            borderTopColor: "#2563eb",
            animation: refreshing ? "spin 0.7s linear infinite" : "none",
            transform: !refreshing ? `rotate(${progress * 270}deg)` : undefined,
            transition: pulling ? "none" : "transform 0.2s",
          }} />
        )}
      </div>
      <div style={{ transform: `translateY(${pullY}px)`, transition: pulling ? "none" : "transform 0.3s ease" }}>
        {children}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}