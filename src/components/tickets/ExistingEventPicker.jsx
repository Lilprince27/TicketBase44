import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function ExistingEventPicker({ userEmail, onSelect, onClose }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const tickets = await base44.entities.Ticket.filter({ owner_email: userEmail }, "-updated_date", 200);
        // Group by event_name + venue_name to build unique event list
        const map = new Map();
        for (const t of tickets) {
          const key = `${t.event_name}__${t.venue_name}`;
          if (!map.has(key) && t.event_name) {
            map.set(key, {
              event_name: t.event_name,
              venue_name: t.venue_name,
              event_date: t.event_date,
              presenter: t.presenter,
              event_image: t.event_image,
              entry_gate: t.entry_gate,
              level_stand: t.level_stand,
              door_area: t.door_area,
              section_bay: t.section_bay,
              ticket_type: t.ticket_type,
              price: t.price,
              order_number: t.order_number,
              ticketCount: 1,
            });
          } else if (map.has(key)) {
            map.get(key).ticketCount++;
          }
        }
        setEvents(Array.from(map.values()));
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, [userEmail]);

  const filtered = events.filter(e =>
    !search ||
    e.event_name.toLowerCase().includes(search.toLowerCase()) ||
    (e.venue_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="bg-white w-full rounded-t-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900">Add to Existing Event</h3>
            <button onClick={onClose} className="text-gray-400 text-xl border-none bg-transparent cursor-pointer">✕</button>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your events..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            {events.length === 0 ? "No existing events yet. Create a ticket first." : "No events match your search."}
          </div>
        ) : (
          filtered.map((evt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(evt)}
              className="w-full flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 text-left cursor-pointer bg-white hover:bg-gray-50"
            >
              {evt.event_image ? (
                <img src={evt.event_image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{evt.event_name}</p>
                <p className="text-xs text-gray-500 truncate">{evt.venue_name}</p>
                <p className="text-xs text-gray-400 truncate">{evt.event_date}</p>
              </div>
              <span className="text-xs font-medium text-gray-400 flex-shrink-0">{evt.ticketCount} ticket{evt.ticketCount !== 1 ? "s" : ""}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}