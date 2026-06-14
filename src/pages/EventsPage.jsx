import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import EventDetailModal from "../components/events/EventDetailModal";
import PullToRefresh from "../components/PullToRefresh";

const TM_API_KEY = "ysl6MCmD7CZKfSZtD9MGlKh8rGG4mNgO";

// Curated real Ticketek events — updated to match current Ticketek AU homepage
const CURATED_EVENTS = [
  { id: "c3", title: "Secret Screenings with Beau Miles", date: "Nov 2026", venue: "Various venues, Australia", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=400&fit=crop" },
  { id: "c4", title: "Jay Shetty LIVE: This Changes Everything", date: "Nov 2026", venue: "Melbourne, Sydney, Brisbane", image: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/a92324834_IMG_2770.png" },
  { id: "charlie", title: "Charlie Puth", date: "2026", venue: "Various venues, Australia", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop" },
  { id: "c1", title: "The Original Wailers featuring Al Anderson", date: "Multiple dates", venue: "Various venues, Australia", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop" },
  { id: "c2", title: "Air Supply", date: "2026", venue: "Various venues, Australia", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=400&fit=crop" },
  { id: "c5", title: "Joji", date: "2026", venue: "Qudos Bank Arena, Sydney", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop" },
  { id: "c6", title: "Khalid – It's Always Summer Somewhere World Tour with Lauv", date: "2026", venue: "Rod Laver Arena, Melbourne", image: "https://images.unsplash.com/photo-1501386761578-eaa54b9e9295?w=800&h=400&fit=crop" },
  { id: "c7", title: "AIDA – The Spectacular Musical", date: "2026", venue: "Sydney Opera House", image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=400&fit=crop" },
  { id: "c8", title: "Nick Cave & The Bad Seeds", date: "Oct 2026", venue: "Adelaide Entertainment Centre", image: "https://images.unsplash.com/photo-1598387993441-a364f854cfac?w=800&h=400&fit=crop" },
  { id: "c9", title: "Coldplay – Music of the Spheres World Tour", date: "Nov 2026", venue: "Marvel Stadium, Melbourne", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop" },
  { id: "c10", title: "Ed Sheeran – Mathematics Tour", date: "Nov 2026", venue: "Accor Stadium, Sydney", image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=400&fit=crop" },
  { id: "c11", title: "Taylor Swift – The Eras Tour", date: "Feb 2027", venue: "Optus Stadium, Perth", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop" },
  { id: "c12", title: "AFL Grand Final 2026", date: "Sep 2026", venue: "MCG, Melbourne", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop" },
];

const CATEGORIES = [
  { label: "Featured", value: "" },
  { label: "Nearby", value: "" },
  { label: "This Week", value: "" },
];

const PLACEHOLDER_IMGS = {
  concerts: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=300&fit=crop",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=300&fit=crop",
  festivals: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=300&fit=crop",
  default: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop",
};

function getPlaceholder(categories = []) {
  for (const c of categories) {
    if (PLACEHOLDER_IMGS[c]) return PLACEHOLDER_IMGS[c];
  }
  return PLACEHOLDER_IMGS.default;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}


export default function EventsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const debounceTimer = useRef(null);
  const loaderRef = useRef(null);


  const fetchEvents = useCallback(async (query, category, currentOffset, replace = false) => {
    if (replace) setLoading(true);
    else setLoadingMore(true);

    // Fetch from both Ticketmaster endpoints simultaneously
    const baseParams = new URLSearchParams({ apikey: TM_API_KEY, size: "15", page: String(Math.floor(currentOffset / 15)), countryCode: "AU", sort: "relevance,desc" });
    if (query) baseParams.set("keyword", query);

    const [res1, res2] = await Promise.all([
      fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${baseParams.toString()}`).catch(() => null),
      fetch(`https://app.ticketmaster.com/discovery-international/v2/events.json?${baseParams.toString()}`).catch(() => null),
    ]);

    const [data1, data2] = await Promise.all([
      res1 ? res1.json().catch(() => null) : null,
      res2 ? res2.json().catch(() => null) : null,
    ]);

    const list1 = data1?._embedded?.events || [];
    const list2 = data2?._embedded?.events || [];

    // Merge and deduplicate by id
    const seen = new Set();
    const merged = [...list1, ...list2].filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true; });

    const mapped = merged.map(e => {
      const img = e.images?.find(i => i.ratio === "16_9" && i.width > 500)?.url || e.images?.[0]?.url || getPlaceholder([]);
      const venue = e._embedded?.venues?.[0];
      return {
        id: e.id,
        title: e.name,
        date: formatDate(e.dates?.start?.dateTime || e.dates?.start?.localDate),
        rawDate: e.dates?.start?.dateTime || e.dates?.start?.localDate,
        venue: venue ? `${venue.name}${venue.city?.name ? `, ${venue.city.name}` : ""}` : "",
        image: img,
        rank: 0,
        category: e.classifications?.[0]?.segment?.name || "",
        labels: [],
        entities: [],
        description: e.info || "",
        raw: e,
      };
    });

    // On first load (offset=0), prepend curated events before API events
    const combined = currentOffset === 0
      ? [...CURATED_EVENTS, ...mapped.filter(e => !CURATED_EVENTS.find(c => c.title === e.title))]
      : mapped;

    if (replace) { setEvents(combined); }
    else { setEvents(prev => [...prev, ...combined]); }
    setHasMore(merged.length >= 15);
    setOffset(currentOffset + merged.length);
    setLoading(false);
    setLoadingMore(false);
  }, []);



  useEffect(() => {
    setOffset(0);
    fetchEvents(searchQuery, CATEGORIES[activeTab].value, 0, true);
  }, [activeTab]);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setOffset(0);
      fetchEvents(searchQuery, CATEGORIES[activeTab].value, 0, true);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchQuery]);

  const stateRef = useRef({});
  stateRef.current = { hasMore, loadingMore, loading, offset, searchQuery, activeTab };

  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(entries => {
      const s = stateRef.current;
      if (entries[0].isIntersecting && s.hasMore && !s.loadingMore && !s.loading) {
        fetchEvents(s.searchQuery, CATEGORIES[s.activeTab].value, s.offset, false);
      }
    }, { threshold: 0.1 });
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [fetchEvents]);

  const featuredEvent = null;
  const restEvents = events;

  const handleRefresh = useCallback(async () => {
    setOffset(0);
    await fetchEvents(searchQuery, CATEGORIES[activeTab].value, 0, true);
  }, [fetchEvents, searchQuery, activeTab]);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div style={{ background: "white" }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: "#051a24", paddingTop: "env(safe-area-inset-top)" }}>
        <div className="flex items-center px-4 py-3 gap-3">
          {/* Ticketek logo */}
          <img
            src="https://www.image2url.com/r2/default/images/1779845454260-b504dfba-e0cc-4742-a9ce-72da00920a7b.png"
            alt="Ticketek"
            className="w-9 h-9 object-contain rounded flex-shrink-0"
          />
          {/* Search bar */}
          <div
            className="flex-1 flex items-center rounded-xl px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: "#ffffff" }} />
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-white text-sm font-medium outline-none ml-2.5 search-input"
              style={{ color: "white" }}
            />
          </div>
          {/* Alexis AI Avatar */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center relative"
            style={{
              background: "conic-gradient(from 180deg, #a855f7, #3b82f6, #eab308, #a855f7)",
              padding: 2,
              boxShadow: "0 0 10px rgba(168,85,247,0.4)",
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: "#0e0e1a" }}
            >
              {/* Robot face matching screenshot */}
              <svg viewBox="0 0 36 36" width="30" height="30" fill="none">
                {/* Head/helmet */}
                <circle cx="18" cy="18" r="13" fill="#1a1a2e"/>
                {/* White face plate */}
                <rect x="9" y="11" width="18" height="15" rx="7" fill="white"/>
                {/* Eyes */}
                <circle cx="13.5" cy="18" r="3" fill="#0e0e1a"/>
                <circle cx="22.5" cy="18" r="3" fill="#0e0e1a"/>
                {/* Eye shine */}
                <circle cx="14.5" cy="17" r="1" fill="white"/>
                <circle cx="23.5" cy="17" r="1" fill="white"/>
                {/* Smile */}
                <path d="M14 23 Q18 26.5 22 23" stroke="#0e0e1a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex px-2">
          {CATEGORIES.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                className="flex-1 py-3 text-base font-semibold bg-transparent border-none cursor-pointer transition-all whitespace-nowrap relative"
                style={{ color: "#ffffff" }}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0" style={{ left: "16px", right: "16px", height: 3, borderRadius: "3px 3px 0 0", backgroundColor: "white", display: "block" }} />
                )}
              </button>
            );
          })}
        </div>
        <style>{`
          .search-input::placeholder { color: rgba(255,255,255,0.52); }
          .search-input:focus { outline: none; }
        `}</style>
      </header>



      {/* Events list */}
      <div style={{ paddingBottom: "calc(140px + env(safe-area-inset-bottom))" }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No events found</div>
        ) : (
          <>
            {/* Events list */}
            {restEvents.map(event => (
              <div key={event.id} className="cursor-pointer" onClick={() => setSelectedEvent(event)}>
                <div className="w-full h-[200px] bg-gray-200 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={e => { e.target.src = PLACEHOLDER_IMGS.default; }}
                  />
                </div>
                <div className="px-4 py-3 bg-white border-b border-gray-100">
                  <div className="text-[15px] font-semibold text-gray-800">{event.title}</div>
                  {event.date && <div className="text-xs text-gray-500 mt-0.5">{event.date}{event.venue ? ` · ${event.venue}` : ""}</div>}
                </div>
              </div>
            ))}

            <div ref={loaderRef} className="flex justify-center py-6">
              {loadingMore && <div className="w-6 h-6 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />}
            </div>
          </>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onCustomize={(event, extraParams) => {
            setSelectedEvent(null);
            navigate(`/create-ticket?${extraParams || new URLSearchParams({ event_name: event.title, event_date: event.date, venue_name: event.venue || "" }).toString()}`);
          }}
        />
      )}
    </div>
    </PullToRefresh>
  );
}