import { useState } from "react";
import { Search } from "lucide-react";

const tabs = ["Featured", "Nearby", "Upcoming"];

export default function EventHeader() {
  const [activeTab, setActiveTab] = useState("Featured");

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: "#021a30" }}>
      <div className="flex items-center px-4 py-3 gap-4">
        <div className="flex-shrink-0">
          <img
            src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/4f3732a50_IMG_7107.jpeg"
            alt="Ticketek"
            className="w-9 h-9 object-contain rounded"
          />
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
            className={`flex-1 text-center py-3 cursor-pointer transition-all duration-200 border-b-[5px] ${
              activeTab === tab
                ? "text-white border-white font-semibold text-sm"
                : "text-gray-400 border-transparent font-semibold text-sm"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
}