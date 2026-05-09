import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function EventDetailModal({ event, onClose, onCustomize }) {
  const [aiData, setAiData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [eventImage, setEventImage] = useState(event.image);

  useEffect(() => {
    async function fetchAIData() {
      setLoadingAI(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a ticket data assistant. Search viagogo.com and similar resale ticket sites for the event "${event.title}" at "${event.venue || "unknown venue"}" on "${event.date}".

Search specifically on https://www.viagogo.com for listings of this event. Return real ticket data with actual prices found.

Return a JSON object with:
- event_image_url: a real publicly accessible image URL for this event or artist (from the official artist site, Wikipedia, or viagogo listing)
- sections: array of 4-6 seating sections found on viagogo, each with: { section_name, level, available_seats: [{ row, seat, price_aud }] }
- price_range: { min, max } in AUD based on real viagogo listings

Use actual section names and real prices from viagogo listings. If the event is not found on viagogo, use realistic data based on the venue layout.`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              event_image_url: { type: "string" },
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    section_name: { type: "string" },
                    level: { type: "string" },
                    available_seats: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          row: { type: "string" },
                          seat: { type: "string" },
                          price_aud: { type: "number" }
                        }
                      }
                    }
                  }
                }
              },
              price_range: {
                type: "object",
                properties: {
                  min: { type: "number" },
                  max: { type: "number" }
                }
              }
            }
          }
        });
        setAiData(result);
        if (result.event_image_url) setEventImage(result.event_image_url);
      } catch (e) {
        setAiData(null);
      }
      setLoadingAI(false);
    }
    fetchAIData();
  }, [event.title, event.venue]);

  const handleCustomize = () => {
    const params = new URLSearchParams({
      event_name: event.title,
      event_date: event.date,
      venue_name: event.venue || "",
    });
    if (selectedSeat) {
      params.set("section_bay", selectedSeat.section_name);
      params.set("level_stand", selectedSeat.level);
      params.set("row", selectedSeat.row);
      params.set("seat_number", selectedSeat.seat);
      params.set("price", `$${selectedSeat.price_aud} AUD Inc GST`);
    }
    if (eventImage) params.set("event_image_url", eventImage);
    onCustomize({ ...event, image: eventImage }, params.toString());
  };

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
          className="w-full h-[220px] bg-cover bg-center bg-gray-200 relative"
          style={{ backgroundImage: `url(${eventImage})` }}
        >
          {loadingAI && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-white/90 rounded-xl px-4 py-2 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-gray-700">Fetching event data...</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{event.title}</h1>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
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

          {/* Price range */}
          {aiData?.price_range && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-green-700 font-medium">Ticket Price Range</span>
              <span className="font-bold text-green-800">${aiData.price_range.min} – ${aiData.price_range.max} AUD</span>
            </div>
          )}

          <div className="border-t border-gray-100 mb-4" />

          {/* Seat Selection */}
          <h2 className="text-base font-bold text-gray-800 mb-3">Select Your Seat</h2>

          {loadingAI ? (
            <div className="space-y-3 mb-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : aiData?.sections?.length > 0 ? (
            <div className="space-y-3 mb-5">
              {aiData.sections.map((section, si) => (
                <div key={si} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-800 text-sm">{section.section_name}</span>
                      {section.level && <span className="text-xs text-gray-400 ml-2">{section.level}</span>}
                    </div>
                    <span className="text-xs text-gray-500">{section.available_seats?.length} available</span>
                  </div>
                  <div className="p-3 flex flex-wrap gap-2">
                    {section.available_seats?.slice(0, 8).map((seat, idx) => {
                      const isSelected = selectedSeat?.section_name === section.section_name &&
                        selectedSeat?.row === seat.row && selectedSeat?.seat === seat.seat;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedSeat(isSelected ? null : { ...seat, section_name: section.section_name, level: section.level })}
                          className="flex flex-col items-center px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all"
                          style={{
                            backgroundColor: isSelected ? "#003057" : "white",
                            color: isSelected ? "white" : "#374151",
                            borderColor: isSelected ? "#003057" : "#e5e7eb"
                          }}
                        >
                          <span>R{seat.row} S{seat.seat}</span>
                          <span className="font-bold mt-0.5">${seat.price_aud}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-400 mb-5">
              No seat data available for this event
            </div>
          )}

          {selectedSeat && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="text-sm font-bold text-blue-800 mb-1">Selected Seat</div>
              <div className="flex justify-between text-sm text-blue-700">
                <span>{selectedSeat.section_name} · Row {selectedSeat.row} · Seat {selectedSeat.seat}</span>
                <span className="font-bold">${selectedSeat.price_aud} AUD</span>
              </div>
            </div>
          )}

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
          onClick={handleCustomize}
          disabled={loadingAI}
          className="w-full py-4 rounded-xl text-white font-bold text-base border-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#003057" }}
        >
          {loadingAI ? "Loading event data..." : selectedSeat ? `🎟 Customize Ticket · $${selectedSeat.price_aud} AUD` : "🎟 Customize Ticket"}
        </button>
      </div>
    </div>
  );
}