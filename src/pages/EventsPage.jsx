import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import EventDetailModal from "../components/events/EventDetailModal";

const TM_API_KEY = "ysl6MCmD7CZKfSZtD9MGlKh8rGG4mNgO";

const CATEGORIES = [
  { label: "Featured", value: "" },
  { label: "Nearby", value: "" },
  { label: "Upcoming", value: "" },
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
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const debounceTimer = useRef(null);
  const loaderRef = useRef(null);
  const heroRotateTimer = useRef(null);

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

    if (replace) { setEvents(mapped); setFeaturedIdx(0); }
    else { setEvents(prev => [...prev, ...mapped]); }
    setHasMore(merged.length >= 15);
    setOffset(currentOffset + merged.length);
    setLoading(false);
    setLoadingMore(false);
  }, []);

  // Hero rotation every 2 hours (or 7200000ms). Use 30s in dev for visibility.
  useEffect(() => {
    if (!events.length) return;
    clearInterval(heroRotateTimer.current);
    heroRotateTimer.current = setInterval(() => {
      setFeaturedIdx(prev => (prev + 1) % Math.min(events.length, 10));
    }, 7200000);
    return () => clearInterval(heroRotateTimer.current);
  }, [events.length]);

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

  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
        fetchEvents(searchQuery, CATEGORIES[activeTab].value, offset, false);
      }
    }, { threshold: 0.1 });
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loading, offset, searchQuery, activeTab]);

  const featuredEvent = searchQuery.trim() ? null : (events[featuredIdx] || events[0]);
  const restEvents = searchQuery.trim() ? events : events.filter((_, i) => i !== (events.indexOf(featuredEvent)));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: "#051a24", paddingTop: "env(safe-area-inset-top)" }}>
        <div className="flex items-center px-4 py-3 gap-3">
          <img
            src="https://www.image2url.com/r2/default/images/1779845454260-b504dfba-e0cc-4742-a9ce-72da00920a7b.png"
            alt="Ticketek"
            className="w-9 h-9 object-contain rounded flex-shrink-0"
          />
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
      </header>



      {/* Events list */}
      <div className="pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No events found</div>
        ) : (
          <>
            {/* Featured Hero Card */}
            {featuredEvent && (
              <div className="cursor-pointer" onClick={() => setSelectedEvent(featuredEvent)}>
                <div className="relative w-full h-[280px] overflow-hidden">
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = PLACEHOLDER_IMGS.default; }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)" }} />

                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                    <div className="text-white text-xl font-bold leading-tight">{featuredEvent.title}</div>
                    {featuredEvent.date && <div className="text-gray-300 text-sm mt-1">{featuredEvent.date}{featuredEvent.venue ? ` · ${featuredEvent.venue}` : ""}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Rest of events */}
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
  );
}