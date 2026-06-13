import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setName(u.display_name || u.full_name || "");
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Optimistic update — reflect immediately in UI
    setUser(prev => prev ? { ...prev, display_name: name } : prev);
    await base44.auth.updateMe({ display_name: name });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen max-w-[500px] mx-auto">
      <header className="sticky top-0 bg-white text-center py-4 border-b border-gray-200 z-50">
        <div className="flex items-center px-4">
          <button onClick={() => navigate("/account")} className="text-2xl text-gray-800 font-light">‹</button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Your Profile</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-6 py-8">
        <label className="block text-sm font-medium text-gray-600 mb-2">Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400"
        />
        <p className="text-xs text-gray-400 mt-2">This name will appear on your account greeting.</p>

        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="w-full py-4 rounded-lg text-white font-bold text-base border-none cursor-pointer mt-6 disabled:opacity-50"
          style={{ backgroundColor: "#003057" }}
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save"}
        </button>
      </div>
    </div>
  );
}