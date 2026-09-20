import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function AdminEmailTransferPanel() {
  const [email, setEmail] = useState("");
  const [quota, setQuota] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    loadGrants();
  }, []);

  const loadGrants = async () => {
    try {
      const profiles = await base44.entities.UserProfile.list("-updated_date", 50);
      const withQuota = profiles.filter(p => p.email_transfer_quota > 0);
      setGrants(withQuota);
    } catch (e) {
      // ignore
    }
  };

  const handleGrant = async () => {
    if (!email.trim() || !quota) { setError("Enter a user email and quota amount."); return; }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const profiles = await base44.entities.UserProfile.filter({ user_email: email.trim().toLowerCase() });
      if (profiles.length === 0) {
        setError("No profile found for this email. The user must have logged in at least once.");
        return;
      }
      const profile = profiles[0];
      const newQuota = (profile.email_transfer_quota || 0) + parseInt(quota, 10);
      await base44.entities.UserProfile.update(profile.id, { email_transfer_quota: newQuota });
      setMessage(`Granted ${quota} email transfers to ${email.trim()}. Total quota: ${newQuota}.`);
      setEmail("");
      setQuota("");
      loadGrants();
    } catch (e) {
      setError("Could not grant quota. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 p-4 mb-4">
      <h3 className="text-base font-bold text-gray-800 mb-1">Email Transfer Quotas</h3>
      <p className="text-xs text-gray-500 mb-4">Grant users a number of email ticket transfers they can send.</p>

      <div className="mb-3">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="User email"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none mb-2" />
        <input type="number" value={quota} onChange={e => setQuota(e.target.value)} placeholder="Number of email transfers"
          min="1" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none" />
      </div>

      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      {message && <p className="text-green-600 text-xs mb-2">{message}</p>}

      <button onClick={handleGrant} disabled={busy}
        className="w-full py-2.5 rounded-lg text-white font-semibold text-sm border-none cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: "#003057" }}>
        {busy ? "Granting..." : "Grant Email Transfers"}
      </button>

      {grants.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">Active Quotas</p>
          {grants.map(g => (
            <div key={g.id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-800 font-medium">{g.user_email}</p>
                <p className="text-xs text-gray-400">{g.email_transfer_used || 0} used of {g.email_transfer_quota}</p>
              </div>
              <span className="text-xs font-bold" style={{ color: (g.email_transfer_quota - (g.email_transfer_used || 0)) > 0 ? "#22c55e" : "#ef4444" }}>
                {g.email_transfer_quota - (g.email_transfer_used || 0)} left
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}