import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function AdminAuthCodesPanel() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.UserProfile.list().catch(() => []);
    setProfiles(all);
    setLoading(false);
    setLoaded(true);
  };

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = profiles.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (p.user_email || "").toLowerCase().includes(q) ||
      (p.first_name || "").toLowerCase().includes(q) ||
      (p.last_name || "").toLowerCase().includes(q) ||
      (p.uid || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-1">User Authentication Codes</h3>
      <p className="text-xs text-gray-400 mb-4">View all registered users and their authentication codes.</p>

      {!loaded ? (
        <button
          onClick={load}
          disabled={loading}
          className="w-full py-3 rounded-lg text-white text-sm font-bold border-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#003057" }}
        >
          {loading ? "Loading..." : "Load All Auth Codes"}
        </button>
      ) : (
        <>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or UID..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none mb-4 text-gray-800"
          />
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-4">No users found.</div>
            )}
            {filtered.map(p => (
              <div key={p.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-800 truncate">
                      {p.first_name || p.last_name ? `${p.first_name || ""} ${p.last_name || ""}`.trim() : "Unnamed"}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{p.user_email}</div>
                    <div className="text-xs text-gray-400 font-mono truncate">{p.uid || "No UID"}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <span className="flex-1 font-mono text-xs text-gray-700 break-all">
                    {p.auth_code || <span className="text-gray-400 italic">No auth code</span>}
                  </span>
                  {p.auth_code && (
                    <button
                      onClick={() => handleCopy(p.auth_code, p.id)}
                      className="flex-shrink-0 text-xs font-semibold border-none bg-transparent cursor-pointer"
                      style={{ color: "#003057" }}
                    >
                      {copied === p.id ? "✓ Copied" : "Copy"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold border border-gray-200 bg-white cursor-pointer text-gray-600 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </>
      )}
    </div>
  );
}