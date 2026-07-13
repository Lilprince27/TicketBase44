import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop";

/**
 * Single LLM call with web search — finds events on Ticketek's website.
 * No CORS proxy scraping, no show-page fetching. Fast and reliable.
 */
async function searchTicketekEvents(query) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Search the Ticketek Australia website (premier.ticketek.com.au) for events matching "${query}". Return ALL upcoming events you can find. For each event provide: event_name, date (e.g. "Fri 9 Oct 2026"), venue_name, city, and image_url if you can find one from the Ticketek website (images are hosted on d35kvm5iuwjt9t.cloudfront.net/dbimages/). Return each unique show once.`,
    add_context_from_internet: true,
    model: "gemini_3_flash",
    response_json_schema: {
      type: "object",
      properties: {
        events: {
          type: "array",
          items: {
            type: "object",
            properties: {
              event_name: { type: "string" },
              date: { type: "string" },
              venue_name: { type: "string" },
              city: { type: "string" },
              image_url: { type: "string" },
            },
          },
        },
      },
    },
  });

  return (result?.events || []).map((e, i) => ({
    id: `ev_${i}`,
    title: e.event_name || "",
    date: e.date || "",
    venue: [e.venue_name, e.city].filter(Boolean).join(", "),
    image: e.image_url || FALLBACK_IMG,
  }));
}

export default function EventNameSearch({ onSelect, onClear, currentValue }) {
  const [query, setQuery] = useState(currentValue || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (currentValue !== undefined && currentValue !== query) {
      setQuery(currentValue);
    }
  }, [currentValue]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchEvents = async (q) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setShowResults(true);
    try {
      const events = await searchTicketekEvents(q);
      setResults(events);
    } catch {
      setResults([]);
    }
    setLoading(false);
    setSearched(true);
  };

  const handleChange = (val) => {
    setQuery(val);
    onClear?.();
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchEvents(val), 400);
  };

  const handleSelect = (event) => {
    setQuery(event.title);
    setShowResults(false);
    onSelect?.({
      event_name: event.title,
      event_date: event.date,
      venue_name: event.venue,
      event_image_url: event.image,
    });
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setShowResults(false);
    onClear?.();
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-lg bg-white gap-2" style={{ borderColor: showResults ? "#3b82f6" : undefined }}>
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { if (results.length > 0) setShowResults(true); }}
          placeholder="Search event name to auto-fill"
          className="flex-1 bg-transparent border-none text-sm outline-none text-gray-800 placeholder-gray-400"
        />
        {loading && <Loader2 size={16} className="animate-spin text-gray-400 flex-shrink-0" />}
        {query && !loading && (
          <button onClick={clearSearch} className="flex-shrink-0 border-none bg-transparent cursor-pointer p-0">
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 top-full z-50 bg-white rounded-lg border border-gray-200 shadow-lg mt-1 max-h-[320px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-gray-400" />
            </div>
          ) : results.length === 0 ? (
            searched ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No events found. Try a different name or fill in manually.
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                Type at least 2 characters to search
              </div>
            )
          ) : (
            results.map(event => (
              <button
                key={event.id}
                onClick={() => handleSelect(event)}
                className="w-full flex items-center gap-3 px-3 py-2.5 border-b border-gray-100 last:border-b-0 text-left cursor-pointer bg-white hover:bg-gray-50 transition-colors"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                  onError={e => { e.target.src = FALLBACK_IMG; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{event.title}</p>
                  {event.date && <p className="text-xs text-gray-500 mt-0.5 truncate">{event.date}</p>}
                  {event.venue && <p className="text-xs text-gray-400 truncate">{event.venue}</p>}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}