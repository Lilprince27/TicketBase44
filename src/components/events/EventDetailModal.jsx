import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import TicketQuantityModal from "./TicketQuantityModal";

export default function EventDetailModal({ event, onClose, onCustomize }) {
  const [aiData, setAiData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [eventImage, setEventImage] = useState(event.image);
  const [ticketQty, setTicketQty] = useState(null);
  const [showQtyModal, setShowQtyModal] = useState(true);

  useEffect(() => {
    if (!ticketQty) return;
    async function fetchAIData() {
      setLoadingAI(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Search Viagogo (https://www.viagogo.com) for "${event.title}" at "${event.venue || "unknown venue"}" on "${event.date}". 
Find real ticket listings with actual seat data for ${ticketQty} ticket(s).

Return JSON with:
- event_image_url: real accessible image URL for this event/artist
- sections: 4-6 sections from Viagogo. Each section must have at least ${ticketQty} available consecutive seats.
  Each section: { section_name, level, available_seats: [{row, seat, price_aud}] }
  Include at least ${ticketQty * 3} seats per section so user can choose.
- price_range: {min, max} in AUD

IMPORTANT: available_seats must have groups of ${ticketQty} consecutive seats together.`,
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
                properties: { min: { type: "number" }, max: { type: "number" } }
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
  }, [ticketQty]);

  const toggleSeat = (seat, section) => {
    const key = `${section.section_name}-${seat.row}-${seat.seat}`;
    const exists = selectedSeats.find(s => s.key === key);
    if (exists) {
      setSelectedSeats(prev => prev.filter(s => s.key !== key));
    } else {
      if (selectedSeats.length >= ticketQty) {
        // Replace oldest selection
        setSelectedSeats(prev => [...prev.slice(1), { ...seat, section_name: section.section_name, level: section.level, key }]);
      } else {
        setSelectedSeats(prev => [...prev, { ...seat, section_name: section.section_name, level: section.level, key }]);
      }
    }
  };

  const handleCustomize = () => {
    const primary = selectedSeats[0];
    const params = new URLSearchParams({
      event_name: event.title,
      event_date: event.date,
      venue_name: event.venue || "",
    });
    if (primary) {
      params.set("section_bay", primary.section_name);
      params.set("level_stand", primary.level || "");
      params.set("row", primary.row);
      params.set("seat_number", selectedSeats.map(s => s.seat).join(", "));
      params.set("price", `$${primary.price_aud} AUD Inc GST`);
    }
    if (eventImage) params.set("event_image_url", eventImage);
    onCustomize({ ...event, image: eventImage }, params.toString());
  };

  if (showQtyModal) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <TicketQuantityModal
          onSelect={(qty) => { setTicketQty(qty); setShowQtyModal(false); }}
          onClose={() => { onClose(); }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100" style={{ backgroundColor: "#051a24" }}>
        <button onClick={onClose} className="text-white text-2xl font-light bg-transparent border-none cursor-pointer mr-3">‹</button>
        <span className="text-white font-semibold text-base flex-1 truncate">{event.title}</span>
        <span className="text-xs text-blue-300 bg-blue-900/40 px-2 py-1 rounded-full">{ticketQty} ticket{ticketQty > 1 ? "s" : ""}</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Hero image */}
        <div className="w-full h-[220px] bg-cover bg-center bg-gray-200 relative" style={{ backgroundImage: `url(${eventImage})` }}>
          {loadingAI && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-white/90 rounded-xl px-4 py-2 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-gray-700">Fetching seat data from Viagogo...</span>
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

          {/* Ticket quantity badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
            🎟 Looking for {ticketQty} ticket{ticketQty > 1 ? "s" : ""}
            <button onClick={() => { setShowQtyModal(true); setSelectedSeats([]); setAiData(null); }} className="text-blue-400 text-xs underline bg-transparent border-none cursor-pointer">change</button>
          </div>

          {/* Price range */}
          {aiData?.price_range && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-green-700 font-medium">Viagogo Price Range</span>
              <span className="font-bold text-green-800">${aiData.price_range.min} – ${aiData.price_range.max} AUD</span>
            </div>
          )}

          <div className="border-t border-gray-100 mb-4" />

          {/* Seat Selection */}
          <h2 className="text-base font-bold text-gray-800 mb-1">Select Seats</h2>
          <p className="text-xs text-gray-400 mb-3">Tap to select {ticketQty} seat{ticketQty > 1 ? "s" : ""}. Selected: {selectedSeats.length}/{ticketQty}</p>

          {loadingAI ? (
            <div className="space-y-3 mb-5">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
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
                    {section.available_seats?.slice(0, 12).map((seat, idx) => {
                      const key = `${section.section_name}-${seat.row}-${seat.seat}`;
                      const isSelected = selectedSeats.some(s => s.key === key);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleSeat(seat, section)}
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
              No seat data available
            </div>
          )}

          {selectedSeats.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="text-sm font-bold text-blue-800 mb-2">Selected Seats ({selectedSeats.length}/{ticketQty})</div>
              {selectedSeats.map((s, i) => (
                <div key={i} className="flex justify-between text-sm text-blue-700 mb-1">
                  <span>{s.section_name} · Row {s.row} · Seat {s.seat}</span>
                  <span className="font-bold">${s.price_aud} AUD</span>
                </div>
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
          {loadingAI
            ? "Loading seat data..."
            : selectedSeats.length > 0
              ? `🎟 Customize ${selectedSeats.length} Ticket${selectedSeats.length > 1 ? "s" : ""}`
              : "🎟 Customize Ticket"}
        </button>
      </div>
    </div>
  );
}