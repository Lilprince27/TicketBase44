import { useState, useEffect, useRef } from "react";

export default function EventHeroCarousel({ events, onSelect }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);

  const goTo = (idx) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const next = () => setCurrent(c => (c + 1) % events.length);
  const prev = () => setCurrent(c => (c - 1 + events.length) % events.length);

  useEffect(() => {
    if (events.length <= 1) return;
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, [events.length]);

  if (!events.length) return null;

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-900"
      style={{ height: 220 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {events.map((e, idx) => (
        <div
          key={e.id}
          className="absolute inset-0 transition-opacity duration-500 cursor-pointer"
          style={{ opacity: idx === current ? 1 : 0, pointerEvents: idx === current ? "auto" : "none" }}
          onClick={() => onSelect(e)}
        >
          <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {e.subtitle && <p className="text-white text-xs font-semibold uppercase tracking-wide opacity-80 mb-0.5">{e.subtitle}</p>}
            <h2 className="text-white font-bold text-lg leading-tight">{e.title}</h2>
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-3 right-4 flex gap-1.5 z-20">
        {events.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); goTo(idx); }}
            className="rounded-full transition-all border-none cursor-pointer"
            style={{
              width: idx === current ? 20 : 6,
              height: 6,
              background: idx === current ? "#ffffff" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}