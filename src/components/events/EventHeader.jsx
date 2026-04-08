import { useState } from "react";
import { Search } from "lucide-react";

const tabs = ["Featured", "Nearby", "Upcoming"];

export default function EventHeader() {
  const [activeTab, setActiveTab] = useState("Featured");

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: "#021a30" }}>
      <div className="flex items-center px-4 py-3 gap-4">
        <div className="flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-8 h-8">
            <defs>
              <mask id="t-cutout">
                <rect width="24" height="24" fill="white" />
                <path d="M8 8h8v2.5h-2.5v5.5h-3v-5.5H8V8z" fill="black" />
              </mask>
            </defs>
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill="white"
              mask="url(#t-cutout)"
            />
          </svg>
        </div>
        <div className="flex-1 flex items-center rounded px-3 py-2" style={{ backgroundColor: "#1a334a" }}>
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder-gray-400"
          />
        </div>
      </div>
      <div className="flex px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-3 text-sm font-semibold cursor-pointer transition-all duration-200 border-b-[5px] ${
              activeTab === tab
                ? "text-white border-white"
                : "text-gray-400 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
}