import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function ChangeAppUIPanel({ userEmail, subscription }) {
  const [ticketUI, setTicketUI] = useState("ui1");
  const [emailUI, setEmailUI] = useState("ui2");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [prefId, setPrefId] = useState(null);

  const isEligible = subscription?.duration === "lifetime" || subscription?.duration === "elite" || subscription?.duration === "pro_6months";

  useEffect(() => {
    if (!userEmail || !isEligible) return;
    base44.entities.UIPreference.filter({ user_email: userEmail }).then(prefs => {
      if (prefs.length > 0) {
        setTicketUI(prefs[0].ticket_ui || "ui1");
        setEmailUI(prefs[0].email_ui || "ui2");
        setPrefId(prefs[0].id);
      }
    }).catch(() => {});
  }, [userEmail, isEligible]);

  const handleSave = async () => {
    setSaving(true);
    if (prefId) {
      await base44.entities.UIPreference.update(prefId, { ticket_ui: ticketUI, email_ui: emailUI });
    } else {
      const created = await base44.entities.UIPreference.create({ user_email: userEmail, ticket_ui: ticketUI, email_ui: emailUI });
      setPrefId(created.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isEligible) return null;

  return (
    <div className="border border-yellow-200 rounded-2xl p-5 mt-6 bg-yellow-50/30">
      <h3 className="text-base font-bold text-gray-800 mb-1">Change App UI</h3>
      <p className="text-xs text-gray-400 mb-5">Exclusive for Lifetime & Elite subscribers.</p>

      {/* Ticket Page UI */}
      <div className="mb-5">
        <div className="text-sm font-semibold text-gray-700 mb-3">Change Ticket Page UI</div>
        <div className="flex gap-3">
          {["ui1", "ui2"].map(opt => (
            <button
              key={opt}
              onClick={() => setTicketUI(opt)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 cursor-pointer flex items-center justify-center gap-2 transition-all ${ticketUI === opt ? "border-blue-500 text-blue-600 bg-blue-50" : "border-gray-200 text-gray-500 bg-white"}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                {ticketUI === opt && <path d="M5 13l4 4L19 7"/>}
              </svg>
              {opt === "ui1" ? "UI 1" : "UI 2"}
            </button>
          ))}
        </div>
      </div>

      {/* Email UI */}
      <div className="mb-5">
        <div className="text-sm font-semibold text-gray-700 mb-3">Change Email UI</div>
        <div className="flex gap-3">
          {["ui1", "ui2"].map(opt => (
            <button
              key={opt}
              onClick={() => setEmailUI(opt)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 cursor-pointer flex items-center justify-center gap-2 transition-all ${emailUI === opt ? "border-blue-500 text-blue-600 bg-blue-50" : "border-gray-200 text-gray-500 bg-white"}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {opt === "ui1" ? "UI 1" : "UI 2 (default)"}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: "#003057" }}
      >
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save UI Preference"}
      </button>
    </div>
  );
}