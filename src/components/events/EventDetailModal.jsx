import { useState, useMemo } from "react";
import { getLocalOverride } from "./localEventOverrides";

export default function EventDetailModal({ event, onClose, onCustomize }) {
  const tourDates = useMemo(() => {
    if (event?.raw?.local || event?.local) return [];
    const matches = getLocalOverride(event?.title || "") || [];
    return matches.length > 1 ? matches : [];
  }, [event]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeOption = tourDates[selectedIdx] || null;

  const displayDate = activeOption?.date || event.date || "";
  const displayVenue = activeOption
    ? `${activeOption.venue}${activeOption.city ? `, ${activeOption.city}` : ""}`
    : event.venue || "";

  const handleYes = () => {
    const ld = activeOption?.localData;
    const params = new URLSearchParams({
      event_name: ld?.event_name || event.title || "",
      event_date: ld?.event_date || displayDate,
      venue_name: ld?.venue_name || displayVenue,
    });
    if (ld?.presenter) params.set("presenter", ld.presenter);
    const img = ld?.event_image_url || event.image;
    if (img) params.set("event_image_url", img);
    onCustomize(event, params.toString());
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-2xl overflow-hidden"
        style={{ maxWidth: 500, maxHeight: "88vh", display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Event image */}
        {event.image && (
          <div className="w-full h-[180px] overflow-hidden flex-shrink-0">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="px-6 py-5 overflow-y-auto">
          {event.subtitle && <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">{event.subtitle}</p>}
          <h2 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h2>
          {displayDate && <p className="text-sm font-medium text-gray-700 mb-0.5">{displayDate}</p>}
          {displayVenue && <p className="text-sm text-gray-500 mb-4">{displayVenue}</p>}

          {tourDates.length > 1 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Date & Venue ({tourDates.length} shows)</p>
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                {tourDates.map((td, idx) => {
                  const selected = idx === selectedIdx;
                  const fullVenue = `${td.venue}${td.city ? `, ${td.city}` : ""}`;
                  return (
                    <button
                      key={td.id || idx}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      className="w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-colors cursor-pointer"
                      style={{
                        borderColor: selected ? "#003057" : "#e5e7eb",
                        backgroundColor: selected ? "#f0f6ff" : "#ffffff",
                      }}
                    >
                      <div className="font-bold text-gray-900">{td.date}</div>
                      <div className="text-gray-500 mt-0.5">{fullVenue}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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