import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function AdminEmailTransferPanel() {
  const [email, setEmail] = useState("");
  const [quota, setQuota] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [grants, setGrants] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // { id, email, quota, used }
  const [editQuota, setEditQuota] = useState("");
  const [editUsed, setEditUsed] = useState("");
  const [actionEmail, setActionEmail] = useState(null); // for confirm dialogs

  useEffect(() => {
    loadGrants();
  }, []);

  const loadGrants = async () => {
    try {
      const profiles = await base44.entities.UserProfile.list("-updated_date", 200);
      const withQuota = profiles.filter(p => p.email_transfer_quota > 0 || (p.email_transfer_used || 0) > 0);
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
      const addAmount = parseInt(quota, 10);
      const newQuota = (profile.email_transfer_quota || 0) + addAmount;
      await base44.entities.UserProfile.update(profile.id, { email_transfer_quota: newQuota });
      setMessage(`Added ${addAmount} transfers to ${email.trim()}. New total quota: ${newQuota}.`);
      setEmail("");
      setQuota("");
      loadGrants();
    } catch (e) {
      setError("Could not grant quota. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // Renew: reset used counter to 0 (keeps quota)
  const handleRenew = async (g) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await base44.entities.UserProfile.update(g.id, { email_transfer_used: 0 });
      setMessage(`Renewed quota for ${g.user_email}. Used counter reset to 0.`);
      setActionEmail(null);
      loadGrants();
    } catch (e) {
      setError("Could not renew quota.");
    } finally {
      setBusy(false);
    }
  };

  // Delete: remove quota entirely (set quota + used to 0)
  const handleDelete = async (g) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await base44.entities.UserProfile.update(g.id, { email_transfer_quota: 0, email_transfer_used: 0 });
      setMessage(`Deleted quota for ${g.user_email}.`);
      setActionEmail(null);
      loadGrants();
    } catch (e) {
      setError("Could not delete quota.");
    } finally {
      setBusy(false);
    }
  };

  // Save edit: set exact quota and/or used values
  const handleSaveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const update = {};
      if (editQuota !== "") update.email_transfer_quota = parseInt(editQuota, 10);
      if (editUsed !== "") update.email_transfer_used = parseInt(editUsed, 10);
      if (Object.keys(update).length === 0) {
        setError("Enter a quota or used value to update.");
        setBusy(false);
        return;
      }
      await base44.entities.UserProfile.update(editing.id, update);
      setMessage(`Updated quota for ${editing.email}.`);
      setEditing(null);
      setEditQuota("");
      setEditUsed("");
      loadGrants();
    } catch (e) {
      setError("Could not update quota.");
    } finally {
      setBusy(false);
    }
  };

  const filtered = grants.filter(g =>
    !search || (g.user_email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border border-gray-200 p-4 mb-4">
      <h3 className="text-base font-bold text-gray-800 mb-1">Email Transfer Quotas</h3>
      <p className="text-xs text-gray-500 mb-4">Add, extend, renew, edit, or delete email ticket transfer quotas for users.</p>

      {/* Grant form */}
      <div className="mb-3">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="User email"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none mb-2" />
        <input type="number" value={quota} onChange={e => setQuota(e.target.value)} placeholder="Number of email transfers to add"
          min="1" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none" />
      </div>

      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      {message && <p className="text-green-600 text-xs mb-2">{message}</p>}

      <button onClick={handleGrant} disabled={busy}
        className="w-full py-2.5 rounded-lg text-white font-semibold text-sm border-none cursor-pointer disabled:opacity-50 mb-4"
        style={{ backgroundColor: "#003057" }}>
        {busy ? "Working..." : "Add / Extend Quota"}
      </button>

      {/* Search + list */}
      {grants.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600">Active Quotas ({grants.length})</p>
          </div>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none mb-2" />

          <div className="space-y-1">
            {filtered.map(g => {
              const remaining = (g.email_transfer_quota || 0) - (g.email_transfer_used || 0);
              const isEditing = editing && editing.id === g.id;
              const isConfirming = actionEmail && actionEmail.id === g.id;
              return (
                <div key={g.id} className="border border-gray-100 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-800 font-medium truncate">{g.user_email}</p>
                      <p className="text-xs text-gray-400">{g.email_transfer_used || 0} used of {g.email_transfer_quota || 0}</p>
                    </div>
                    <span className="text-xs font-bold mr-2" style={{ color: remaining > 0 ? "#22c55e" : "#ef4444" }}>
                      {remaining} left
                    </span>
                  </div>

                  {/* Action buttons */}
                  {!isEditing && !isConfirming && (
                    <div className="flex gap-1.5 mt-2">
                      <button onClick={() => { setEditing(g); setEditQuota(""); setEditUsed(""); }}
                        className="flex-1 py-1.5 text-xs font-medium rounded-md border border-gray-200 text-gray-600 bg-white cursor-pointer hover:bg-gray-50">
                        Edit
                      </button>
                      <button onClick={() => handleRenew(g)} disabled={busy}
                        className="flex-1 py-1.5 text-xs font-medium rounded-md text-white cursor-pointer disabled:opacity-50"
                        style={{ backgroundColor: "#2563eb" }}>
                        Renew
                      </button>
                      <button onClick={() => setActionEmail({ ...g, action: "delete" })}
                        className="flex-1 py-1.5 text-xs font-medium rounded-md border border-red-200 text-red-600 bg-white cursor-pointer hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Edit row */}
                  {isEditing && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500 mb-1.5">Set exact values:</p>
                      <div className="flex gap-1.5 mb-1.5">
                        <input type="number" value={editQuota} onChange={e => setEditQuota(e.target.value)}
                          placeholder={`Quota (${g.email_transfer_quota || 0})`}
                          className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs outline-none" />
                        <input type="number" value={editUsed} onChange={e => setEditUsed(e.target.value)}
                          placeholder={`Used (${g.email_transfer_used || 0})`}
                          className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs outline-none" />
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={handleSaveEdit} disabled={busy}
                          className="flex-1 py-1.5 text-xs font-medium rounded-md text-white cursor-pointer disabled:opacity-50"
                          style={{ backgroundColor: "#003057" }}>
                          Save
                        </button>
                        <button onClick={() => setEditing(null)}
                          className="flex-1 py-1.5 text-xs font-medium rounded-md border border-gray-200 text-gray-600 bg-white cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Delete confirm */}
                  {isConfirming && actionEmail.action === "delete" && (
                    <div className="mt-2 p-2 bg-red-50 rounded-md">
                      <p className="text-xs text-red-700 mb-1.5">Delete quota for {g.user_email}? This removes the quota and resets used to 0.</p>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleDelete(g)} disabled={busy}
                          className="flex-1 py-1.5 text-xs font-medium rounded-md text-white cursor-pointer disabled:opacity-50"
                          style={{ backgroundColor: "#dc2626" }}>
                          Delete
                        </button>
                        <button onClick={() => setActionEmail(null)}
                          className="flex-1 py-1.5 text-xs font-medium rounded-md border border-gray-200 text-gray-600 bg-white cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}