import { useState } from "react";

export default function ShareModal({ seatNumber, onClose }) {
  const [contact, setContact] = useState("");
  const [name, setName] = useState("");

  const isValid = contact.trim() !== "" && name.trim() !== "";

  const handleShare = () => {
    if (isValid) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-6 pb-9 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <svg className="w-12 h-12 text-gray-400 flex-shrink-0" style={{ transform: "rotate(-45deg)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8z" />
            <line x1="6" y1="5" x2="6" y2="19" strokeDasharray="2 2" />
          </svg>
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Share ticket for Seat {seatNumber}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Securely share tickets. <a href="#" className="font-medium" style={{ color: "#004b8d" }}>How it works</a>
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="relative mb-4">
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter mobile or email"
            className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base outline-none text-gray-800 placeholder-gray-400"
          />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6" style={{ color: "#004b8d" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <circle cx="20" cy="11" r="3" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="17" y1="11" x2="23" y2="11" />
          </svg>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        <p className="text-sm text-gray-400 text-center my-5 px-2">
          By entering this information you agree that you have the receiver's consent to do so.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-lg font-semibold text-base border border-gray-200 bg-white"
            style={{ color: "#004b8d" }}
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            className={`flex-1 py-4 rounded-lg font-semibold text-base border-none transition-all ${
              isValid
                ? "text-white cursor-pointer"
                : "text-gray-400 cursor-not-allowed"
            }`}
            style={{ backgroundColor: isValid ? "#418029" : "#e8e8e8" }}
          >
            Share ticket
          </button>
        </div>
      </div>
    </div>
  );
}