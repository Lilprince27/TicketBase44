import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEventCountry, setEventCountry } from "@/lib/countryPreference";

const NAVY = "#102A4A";
const HEADING = "#333946";
const SUBHEADING = "#A5A5A5";
const BORDER = "#C7C7C7";
const UNSELECTED_TEXT = "#666666";

const OPTIONS = [
  { value: "both", label: "Australia & NZ" },
  { value: "AU", label: "Australia only" },
  { value: "NZ", label: "New Zealand only" },
];

export default function HelpPage() {
  const navigate = useNavigate();
  const [country, setCountry] = useState(getEventCountry());
  const [saved, setSaved] = useState(false);

  const handleSelect = (value) => {
    setCountry(value);
    setEventCountry(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="bg-white min-h-screen max-w-[500px] mx-auto">
      <header className="sticky top-0 bg-white text-center py-4 border-b border-gray-200 z-50">
        <div className="flex items-center px-4">
          <button onClick={() => navigate("/account")} className="text-2xl text-gray-800 font-light">‹</button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Help</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-6 pt-8" style={{ paddingBottom: "calc(140px + env(safe-area-inset-bottom))" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: HEADING, margin: 0 }}>Event Region</h2>
        <p style={{ fontSize: 14, color: SUBHEADING, margin: "6px 0 24px" }}>
          Choose which country's events appear on the homepage.
        </p>

        <div className="flex gap-2">
          {OPTIONS.map(opt => {
            const selected = country === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: selected ? NAVY : "#fff",
                  color: selected ? "#fff" : UNSELECTED_TEXT,
                  border: selected ? "none" : `1px solid ${BORDER}`,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigate("/account")}
          className="w-full py-4 rounded-xl text-white font-bold text-base border-none cursor-pointer mt-8"
          style={{ backgroundColor: NAVY }}
        >
          {saved ? "Saved!" : "Save"}
        </button>
      </div>
    </div>
  );
}