import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const durationOptions = [
  { value: "2_weeks", label: "2 Weeks", days: 14 },
  { value: "1_month", label: "1 Month", days: 30 },
  { value: "3_months", label: "3 Months", days: 90 },
];

export default function AdminSubscriptionPanel() {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("2_weeks");
  const [granting, setGranting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const allUsers = await base44.entities.User.list();
      setUsers(allUsers);
      const allSubs = await base44.entities.Subscription.list("-created_date", 100);
      setSubscriptions(allSubs);
      setLoading(false);
    }
    load();
  }, []);

  const handleGrant = async () => {
    if (!selectedEmail) return;
    setGranting(true);
    const me = await base44.auth.me();
    const dur = durationOptions.find((d) => d.value === selectedDuration);
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + dur.days * 24 * 60 * 60 * 1000).toISOString();

    await base44.entities.Subscription.create({
      user_email: selectedEmail,
      user_name: users.find((u) => u.email === selectedEmail)?.full_name || selectedEmail,
      duration: selectedDuration,
      start_date: startDate,
      end_date: endDate,
      status: "active",
      granted_by: me.email,
    });

    // Refresh
    const allSubs = await base44.entities.Subscription.list("-created_date", 100);
    setSubscriptions(allSubs);
    setSelectedEmail("");
    setGranting(false);
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-400">Loading...</div>;
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-bold text-gray-800 mb-4">Admin: Transfer Subscription</h3>

      {/* User select */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Select User</label>
        <select
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-white text-gray-800"
        >
          <option value="">Choose a user...</option>
          {users.map((u) => (
            <option key={u.id} value={u.email}>
              {u.full_name || u.email} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {/* Duration select */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
        <div className="flex gap-2">
          {durationOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedDuration(opt.value)}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold border transition-all cursor-pointer ${
                selectedDuration === opt.value
                  ? "text-white border-transparent"
                  : "bg-white border-gray-200 text-gray-600"
              }`}
              style={selectedDuration === opt.value ? { backgroundColor: "#003057" } : {}}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGrant}
        disabled={!selectedEmail || granting}
        className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#418029" }}
      >
        {granting ? "Granting..." : "Grant Subscription"}
      </button>

      {/* Active subscriptions list */}
      <h4 className="text-sm font-bold text-gray-600 mt-6 mb-3">Active Subscriptions</h4>
      {subscriptions.length === 0 ? (
        <p className="text-sm text-gray-400">No subscriptions granted yet.</p>
      ) : (
        <div className="space-y-2">
          {subscriptions.map((sub) => {
            const end = new Date(sub.end_date);
            const now = new Date();
            const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
            const isExpired = daysLeft <= 0;
            const durLabel = { "2_weeks": "2W", "1_month": "1M", "3_months": "3M" }[sub.duration] || sub.duration;

            return (
              <div
                key={sub.id}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm ${
                  isExpired ? "bg-gray-50 text-gray-400" : "bg-blue-50 text-gray-700"
                }`}
              >
                <div>
                  <div className="font-medium">{sub.user_name || sub.user_email}</div>
                  <div className="text-xs text-gray-400">{sub.user_email}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{durLabel}</div>
                  <div className={`text-xs ${isExpired ? "text-red-400" : "text-green-600"}`}>
                    {isExpired ? "Expired" : `${daysLeft}d left`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}