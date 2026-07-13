import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const durationOptions = [
  { value: "2_weeks", label: "2 Weeks", days: 14 },
  { value: "1_month", label: "1 Month", days: 30 },
  { value: "3_months", label: "3 Months", days: 90 },
];

const ALL_DURATIONS = [
  ...durationOptions,
  { value: "pro_6months", label: "Pro 6 Months", days: 180 },
  { value: "lifetime", label: "Lifetime", days: 36500 },
];

const DUR_LABELS = {
  "2_weeks": "2W",
  "1_month": "1M",
  "3_months": "3M",
  "pro_6months": "pro_6months",
  "lifetime": "Lifetime",
};

export default function AdminSubscriptionPanel() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("2_weeks");
  const [granting, setGranting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [actionDays, setActionDays] = useState("7");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    async function load() {
      const subsRes = await base44.entities.Subscription.list("-created_date", 100).catch(() => []);
      setSubscriptions(subsRes);
      setLoading(false);
    }
    load();
  }, []);

  const refreshSubs = async () => {
    const allSubs = await base44.entities.Subscription.list("-created_date", 100);
    setSubscriptions(allSubs);
  };

  const handleGrant = async () => {
    if (!selectedEmail) return;
    setGranting(true);
    const me = await base44.auth.me();
    const dur = durationOptions.find((d) => d.value === selectedDuration);
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + dur.days * 24 * 60 * 60 * 1000).toISOString();

    await base44.entities.Subscription.create({
      user_email: selectedEmail.trim().toLowerCase(),
      user_name: selectedEmail.trim(),
      duration: selectedDuration,
      start_date: startDate,
      end_date: endDate,
      status: "active",
      granted_by: me.email,
    });

    await refreshSubs();
    setSelectedEmail("");
    setGranting(false);
  };

  const handleExtend = async (subId) => {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;
    const days = parseInt(actionDays) || 0;
    if (days <= 0) return;
    setActionLoading(subId + "extend");
    const currentEnd = new Date(sub.end_date);
    const newEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000);
    await base44.entities.Subscription.update(subId, {
      end_date: newEnd.toISOString(),
      status: "active",
    });
    await refreshSubs();
    setActionLoading(null);
    setExpandedId(null);
  };

  const handleReduce = async (subId) => {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;
    const days = parseInt(actionDays) || 0;
    if (days <= 0) return;
    setActionLoading(subId + "reduce");
    const currentEnd = new Date(sub.end_date);
    const newEnd = new Date(currentEnd.getTime() - days * 24 * 60 * 60 * 1000);
    const isNowExpired = newEnd <= new Date();
    await base44.entities.Subscription.update(subId, {
      end_date: newEnd.toISOString(),
      status: isNowExpired ? "expired" : "active",
    });
    await refreshSubs();
    setActionLoading(null);
    setExpandedId(null);
  };

  const handleRenew = async (subId) => {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;
    setActionLoading(subId + "renew");
    const dur = ALL_DURATIONS.find(d => d.value === sub.duration);
    const days = dur ? dur.days : 30;
    const newStart = new Date();
    const newEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await base44.entities.Subscription.update(subId, {
      start_date: newStart.toISOString(),
      end_date: newEnd.toISOString(),
      status: "active",
    });
    await refreshSubs();
    setActionLoading(null);
    setExpandedId(null);
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-400">Loading...</div>;
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-bold text-gray-800 mb-4">Admin: Transfer Subscription</h3>

      {/* Email input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">User Email</label>
        <input
          type="email"
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          placeholder="Enter user email address..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-white text-gray-800"
        />
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
        className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4"
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
            const isExpired = daysLeft <= 0 || sub.status === "expired";
            const durLabel = DUR_LABELS[sub.duration] || sub.duration;
            const isExpanded = expandedId === sub.id;

            return (
              <div key={sub.id} className="rounded-lg overflow-hidden border border-gray-100">
                <div
                  className="flex items-center justify-between px-3 py-3 cursor-pointer"
                  style={{ background: isExpired ? "#f9fafb" : "#f5f8fa" }}
                  onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                >
                  <div>
                    <div className="font-medium text-sm text-gray-800">{sub.user_name || sub.user_email}</div>
                    <div className="text-xs text-gray-400">{sub.user_email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-gray-700">{durLabel}</div>
                    <div className={`text-xs ${isExpired ? "text-red-500" : "text-green-600"}`}>
                      {isExpired ? "Expired" : `${daysLeft}d left`}
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-3 py-3 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="number"
                        value={actionDays}
                        onChange={(e) => setActionDays(e.target.value)}
                        min="1"
                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none text-gray-800"
                        placeholder="Days"
                      />
                      <span className="text-xs text-gray-400">days</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExtend(sub.id)}
                        disabled={actionLoading === sub.id + "extend"}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold text-white border-none cursor-pointer disabled:opacity-50"
                        style={{ backgroundColor: "#28a745" }}
                      >
                        {actionLoading === sub.id + "extend" ? "..." : "Extend"}
                      </button>
                      <button
                        onClick={() => handleReduce(sub.id)}
                        disabled={actionLoading === sub.id + "reduce"}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold text-white border-none cursor-pointer disabled:opacity-50"
                        style={{ backgroundColor: "#dc3545" }}
                      >
                        {actionLoading === sub.id + "reduce" ? "..." : "Reduce"}
                      </button>
                      <button
                        onClick={() => handleRenew(sub.id)}
                        disabled={actionLoading === sub.id + "renew"}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold text-white border-none cursor-pointer disabled:opacity-50"
                        style={{ backgroundColor: "#003057" }}
                      >
                        {actionLoading === sub.id + "renew" ? "..." : "Renew"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}