export default function EventDetailModal({ event, onClose, onCustomize }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100" style={{ backgroundColor: "#051a24" }}>
        <button onClick={onClose} className="text-white text-2xl font-light bg-transparent border-none cursor-pointer mr-3">‹</button>
        <span className="text-white font-semibold text-base flex-1 truncate">{event.title}</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Hero image */}
        <div
          className="w-full h-[220px] bg-cover bg-center bg-gray-200"
          style={{ backgroundImage: `url(${event.image})` }}
        />

        <div className="px-5 py-5">
          {/* Event title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{event.title}</h1>

          {/* Date & Venue */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{event.date}</span>
          </div>

          {event.venue && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{event.venue}</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 mb-4" />

          {/* Seat info section */}
          <h2 className="text-base font-bold text-gray-800 mb-3">Seating Information</h2>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Section", value: "-" },
              { label: "Row", value: "-" },
              { label: "Seat", value: "-" },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-400 uppercase mb-1">{item.label}</div>
                <div className="font-bold text-gray-700">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Category / labels */}
          {(event.category || event.labels?.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.category && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">{event.category}</span>
              )}
              {event.labels?.slice(0, 3).map(l => (
                <span key={l} className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 capitalize">{l}</span>
              ))}
            </div>
          )}

          {/* Description */}
          {event.description && (
            <>
              <div className="border-t border-gray-100 mb-4" />
              <h2 className="text-base font-bold text-gray-800 mb-2">About</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
            </>
          )}
        </div>
      </div>

      {/* Sticky bottom button */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white border-t border-gray-100">
        <button
          onClick={() => onCustomize(event)}
          className="w-full py-4 rounded-xl text-white font-bold text-base border-none cursor-pointer"
          style={{ backgroundColor: "#003057" }}
        >
          🎟 Customize Ticket
        </button>
      </div>
    </div>
  );
}