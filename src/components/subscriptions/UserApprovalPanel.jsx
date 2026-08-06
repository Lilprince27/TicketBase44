import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function UserApprovalPanel() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.UserApproval.list("-created_date", 200);
    setApprovals(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sendStatusEmail = async (record, status) => {
    const name = record.full_name || record.user_email.split("@")[0];
    const subject = status === "approved"
      ? "Your Ticketek access has been approved ✅"
      : "Update on your Ticketek access request";
    const body = status === "approved"
      ? `Hi ${name},\n\nGreat news! Your Ticketek account has been approved by our admin team. You can now log in and start using the app to manage your tickets.\n\nIf you have any questions, feel free to reach out.\n\n— Ticketek Team`
      : `Hi ${name},\n\nWe're writing to let you know that your Ticketek access request has been declined. If you believe this was an error or would like to appeal, please contact our admin team.\n\n— Ticketek Team`;
    try {
      await base44.integrations.Core.SendEmail({ to: record.user_email, subject, body });
    } catch (e) {
      console.warn("Approval email failed:", e);
    }
  };

  const handleApprove = async (record) => {
    const me = await base44.auth.me();
    await base44.entities.UserApproval.update(record.id, {
      status: "approved",
      approved_by: me.email,
      approved_date: new Date().toISOString(),
    });
    await sendStatusEmail(record, "approved");
    load();
  };

  const handleReject = async (record) => {
    if (!window.confirm(`Reject ${record.full_name || record.user_email}? They will be blocked from accessing the app.`)) return;
    const me = await base44.auth.me();
    await base44.entities.UserApproval.update(record.id, {
      status: "rejected",
      approved_by: me.email,
      approved_date: new Date().toISOString(),
    });
    await sendStatusEmail(record, "rejected");
    load();
  };

  const handleDeleteAndLogout = async (record) => {
    if (!window.confirm(`Delete and logout ${record.full_name || record.user_email}? This removes their profile, tickets, subscriptions, and approval. This cannot be undone.`)) return;
    const email = record.user_email;
    // Delete user's tickets
    const tickets = await base44.entities.Ticket.filter({ owner_email: email }).catch(() => []);
    await base44.entities.Ticket.deleteMany({ owner_email: email }).catch(() => {});
    // Delete user profile
    const profiles = await base44.entities.UserProfile.filter({ user_email: email }).catch(() => []);
    await Promise.all(profiles.map(p => base44.entities.UserProfile.delete(p.id).catch(() => {})));
    // Delete subscriptions
    const subs = await base44.entities.Subscription.filter({ user_email: email }).catch(() => []);
    await Promise.all(subs.map(s => base44.entities.Subscription.delete(s.id).catch(() => {})));
    // Delete device codes
    const codes = await base44.entities.DeviceCode.filter({ user_email: email }).catch(() => []);
    await Promise.all(codes.map(c => base44.entities.DeviceCode.delete(c.id).catch(() => {})));
    // Delete the approval record
    await base44.entities.UserApproval.delete(record.id).catch(() => {});
    load();
  };

  const filtered = approvals.filter(a => a.status === activeTab);

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-4">User Approvals</h3>
      <div className="flex gap-2 mb-4">
        {["pending", "approved", "rejected"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize cursor-pointer border-none ${activeTab === tab ? "text-white" : "bg-gray-100 text-gray-600"}`}
            style={activeTab === tab ? { backgroundColor: "#003057" } : {}}
          >
            {tab} ({approvals.filter(a => a.status === tab).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-4">Loading...</div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No {activeTab} users</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(record => (
            <div
              key={record.id}
              className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm ${activeTab === "pending" ? "bg-yellow-50" : "bg-green-50"}`}
            >
              <div>
                <div className="font-medium text-gray-800">{record.full_name || record.user_email}</div>
                <div className="text-xs text-gray-400">{record.user_email}</div>
                <div className="text-xs text-gray-400">{record.created_date ? new Date(record.created_date).toLocaleDateString() : ""}</div>
              </div>
              {activeTab === "pending" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(record)}
                    className="px-3 py-2 rounded-lg text-white text-xs font-bold border-none cursor-pointer"
                    style={{ backgroundColor: "#418029" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(record)}
                    className="px-3 py-2 rounded-lg text-white text-xs font-bold border-none cursor-pointer"
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    Reject
                  </button>
                </div>
              ) : activeTab === "rejected" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(record)}
                    className="px-3 py-2 rounded-lg text-white text-xs font-bold border-none cursor-pointer"
                    style={{ backgroundColor: "#418029" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeleteAndLogout(record)}
                    className="px-3 py-2 rounded-lg text-white text-xs font-bold border-none cursor-pointer"
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleDeleteAndLogout(record)}
                  className="px-3 py-2 rounded-lg text-white text-xs font-bold border-none cursor-pointer"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  Delete & Logout
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}