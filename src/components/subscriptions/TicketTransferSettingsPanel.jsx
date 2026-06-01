import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const OPTIONS = [
  { value: "normal", label: "Normal (sharing enabled)" },
  { value: "require_fee", label: "Require Share Fee" },
  { value: "service_unavailable", label: 'Show "Share Service Unavailable" Error' },
  { value: "not_available", label: 'Show "Share is not available"' },
];

export default function TicketTransferSettingsPanel() {
  const [mode, setMode] = useState("normal");
  const [shareFee, setShareFee] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settingId, setSettingId] = useState(null);

  useEffect(() => {
    base44.entities.ShareSettings.list().then(list => {
      if (list.length > 0) {
        setMode(list[0].mode || "normal");
        setShareFee(list[0].share_fee || "");
        setSettingId(list[0].id);
      }
    }).catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    if (settingId) {
      await base44.entities.ShareSettings.update(settingId, { mode, share_fee: shareFee });
    } else {
      const rec = await base44.entities.ShareSettings.create({ mode, share_fee: shareFee });
      setSettingId(rec.id);
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-1">🔄 Ticket Transfer Settings</h3>
      <p className="text-xs text-gray-400 mb-4">Configure how tickets can be transferred.</p>

      <div className="space-y-3 mb-4">
        {OPTIONS.map(opt => (
          <label key={opt.value} className="flex items-center justify-between cursor-pointer py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-700">{opt.label}</span>
            <input
              type="radio"
              name="share_mode"
              value={opt.value}
              checked={mode === opt.value}
              onChange={() => setMode(opt.value)}
              className="w-4 h-4 cursor-pointer"
            />
          </label>
        ))}
      </div>

      {mode === "require_fee" && (
        <div className="mb-4 bg-blue-50 rounded-lg p-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Input Share Fee</label>
          <input
            type="text"
            value={shareFee}
            onChange={e => setShareFee(e.target.value)}
            placeholder="e.g. £100.00"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400 bg-white"
          />
          <p className="text-xs text-gray-400 mt-1">Note: always include currency symbol and .00</p>
        </div>
      )}

      {saved && (
        <div className="bg-green-50 text-green-700 text-sm font-semibold text-center py-2 rounded-lg mb-3">
          ✓ Share settings saved!
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: "#003057" }}
      >
        {saving ? "Saving..." : "Save Share Settings"}
      </button>
    </div>
  );
}