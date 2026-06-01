import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const SETTINGS = [
  { key: "hide_purchase_date", label: "Hide Purchase Date", desc: "Shows '−' instead of purchase date on ticket." },
  { key: "hide_event_title", label: "Hide Event Title", desc: "Hides the event title from the ticket details page." },
  { key: "hide_entrance", label: "Hide Entrance Section", desc: "ENTER VIA DOOR shows as '−' on ticket." },
  { key: "hide_ticket_price", label: "Hide Ticket Price", desc: "Hides the ticket price on the ticket details page." },
  { key: "hide_share_button", label: "Hide Share Ticket Button", desc: "Hides the share button on the ticket view page." },
  { key: "hide_wallet_button", label: "Hide Add to Apple/Google Wallet Button", desc: "Hides the wallet button on the ticket view page." },
];

export default function HideSettingsPanel() {
  const [settings, setSettings] = useState({
    hide_purchase_date: false,
    hide_event_title: false,
    hide_entrance: false,
    hide_ticket_price: false,
    hide_share_button: false,
    hide_wallet_button: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settingId, setSettingId] = useState(null);

  useEffect(() => {
    base44.entities.HideSettings.list().then(list => {
      if (list.length > 0) {
        const s = list[0];
        setSettings({
          hide_purchase_date: !!s.hide_purchase_date,
          hide_event_title: !!s.hide_event_title,
          hide_entrance: !!s.hide_entrance,
          hide_ticket_price: !!s.hide_ticket_price,
          hide_share_button: !!s.hide_share_button,
          hide_wallet_button: !!s.hide_wallet_button,
        });
        setSettingId(s.id);
      }
    }).catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    if (settingId) {
      await base44.entities.HideSettings.update(settingId, settings);
    } else {
      const rec = await base44.entities.HideSettings.create(settings);
      setSettingId(rec.id);
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-1">👁 Hide Feature</h3>
      <p className="text-xs text-gray-400 mb-4">Control which elements are visible on the Ticket Details Page.</p>

      <div className="space-y-1">
        {SETTINGS.map(s => (
          <div key={s.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div className="flex-1 pr-3">
              <div className="text-sm font-medium text-gray-800">{s.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
            </div>
            <button
              onClick={() => toggle(s.key)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer flex-shrink-0 ${settings[s.key] ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${settings[s.key] ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </div>

      {saved && (
        <div className="bg-green-50 text-green-700 text-sm font-semibold text-center py-2 rounded-lg mt-3 mb-2">
          ✓ Hide settings saved!
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50 mt-4"
        style={{ backgroundColor: "#003057" }}
      >
        {saving ? "Saving..." : "Save Hide Settings"}
      </button>
    </div>
  );
}