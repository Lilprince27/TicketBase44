import { useState, useEffect } from "react";

const STORAGE_KEY = "admin_telegram_username";

export default function AdminTelegramPanel() {
  const [username, setUsername] = useState("");
  const [saved, setSaved] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const [previewResult, setPreviewResult] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || "";
    setSaved(stored);
    setUsername(stored);
  }, []);

  const handleSave = () => {
    setSaving(true);
    const clean = username.trim().replace(/^@/, "");
    localStorage.setItem(STORAGE_KEY, clean);
    setSaved(clean);
    setTimeout(() => setSaving(false), 600);
  };

  const handlePreview = async () => {
    if (!username.trim()) return;
    setPreviewing(true);
    setPreviewResult(null);
    const clean = username.trim().replace(/^@/, "");
    try {
      const res = await fetch(
        `https://api.telegram.org/bot8421405129:AAHC7hNwo_rNcubQ77yXnWh6bI888kgn87M/getChat?chat_id=@${clean}`
      );
      const data = await res.json();
      if (data.ok) {
        setPreviewResult({ ok: true, name: data.result.first_name || data.result.title || clean });
      } else {
        setPreviewResult({ ok: false });
      }
    } catch {
      setPreviewResult({ ok: false });
    }
    setPreviewing(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-1">Admin Telegram Notifications</h3>
      <p className="text-xs text-gray-400 mb-4">Enter your Telegram username to receive new user notifications via the bot.</p>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-500 font-medium text-sm">@</span>
        <input
          type="text"
          placeholder="your_telegram_username"
          value={username.replace(/^@/, "")}
          onChange={e => { setUsername(e.target.value); setPreviewResult(null); }}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800"
        />
      </div>

      {previewResult && (
        <div className={`text-xs px-3 py-2 rounded-lg mb-3 ${previewResult.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}>
          {previewResult.ok ? `✓ Found: ${previewResult.name}` : "✗ Username not found or bot can't reach them. Make sure you've messaged the bot first."}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handlePreview}
          disabled={previewing || !username.trim()}
          className="flex-1 py-3 rounded-lg border-2 text-sm font-semibold cursor-pointer disabled:opacity-50"
          style={{ borderColor: "#003057", color: "#003057", background: "white" }}
        >
          {previewing ? "Checking..." : "Preview"}
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !username.trim()}
          className="flex-1 py-3 rounded-lg text-white text-sm font-bold border-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#003057" }}
        >
          {saving ? "Saved ✓" : "Save"}
        </button>
      </div>

      {saved && (
        <p className="text-xs text-gray-400 mt-3 text-center">
          Notifications will be sent to <strong>@{saved}</strong>
        </p>
      )}
    </div>
  );
}