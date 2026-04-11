import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

function generateDeviceCode() {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const n = "0123456789";
  const r = (s) => s[Math.floor(Math.random() * s.length)];
  return `TK-${r(c)}${r(n)}${r(n)}${r(n)}${r(c)}${r(c)}`;
}

export default function DeviceCodePanel() {
  const [codes, setCodes] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    try {
      const codesRes = await base44.entities.DeviceCode.list("-created_date", 200);
      setCodes(codesRes);
    } catch (e) {
      setCodes([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    if (!emailInput.trim()) return;
    setGenerating(true);
    const code = generateDeviceCode();
    const existing = codes.find(c => c.user_email === emailInput.trim().toLowerCase());
    if (existing) {
      await base44.entities.DeviceCode.update(existing.id, { code });
    } else {
      await base44.entities.DeviceCode.create({
        user_email: emailInput.trim().toLowerCase(),
        user_name: emailInput.trim(),
        code,
      });
    }
    await load();
    setEmailInput("");
    setGenerating(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-4">Device Codes</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">User Email</label>
        <input
          type="email"
          placeholder="Enter user email..."
          value={emailInput}
          onChange={e => setEmailInput(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none mb-3"
        />
        <button
          onClick={handleGenerate}
          disabled={!emailInput.trim() || generating}
          className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#003057" }}
        >
          {generating ? "Generating..." : "Generate Device Code"}
        </button>
      </div>

      <h4 className="text-sm font-bold text-gray-600 mb-3">Generated Codes</h4>
      {loading ? (
        <div className="text-center py-4 text-gray-400 text-sm">Loading codes...</div>
      ) : codes.length === 0 ? (
        <p className="text-sm text-gray-400">No codes generated yet.</p>
      ) : (
        <div className="space-y-2">
          {codes.map(c => (
            <div key={c.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-blue-50 text-sm">
              <div>
                <div className="font-medium text-gray-800">{c.user_name || c.user_email}</div>
                <div className="text-xs text-gray-400">{c.user_email}</div>
              </div>
              <div className="font-mono font-bold text-blue-700 text-base">{c.code}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}