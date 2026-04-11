import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

function generateDeviceCode() {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const n = "0123456789";
  const r = (s) => s[Math.floor(Math.random() * s.length)];
  return `TK-${r(c)}${r(n)}${r(n)}${r(n)}${r(c)}${r(c)}`;
}

export default function DeviceCodePanel() {
  const [users, setUsers] = useState([]);
  const [codes, setCodes] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    const [usersRes, codesRes] = await Promise.all([
      base44.entities.User.list(),
      base44.entities.DeviceCode.list("-created_date", 200),
    ]);
    setUsers(usersRes);
    setCodes(codesRes);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    if (!selectedEmail) return;
    setGenerating(true);
    const code = generateDeviceCode();
    const user = users.find(u => u.email === selectedEmail);
    const existing = codes.find(c => c.user_email === selectedEmail);
    if (existing) {
      await base44.entities.DeviceCode.update(existing.id, { code });
    } else {
      await base44.entities.DeviceCode.create({ user_email: selectedEmail, user_name: user?.full_name || selectedEmail, code });
    }
    await load();
    setGenerating(false);
  };

  const filteredUsers = users.filter(u =>
    !searchQuery ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center py-4 text-gray-400">Loading...</div>;

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-4">Device Codes</h3>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search user by name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none mb-2"
        />
        <select
          value={selectedEmail}
          onChange={e => setSelectedEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-white text-gray-800"
        >
          <option value="">Choose a user...</option>
          {filteredUsers.map(u => (
            <option key={u.id} value={u.email}>{u.full_name || u.email} ({u.email})</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!selectedEmail || generating}
        className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50 mb-6"
        style={{ backgroundColor: "#003057" }}
      >
        {generating ? "Generating..." : "Generate Device Code"}
      </button>

      <h4 className="text-sm font-bold text-gray-600 mb-3">Generated Codes</h4>
      {codes.length === 0 ? (
        <p className="text-sm text-gray-400">No codes generated yet.</p>
      ) : (
        <div className="space-y-2">
          {codes.map(c => (
            <div key={c.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-blue-50 text-sm">
              <div>
                <div className="font-medium text-gray-800">{c.user_name || c.user_email}</div>
                <div className="text-xs text-gray-400">{c.user_email}</div>
              </div>
              <div className="font-mono font-bold text-blue-700">{c.code}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}