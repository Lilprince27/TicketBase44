import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function SuspendUserPanel() {
  const [email, setEmail] = useState("");
  const [suspending, setSuspending] = useState(false);
  const [result, setResult] = useState(null);
  const [suspended, setSuspended] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const list = await base44.entities.SuspendedUser.list("-created_date", 100).catch(() => []);
    setSuspended(list);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSuspend = async () => {
    if (!email.trim()) return;
    setSuspending(true);
    setResult(null);
    const me = await base44.auth.me();
    await base44.entities.SuspendedUser.create({
      user_email: email.trim().toLowerCase(),
      suspended_by: me.email,
      suspended_at: new Date().toISOString(),
    });
    setResult({ type: "success", msg: `✓ ${email} has been suspended.` });
    setEmail("");
    load();
    setSuspending(false);
  };

  const handleUnsuspend = async (id) => {
    await base44.entities.SuspendedUser.delete(id);
    setSuspended(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="border border-red-200 rounded-xl p-5 mt-6 bg-red-50/30">
      <h3 className="text-base font-bold text-red-700 mb-1">Suspend User</h3>
      <p className="text-xs text-gray-400 mb-4">Enter the user email to suspend them from the app.</p>

      <div className="flex gap-2 mb-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="user@email.com"
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800"
        />
        <button
          onClick={handleSuspend}
          disabled={suspending || !email.trim()}
          className="px-4 py-3 rounded-lg text-white text-sm font-bold border-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#dc2626" }}
        >
          {suspending ? "..." : "Suspend"}
        </button>
      </div>

      {result && (
        <div className={`text-sm mb-3 ${result.type === "success" ? "text-green-600" : "text-red-500"}`}>
          {result.msg}
        </div>
      )}

      {!loading && suspended.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Suspended Users</div>
          <div className="space-y-2">
            {suspended.map(s => (
              <div key={s.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-red-100">
                <div>
                  <div className="text-sm font-medium text-gray-800">{s.user_email}</div>
                  <div className="text-xs text-gray-400">By {s.suspended_by}</div>
                </div>
                <button
                  onClick={() => handleUnsuspend(s.id)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg text-white border-none cursor-pointer"
                  style={{ backgroundColor: "#003057" }}
                >
                  Unsuspend
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}