export default function EventHorizontalScroll({ title, events, onSelect }) {
  if (!events.length) return null;

  return (
    <div className="mb-2">
      <h2 className="px-4 pt-5 pb-3 text-lg font-bold text-gray-900">{title}</h2>
      <div
        className="flex gap-3 overflow-x-auto px-4 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        <style>{`.event-hscroll::-webkit-scrollbar { display: none; }`}</style>
        {events.map(e => (
          <div
            key={e.id}
            className="flex-shrink-0 cursor-pointer event-hscroll"
            style={{ width: 145 }}
            onClick={() => onSelect(e)}
          >
            <div className="w-full overflow-hidden rounded-lg bg-gray-200" style={{ height: 190 }}>
              <img
                src={e.image}
                alt={e.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="text-[13px] font-semibold text-gray-800 mt-1.5 leading-tight" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {e.title}
            </p>
            {e.subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{e.subtitle}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}