import { useState } from "react";

const COMPASS_STANDS = ["West Stand", "East Stand", "South Stand", "North Stand"];

const LEVELS = [
  { label: "Floor Level", value: "Floor Level" },
  { label: "Level 1 (Lower Bowl / Promenade)", value: "Level 1" },
  { label: "Level 2 (Club / Suite / Mid-Tier Level)", value: "Level 2" },
  { label: "Level 3 (Upper Bowl / Balcony)", value: "Level 3" },
  { label: "Grandstand", value: "Grandstand" },
  { label: "Main Stand", value: "Main Stand" },
  { label: "Compass Stands", value: "__compass__" },
  { label: "Concourse Level", value: "Concourse Level" },
];

export default function LevelStandSheet({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [compassMode, setCompassMode] = useState(false);

  const handleSelect = (item) => {
    if (item.value === "__compass__") {
      setCompassMode(true);
      return;
    }
    onChange(item.value);
    setOpen(false);
  };

  const handleCompassSelect = (stand) => {
    onChange(stand);
    setCompassMode(false);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-left outline-none bg-white flex items-center justify-between"
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || "Select Level/Stand"}</span>
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => { setOpen(false); setCompassMode(false); }}>
          <div className="bg-white w-full max-w-[500px] mx-auto rounded-t-2xl pt-4 pb-8 max-h-[60vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="px-5 mb-3 flex items-center gap-2">
              {compassMode && (
                <button onClick={() => setCompassMode(false)} className="text-blue-500 text-sm font-medium bg-transparent border-none cursor-pointer">
                  ‹ Back
                </button>
              )}
              <h3 className="text-base font-bold text-gray-900">{compassMode ? "Select Stand Direction" : "Select Level / Stand"}</h3>
            </div>
            <div className="overflow-y-auto flex-1 px-5">
              {compassMode ? (
                COMPASS_STANDS.map(stand => (
                  <button
                    key={stand}
                    onClick={() => handleCompassSelect(stand)}
                    className="w-full text-left px-3 py-3.5 rounded-lg text-sm border-none cursor-pointer"
                    style={{ backgroundColor: value === stand ? "#f0f4ff" : "transparent", color: "#111" }}
                  >
                    {stand}
                  </button>
                ))
              ) : (
                LEVELS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-3 py-3.5 rounded-lg text-sm border-none cursor-pointer flex items-center justify-between"
                    style={{ backgroundColor: value === item.value ? "#f0f4ff" : "transparent", color: item.value === "__compass__" ? "#003057" : "#111" }}
                  >
                    <span>{item.label}</span>
                    {item.value === "__compass__" && (
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    )}
                    {value === item.value && item.value !== "__compass__" && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#003057" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}