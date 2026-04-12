import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const API_TOKEN = "qrcZ8xPnq5iTeL-EKdxjKQt6njL0tdNh3Slqsm4G";
const BASE_URL = "https://api.predicthq.com/v1/events/";

const CATEGORY_MAP = {
  Featured: "",
  Concerts: "concerts",
  Sports: "sports",
  Festivals: "festivals",
};

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
  const [activeTab, setActiveTab] = useState("Featured");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [doubleTapId, setDoubleTapId] = useState(null);
  const tapTimers = useRef({});
  const debounceTimer = useRef(null);
  const loaderRef = useRef(null);

  const fetchEvents = useCallback(async (query, category, currentOffset, replace = false) => {
    if (replace) setLoading(true);
    else setLoadingMore(true);

    const params = new URLSearchParams({
      country: "AU",
      limit: "15",
      offset: String(currentOffset),
      sort: "rank",
    });
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
      venue: e.entities?.find(en => en.type === "venue")?.name || "",
      image: getPlaceholder(e.category ? [e.category] : e.labels || []),
      rank: e.rank || 0,
      category: e.category || "",
      labels: e.labels || [],
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
  }, []);

  useEffect(() => {
    setOffset(0);
    fetchEvents(searchQuery, CATEGORY_MAP[activeTab], 0, true);
  }, [activeTab]);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setOffset(0);
      fetchEvents(searchQuery, CATEGORY_MAP[activeTab], 0, true);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
        fetchEvents(searchQuery, CATEGORY_MAP[activeTab], offset, false);
      }
    }, { threshold: 0.1 });
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loading, offset, searchQuery, activeTab]);

  const handleTap = (event) => {
    const id = event.id;
    if (tapTimers.current[id]) {
      clearTimeout(tapTimers.current[id]);
      delete tapTimers.current[id];
      // double tap
      setDoubleTapId(prev => prev === id ? null : id);
    } else {
      tapTimers.current[id] = setTimeout(() => {
        delete tapTimers.current[id];
        setDoubleTapId(null);
      }, 300);
    }
  };

  const handleCustomizeTicket = (event) => {
    const params = new URLSearchParams({
      event_name: event.title,
      event_date: event.date,
      venue_name: event.venue || "",
    });
    navigate(`/create-ticket?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: "#021a30" }}>
        <div className="flex items-center px-4 py-3 gap-3">
          <img
            src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/4f3732a50_IMG_7107.jpeg"
            alt="Ticketek"
            className="w-9 h-9 object-contain rounded flex-shrink-0"
          />
          <div className="flex-1 flex items-center rounded px-3 py-2" style={{ backgroundColor: "#1a334a" }}>
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder-gray-400"
            />
          </div>
        </div>
        <div className="flex px-4">
          {Object.keys(CATEGORY_MAP).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-3 cursor-pointer transition-all border-b-[3px] border-none bg-transparent text-sm font-semibold ${
                activeTab === tab ? "text-white border-white" : "text-gray-400 border-transparent"
              }`}
              style={{ borderBottomStyle: "solid" }}
            >
              {tab}
            </button>
          ))}
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
              <div key={event.id} className="relative cursor-pointer" onClick={() => handleTap(event)}>
                <div className="w-full h-[200px] bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }}>
                  {event.rank >= 80 && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: "#e53e3e" }}>
                      🔥 Selling Fast
                    </div>
                  )}
                </div>
                <div className="px-4 py-3 bg-white border-b border-gray-100">
                  <div className="text-[15px] font-semibold text-gray-800">{event.title}</div>
                  {event.date && <div className="text-xs text-gray-500 mt-0.5">{event.date}{event.venue ? ` · ${event.venue}` : ""}</div>}
                </div>

                {/* Double-tap overlay */}
                {doubleTapId === event.id && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <button
                      onClick={e => { e.stopPropagation(); handleCustomizeTicket(event); }}
                      className="px-6 py-3 rounded-xl text-white font-bold text-base border-2 border-white"
                      style={{ backgroundColor: "#003057" }}
                    >
                      🎟 Customize Ticket
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Infinite scroll loader */}
            <div ref={loaderRef} className="flex justify-center py-6">
              {loadingMore && <div className="w-6 h-6 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}