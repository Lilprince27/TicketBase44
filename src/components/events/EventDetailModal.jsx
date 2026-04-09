export default function EventDetailModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      {/* Nav bar */}
      <header className="flex items-center px-4 py-4 border-b border-gray-200 bg-white">
        <button onClick={onClose} className="text-gray-600 text-base font-medium mr-4">✕</button>
        <h1 className="text-base font-semibold text-gray-800 truncate flex-1">{event.title}</h1>
      </header>

      {/* Scroll area */}
      <main className="flex-1 overflow-y-auto bg-[#f2f2f2] p-4 pb-20">
        {/* Hero card */}
        <section className="bg-white rounded-lg overflow-hidden shadow-sm mb-5">
          <div className="relative">
            <img src={event.image} alt={event.title} className="w-full h-56 object-cover" />
          </div>
          <div className="p-4 text-sm text-gray-600 leading-relaxed">
            <p>{event.description}</p>
          </div>
        </section>

        {/* Event card */}
        <article className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="relative">
            <img src={event.image} alt={event.title} className="w-full h-44 object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold text-center px-4 drop-shadow-lg uppercase">{event.title}</span>
            </div>
          </div>
          <div className="p-5">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h2>
            {event.date && <p className="text-sm text-gray-500 mb-1">{event.date}</p>}
            {event.venue && <p className="text-sm text-gray-500 mb-4">{event.venue}</p>}
            <button
              className="w-full py-4 rounded-md text-white font-bold text-base border-none cursor-pointer"
              style={{ backgroundColor: "#d84315" }}
            >
              Find Tickets
            </button>
          </div>
        </article>
      </main>

      {/* Consent tab */}
      <div className="absolute bottom-5 left-0 bg-[#001c2d] text-white text-xs px-3 py-2 rounded-r">
        Consent Choices
      </div>
    </div>
  );
}