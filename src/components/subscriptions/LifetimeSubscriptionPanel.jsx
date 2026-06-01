import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function LifetimeSubscriptionPanel() {
  const [email, setEmail] = useState("");
  const [granting, setGranting] = useState(false);
  const [granted, setGranted] = useState(false);
  const [lifetimeUsers, setLifetimeUsers] = useState([]);
  const [maintenanceMonth, setMaintenanceMonth] = useState("");
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    const now = new Date();
    setMaintenanceMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    loadLifetimeUsers();
  }, []);

  async function loadLifetimeUsers() {
    const subs = await base44.entities.Subscription.filter({ duration: "lifetime" }).catch(() => []);
    setLifetimeUsers(subs);
    const pending = subs.filter(s => s.maintenance_approved_month !== getCurrentMonth());
    setPendingApprovals(pending);
  }

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  async function handleGrant() {
    if (!email.trim()) return;
    setGranting(true);
    const me = await base44.auth.me();
    await base44.entities.Subscription.create({
      user_email: email.trim(),
      user_name: email.trim(),
      duration: "lifetime",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "9999-12-31",
      status: "active",
      granted_by: me.email,
      maintenance_approved_month: getCurrentMonth(),
    });
    setGranted(true);
    setEmail("");
    setGranting(false);
    setTimeout(() => setGranted(false), 3000);
    loadLifetimeUsers();
  }

  async function approveMaintenance(sub) {
    await base44.entities.Subscription.update(sub.id, {
      maintenance_approved_month: getCurrentMonth(),
    });
    loadLifetimeUsers();
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-1">♾️ Life Time Subscription</h3>
      <p className="text-xs text-gray-400 mb-4">Grant a user unlimited, never-expiring access.</p>

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
          ✓ Lifetime subscription granted!
        </div>
      )}

      <button
        onClick={handleGrant}
        disabled={!email.trim() || granting}
        className="w-full py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50 mb-5"
        style={{ backgroundColor: "#003057" }}
      >
        {granting ? "Granting..." : "Grant Lifetime Subscription"}
      </button>

      {/* Monthly Maintenance Fee Approval */}
      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-sm font-bold text-gray-700 mb-1">Monthly Maintenance Fee Approval</h4>
        <p className="text-xs text-gray-400 mb-3">
          Approve lifetime users for the current month ({getCurrentMonth()}). Unapproved users will be locked out.
        </p>
        {pendingApprovals.length === 0 ? (
          <div className="text-center text-xs text-green-600 py-3 bg-green-50 rounded-lg">
            ✓ All lifetime users approved for this month
          </div>
        ) : (
          <div className="space-y-2">
            {pendingApprovals.map(sub => (
              <div key={sub.id} className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                <div>
                  <div className="text-sm font-medium text-gray-800">{sub.user_email}</div>
                  <div className="text-xs text-gray-400">Last approved: {sub.maintenance_approved_month || "Never"}</div>
                </div>
                <button
                  onClick={() => approveMaintenance(sub)}
                  className="px-3 py-1.5 rounded-lg text-white text-xs font-bold border-none cursor-pointer"
                  style={{ backgroundColor: "#003057" }}
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}

        {lifetimeUsers.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-bold text-gray-500 uppercase mb-2">All Lifetime Users</div>
            {lifetimeUsers.map(sub => (
              <div key={sub.id} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{sub.user_email}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sub.maintenance_approved_month === getCurrentMonth() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {sub.maintenance_approved_month === getCurrentMonth() ? "✓ Active" : "⚠ Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}