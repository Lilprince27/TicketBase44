import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";

const TM_API_KEY = "ysl6MCmD7CZKfSZtD9MGlKh8rGG4mNgO";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) +
    (d.getHours() || d.getMinutes() ? ` ${d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" })}` : "");
}

export default function EventNameSearch({ onSelect, onClear, currentValue }) {
  const [query, setQuery] = useState(currentValue || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Keep external value in sync if changed elsewhere
  useEffect(() => {
    if (currentValue !== undefined && currentValue !== query) {
      setQuery(currentValue);
    }
  }, [currentValue]);

  // Close dropdown on outside click
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
      const params = new URLSearchParams({
        apikey: TM_API_KEY,
        size: "10",
        countryCode: "AU",
        sort: "relevance,desc",
        keyword: q.trim(),
      });
      const [res1, res2] = await Promise.all([
        fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`).catch(() => null),
        fetch(`https://app.ticketmaster.com/discovery-international/v2/events.json?${params.toString()}`).catch(() => null),
      ]);
      const [data1, data2] = await Promise.all([
        res1 ? res1.json().catch(() => null) : null,
        res2 ? res2.json().catch(() => null) : null,
      ]);
      const list1 = data1?._embedded?.events || [];
      const list2 = data2?._embedded?.events || [];
      const seen = new Set();
      const merged = [...list1, ...list2].filter(e => {
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });
      const mapped = merged.map(e => {
        const venue = e._embedded?.venues?.[0];
        const img = e.images?.find(i => i.ratio === "16_9" && i.width > 500)?.url || e.images?.[0]?.url || FALLBACK_IMG;
        return {
          id: e.id,
          title: e.name,
          date: formatDate(e.dates?.start?.dateTime || e.dates?.start?.localDate),
          venue: venue ? venue.name : "",
          city: venue?.city?.name || "",
          image: img,
          raw: e,
        };
      });
      setResults(mapped);
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

      {/* Search results dropdown */}
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
                  {event.venue && <p className="text-xs text-gray-400 truncate">{event.venue}{event.city ? `, ${event.city}` : ""}</p>}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}