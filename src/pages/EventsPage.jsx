import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import EventDetailModal from "../components/events/EventDetailModal";

const API_TOKEN = "D6akDmpY5sb17Flq3g3fCrbM7sFGrQODkbcwY-ky";
const BASE_URL = "https://api.predicthq.com/v1/events/";
const EVENTBRITE_TOKEN = "WWCNJCDH6CZ5JTHLGXBY";

async function fetchEventbriteImage(eventName) {
  try {
    const res = await fetch(
      `https://www.eventbriteapi.com/v3/events/search/?q=${encodeURIComponent(eventName)}&expand=logo&token=${EVENTBRITE_TOKEN}`
    );
    const data = await res.json();
    const event = data?.events?.[0];
    return event?.logo?.original?.url || event?.logo?.url || null;
  } catch {
    return null;
  }
}

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

async function fetchEntityImage(entityId) {
  try {
    const res = await fetch(`https://api.predicthq.com/v1/entities/${entityId}/`, {
      headers: { Authorization: `Bearer ${API_TOKEN}`, Accept: "application/json" },
    });
    const data = await res.json();
    return data.image_url || data.images?.[0]?.url || null;
  } catch {
    return null;
  }
}

async function fetchImageForEvent(title, labels = []) {
  // Try Wikipedia thumbnail via REST API
  try {
    const searchTerm = encodeURIComponent(title.split(" ").slice(0, 4).join(" "));
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.thumbnail?.source) return data.thumbnail.source;
    }
  } catch {}
  return null;
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
  const fetchingImages = useRef(new Set());

  const fetchEvents = useCallback(async (query, category, currentOffset, replace = false) => {
    if (replace) setLoading(true);
    else setLoadingMore(true);

    const params = new URLSearchParams({ country: "AU", limit: "15", offset: String(currentOffset), sort: "rank" });
    if (query) params.set("q", query);
    if (category) params.set("category", category);

    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}`, Accept: "application/json" },
    }).catch(() => null);

    const data = res ? await res.json().catch(() => null) : null;
    const results = data?.results || [];
    const mapped = results.map(e => ({
      id: e.id,
      title: e.title,
      date: formatDate(e.start),
      rawDate: e.start,
      venue: e.entities?.find(en => en.type === "venue")?.name || "",
      image: getPlaceholder(e.category ? [e.category] : e.labels || []),
      rank: e.rank || 0,
      category: e.category || "",
      labels: e.labels || [],
      entities: e.entities || [],
      description: e.description || "",
      raw: e,
    }));

    if (replace) {
      setEvents(mapped);
    } else {
      setEvents(prev => [...prev, ...mapped]);
    }
    setHasMore(results.length === 15);
    setOffset(currentOffset + results.length);
    setLoading(false);
    setLoadingMore(false);

    // Fetch better images in background - use Wikipedia (no CORS issues)
    mapped.forEach(async (ev) => {
      if (fetchingImages.current.has(ev.id)) return;
      fetchingImages.current.add(ev.id);
      
      // Try PredictHQ entity image first
      const perfEntity = ev.entities.find(en => en.type === "performer" || en.type === "artist");
      let imgUrl = null;
      if (perfEntity) {
        imgUrl = await fetchEntityImage(perfEntity.id);
      }
      // Fallback: Wikipedia
      if (!imgUrl) {
        imgUrl = await fetchImageForEvent(ev.title, ev.labels);
      }
      if (imgUrl) {
        setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, image: imgUrl } : e));
      }
    });
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: "#051a24", paddingTop: "env(safe-area-inset-top)" }}>
        <div className="flex items-center px-4 py-3 gap-3">
          <img
            src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/4f3732a50_IMG_7107.jpeg"
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
        <div className="flex px-2" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                className="flex-1 py-3 text-base font-semibold bg-transparent border-none cursor-pointer transition-all whitespace-nowrap relative"
                style={{ color: "#ffffff", letterSpacing: "-0.01em" }}
              >
                {tab.label}
                {isActive && (
                  <span
                    className="absolute bottom-0"
                    style={{
                      left: idx === 0 ? "16px" : "8px",
                      right: idx === 0 ? "16px" : "8px",
                      height: 3,
                      borderRadius: "3px 3px 0 0",
                      backgroundColor: "white",
                      display: "block",
                    }}
                  />
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
            {events.map(event => (
              <div
                key={event.id}
                className="cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div
                  className="w-full h-[200px] bg-gray-200 overflow-hidden"
                >
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
                  {event.date && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {event.date}{event.venue ? ` · ${event.venue}` : ""}
                    </div>
                  )}
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
            navigate(`/create-ticket?${extraParams || new URLSearchParams({ event_name: event.title, event_date: event.date, venue_name: event.venue || "" }).toString()}`);
          }}
        />
      )}
    </div>
  );
}