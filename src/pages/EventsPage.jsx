import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import EventDetailModal from "../components/events/EventDetailModal";
import EventHeroCarousel from "../components/events/EventHeroCarousel";
import EventHorizontalScroll from "../components/events/EventHorizontalScroll";
import EventListItem from "../components/events/EventListItem";
import { TICKETEK_FEATURED, TICKETEK_TRENDING, TICKETEK_WAITLISTS } from "../components/events/ticketekEvents";
import TicketekLogo from "../components/TicketekLogo";
import StellaChat from "../components/stella/StellaChat";
import PullToRefresh from "../components/PullToRefresh";

const TM_API_KEY = "ysl6MCmD7CZKfSZtD9MGlKh8rGG4mNgO";

const CATEGORIES = [
  { label: "Featured", value: "", segment: false },
  { label: "Sports", value: "Sports", segment: true },
  { label: "Concerts", value: "Music", segment: true },
  { label: "Theatre", value: "Arts & Theatre", segment: true },
  { label: "Family", value: "Family", segment: true },
  { label: "Comedy", value: "Comedy", segment: false },
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
  const [showStella, setShowStella] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const debounceTimer = useRef(null);
  const loaderRef = useRef(null);

  const fetchEvents = useCallback(async (query, category, currentOffset, replace = false, silent = false) => {
    if (replace && !silent) setLoading(true);
    else if (!replace) setLoadingMore(true);

    const baseParams = new URLSearchParams({ apikey: TM_API_KEY, size: "15", page: String(Math.floor(currentOffset / 15)), countryCode: "AU", sort: "relevance,desc" });

    // Apply category filter (segmentName for segments, keyword for non-segments like Comedy)
    if (category.value) {
      if (category.segment) {
        baseParams.set("segmentName", category.value);
      } else if (!query) {
        baseParams.set("keyword", category.value);
      }
    }
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
        category: e.classifications?.[0]?.segment?.name || "",
        description: e.info || "",
        raw: e,
      };
    });

    if (replace) { setEvents(mapped); }
    else { setEvents(prev => [...prev, ...mapped]); }
    setHasMore(merged.length >= 15);
    setOffset(currentOffset + merged.length);
    setLoading(false);
    setLoadingMore(false);
  }, []);

  const handlePullRefresh = useCallback(async () => {
    await fetchEvents(searchQuery, CATEGORIES[activeTab], 0, true, true);
  }, [fetchEvents, searchQuery, activeTab]);

  useEffect(() => {
    setOffset(0);
    fetchEvents(searchQuery, CATEGORIES[activeTab], 0, true);
  }, [activeTab]);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setOffset(0);
      fetchEvents(searchQuery, CATEGORIES[activeTab], 0, true);
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
        fetchEvents(s.searchQuery, CATEGORIES[s.activeTab], s.offset, false);
      }
    }, { threshold: 0.1 });
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [fetchEvents]);

  const isFeaturedMode = !searchQuery && activeTab === 0;

  return (
    <PullToRefresh onRefresh={handlePullRefresh}>
    <div style={{ background: "white" }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: "#051a24", paddingTop: "env(safe-area-inset-top)" }}>
        <div className="flex items-center px-4 py-3 gap-3">
          <TicketekLogo size={28} variant="white" className="flex-shrink-0" />
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
            onClick={() => setShowStella(true)}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center relative cursor-pointer"
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
              <svg viewBox="0 0 36 36" width="30" height="30" fill="none">
                <circle cx="18" cy="18" r="13" fill="#1a1a2e" />
                <rect x="9" y="11" width="18" height="15" rx="7" fill="white" />
                <circle cx="13.5" cy="18" r="3" fill="#0e0e1a" />
                <circle cx="22.5" cy="18" r="3" fill="#0e0e1a" />
                <circle cx="14.5" cy="17" r="1" fill="white" />
                <circle cx="23.5" cy="17" r="1" fill="white" />
                <path d="M14 23 Q18 26.5 22 23" stroke="#0e0e1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category tabs — horizontally scrollable */}
        <div
          className="flex px-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          <style>{`.tk-tabs::-webkit-scrollbar { display: none; }`}</style>
          {CATEGORIES.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                className="tk-tabs flex-shrink-0 py-3 px-4 text-base font-semibold bg-transparent border-none cursor-pointer transition-all whitespace-nowrap relative"
                style={{ color: "#ffffff" }}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-t" style={{ backgroundColor: "white", display: "block" }} />
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

      {/* Content */}
      <div style={{ paddingBottom: "calc(140px + env(safe-area-inset-bottom))" }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : isFeaturedMode ? (
          <>
            {/* Hero carousel */}
            <EventHeroCarousel events={TICKETEK_FEATURED} onSelect={setSelectedEvent} />

            {/* Trending now */}
            <EventHorizontalScroll title="Trending now" events={TICKETEK_TRENDING} onSelect={setSelectedEvent} />

            {/* Waitlists */}
            <EventHorizontalScroll title="Waitlists" events={TICKETEK_WAITLISTS} onSelect={setSelectedEvent} />

            {/* More events from API */}
            {events.length > 0 && (
              <>
                <h2 className="px-4 pt-5 pb-3 text-lg font-bold text-gray-900">More events</h2>
                {events.map(event => (
                  <EventListItem key={event.id} event={event} onClick={setSelectedEvent} />
                ))}
                <div ref={loaderRef} className="flex justify-center py-6">
                  {loadingMore && <div className="w-6 h-6 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />}
                </div>
              </>
            )}
          </>
        ) : (
          events.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No events found</div>
          ) : (
            <>
              {events.map(event => (
                <EventListItem key={event.id} event={event} onClick={setSelectedEvent} />
              ))}
              <div ref={loaderRef} className="flex justify-center py-6">
                {loadingMore && <div className="w-6 h-6 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />}
              </div>
            </>
          )
        )}
      </div>

      {showStella && <StellaChat onClose={() => setShowStella(false)} />}

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