const FALLBACK_IMG = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop";

export default function EventListItem({ event, onClick }) {
  return (
    <div className="cursor-pointer" onClick={() => onClick(event)}>
      <div className="w-full h-[200px] bg-gray-200 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          onError={e => { e.target.src = FALLBACK_IMG; }}
        />
      </div>
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="text-[15px] font-semibold text-gray-800">{event.title}</div>
        {event.date && (
          <div className="text-xs text-gray-500 mt-0.5">
            {event.date}{event.venue ? ` · ${event.venue}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}