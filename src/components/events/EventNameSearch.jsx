import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop";

/**
 * Search the Ticketek Australia website directly by scraping the
 * search results page.  This finds ALL events listed on Ticketek
 * (the real ticketing partner), not just the subset that happens to
 * also appear on the Ticketmaster Discovery API.
 */
async function searchTicketekWebsite(query) {
  const searchUrl = `https://premier.ticketek.com.au/search/SearchResults.aspx?k=${encodeURIComponent(query)}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(searchUrl)}`;

  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error("fetch failed");
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const events = [];
  const seen = new Set();

  // Find all <a> tags that link to a show page
  const anchors = doc.querySelectorAll('a[href*="shows/show.aspx?sh="]');

  anchors.forEach(a => {
    const href = a.getAttribute("href") || "";
    const m = href.match(/sh=([A-Za-z0-9]+)/);
    if (!m) return;
    const code = m[1];
    if (seen.has(code)) return;

    // Image inside the link (or in the closest container)
    const img = a.querySelector("img");
    let imgUrl = img?.getAttribute("src") || "";
    if (imgUrl && !imgUrl.startsWith("http")) {
      imgUrl = "https://premier.ticketek.com.au" + (imgUrl.startsWith("/") ? "" : "/") + imgUrl;
    }
    const alt = img?.getAttribute("alt") || "";

    // Event name — prefer <strong>, fall back to image alt text
    const strong = a.querySelector("strong");
    let name = strong?.textContent?.trim() || alt.replace(/\s*thumbnail\s*/i, "").trim();
    if (!name || name.length < 2) return;
    seen.add(code);

    // Full link text for date / venue extraction
    const text = a.textContent.replace(/\s+/g, " ").trim();

    // Date patterns: "Mon 5 Oct 2026 6:00pm" or "Mon 05 Oct 2026 to Tue 06 Oct 2026"
    const dateMatch = text.match(/(\w{3}\s+\d{1,2}\s+\w{3}\s+\d{4}(?:\s+to\s+\w{3}\s+\d{1,2}\s+\w{3}\s+\d{4})?(?:\s+\d{1,2}:\d{2}[ap]m)?)/i);
    const dateStr = dateMatch ? dateMatch[1].trim() : "";

    // Venue: "Rod Laver Arena • Melbourne • VIC"  OR  "Rod Laver Arena, Melbourne, VIC"
    const bulletVenue = text.match(/([^•]+•[^•]+•[^•]+)/);
    let venueStr = bulletVenue ? bulletVenue[1].trim() : "";
    if (!venueStr) {
      const commaVenue = text.match(/([A-Z][^,]+,\s*[^,]+,\s*(?:VIC|NSW|QLD|SA|WA|ACT|TAS|NT))/);
      if (commaVenue) venueStr = commaVenue[1].trim();
    }

    events.push({
      id: code,
      title: name,
      date: dateStr,
      venue: venueStr,
      image: imgUrl || FALLBACK_IMG,
    });
  });

  return events;
}

/**
 * Fallback: use the LLM with web search to find Ticketek events.
 * This kicks in if the CORS proxy is blocked or returns nothing.
 */
async function searchWithLLM(query) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Search the Ticketek Australia website (ticketek.com.au) for events matching "${query}". Return ONLY upcoming events (dates from July 2026 onwards — do NOT include past events). For each event provide the event name, date, venue name, and city. If you can find an image URL from the Ticketek website, include it.`,
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

  const events = result?.events || [];
  return events.map((e, i) => ({
    id: `llm_${i}`,
    title: e.event_name || "",
    date: e.date || "",
    venue: [e.venue_name, e.city].filter(Boolean).join(", "),
    image: e.image_url || FALLBACK_IMG,
  }));
}

/** Filter out events whose date is clearly in the past. */
function isUpcoming(dateStr) {
  if (!dateStr) return true;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed)) {
    return parsed >= new Date("2026-07-13");
  }
  const yearMatch = dateStr.match(/20(\d{2})/);
  if (yearMatch) {
    return 2000 + parseInt(yearMatch[1]) >= 2026;
  }
  return true;
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
      // Try scraping the Ticketek website first (fast, free)
      let events = [];
      try {
        events = await searchTicketekWebsite(q);
      } catch {
        // CORS proxy failed — fall through to LLM
      }
      // If the website scrape returned nothing, use LLM with web search
      if (events.length === 0) {
        events = await searchWithLLM(q);
      }
      // Remove past events
      events = events.filter(e => isUpcoming(e.date));
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