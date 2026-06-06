import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const TOGGLES = [
  { key: "hide_purchase_date", label: "Hide Purchase Date" },
  { key: "hide_event_title", label: "Hide Event Title" },
  { key: "hide_entrance", label: "Hide Entrance Section" },
  { key: "hide_ticket_price", label: "Hide Ticket Price" },
  { key: "hide_share_button", label: "Hide Share Button" },
  { key: "hide_wallet_button", label: "Hide Add to Wallet Button" },
];

export default function HideSettingsPanel() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    base44.auth.me().then(me => setUser(me));
    base44.entities.HideSettings.list().then(list => {
      if (list.length > 0) setSettings(list[0]);
      else setSettings({});
    });
  }, []);

  const handleToggle = (key) => {
    setSettings(s => ({ ...s, [key]: !s[key] }));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const list = await base44.entities.HideSettings.list();
    if (list.length > 0) {
      await base44.entities.HideSettings.update(list[0].id, settings);
    } else {
      await base44.entities.HideSettings.create(settings);
    }
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  if (!user || !settings) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Hide Settings</h3>
      <div className="space-y-3 mb-4">
        {TOGGLES.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{label}</span>
            <button onClick={() => handleToggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer ${settings[key] ? "bg-blue-600" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${settings[key] ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={saving}
        className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: "#003057" }}>
        {success ? "✓ Saved!" : saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}