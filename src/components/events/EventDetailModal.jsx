import { useState } from "react";

export default function EventDetailModal({ event, onClose, onCustomize }) {
  const [confirmed, setConfirmed] = useState(false);

  const handleYes = () => {
    const params = new URLSearchParams({
      event_name: event.title || "",
      event_date: event.date || "",
      venue_name: event.venue || "",
    });
    if (event.image) params.set("event_image_url", event.image);
    onCustomize(event, params.toString());
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-2xl overflow-hidden"
        style={{ maxWidth: 500 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Event image */}
        {event.image && (
          <div className="w-full h-[180px] overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h2>
          {event.date && <p className="text-sm text-gray-500 mb-0.5">{event.date}</p>}
          {event.venue && <p className="text-sm text-gray-400 mb-5">{event.venue}</p>}

          <p className="text-base font-semibold text-gray-800 mb-4">Do you want to customize this ticket?</p>

          <div className="flex gap-3" style={{ marginBottom: "calc(24px + env(safe-area-inset-bottom))" }}>
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm cursor-pointer bg-white"
            >
              No, cancel
            </button>
            <button
              onClick={handleYes}
              className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm cursor-pointer border-none"
              style={{ backgroundColor: "#003057" }}
            >
              Yes, customize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}