import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function ProSubscriptionPanel() {
  const [email, setEmail] = useState("");
  const [granting, setGranting] = useState(false);
  const [granted, setGranted] = useState(false);
  const [proUsers, setProUsers] = useState([]);

  useEffect(() => { loadProUsers(); }, []);

  async function loadProUsers() {
    const subs = await base44.entities.Subscription.filter({ duration: "pro_6months" }).catch(() => []);
    setProUsers(subs);
  }

  async function handleGrant() {
    if (!email.trim()) return;
    setGranting(true);
    const me = await base44.auth.me();
    const start = new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + 6);
    await base44.entities.Subscription.create({
      user_email: email.trim(),
      user_name: email.trim(),
      duration: "pro_6months",
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
      status: "active",
      granted_by: me.email,
    });
    setGranted(true);
    setEmail("");
    setGranting(false);
    setTimeout(() => setGranted(false), 3000);
    loadProUsers();
  }

  function daysLeft(endDate) {
    return Math.max(0, Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-1">⭐ Pro Subscribers</h3>
      <p className="text-xs text-gray-400 mb-4">Grant a user 6-month Pro access.</p>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400"
        />
      </div>

      {granted && (
        <div className="bg-green-50 text-green-700 text-sm font-semibold text-center py-2 rounded-lg mb-3">
          ✓ Pro subscription granted (6 months)!
        </div>
      )}

      <button
        onClick={handleGrant}
        disabled={!email.trim() || granting}
        className="w-full py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50 mb-4"
        style={{ backgroundColor: "#003057" }}
      >
        {granting ? "Granting..." : "Grant Pro Subscription"}
      </button>

      {proUsers.length > 0 && (
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase mb-2">Active Pro Users</div>
          {proUsers.map(sub => (
            <div key={sub.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{sub.user_email}</span>
              <span className="text-xs text-gray-500">{daysLeft(sub.end_date)}d left</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}