import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function TicketTransferSettingsPanel() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    base44.auth.me().then(me => setUser(me));
    base44.entities.ShareSettings.list().then(list => {
      if (list.length > 0) setSettings(list[0]);
      else setSettings({ mode: "normal", share_fee: "" });
    });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const list = await base44.entities.ShareSettings.list();
    if (list.length > 0) {
      await base44.entities.ShareSettings.update(list[0].id, settings);
    } else {
      await base44.entities.ShareSettings.create(settings);
    }
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  if (!user || user.role !== "admin" || !settings) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Ticket Transfer Settings</h3>
      <div className="space-y-2 mb-3">
        {[
          { value: "normal", label: "Normal (transfers enabled)" },
          { value: "require_fee", label: "Require Transfer Fee" },
          { value: "service_unavailable", label: "Service Unavailable" },
          { value: "not_available", label: "Not Available" },
        ].map(opt => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="share_mode" value={opt.value}
              checked={settings.mode === opt.value}
              onChange={() => setSettings(s => ({ ...s, mode: opt.value }))}
              className="accent-blue-600" />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
      {settings.mode === "require_fee" && (
        <input type="text" value={settings.share_fee || ""} onChange={e => setSettings(s => ({ ...s, share_fee: e.target.value }))}
          placeholder="Fee amount (e.g. £100.00)"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none" />
      )}
      <button onClick={handleSave} disabled={saving}
        className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: "#003057" }}>
        {success ? "✓ Saved!" : saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}