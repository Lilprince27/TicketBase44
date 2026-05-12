import { useState } from "react";

export default function NameSetupModal({ onComplete }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = firstName.trim() && lastName.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    await onComplete(firstName.trim(), lastName.trim());
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-6" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-7 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "#003057" }}>
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Welcome to Ticketek!</h2>
          <p className="text-sm text-gray-500 mt-1">Please enter your name to continue</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="e.g. John"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="e.g. Smith"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 text-gray-800"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || saving}
          className="w-full mt-6 py-4 rounded-xl text-white font-bold text-base border-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#003057" }}
        >
          {saving ? "Saving..." : "Get Started"}
        </button>
      </div>
    </div>
  );
}