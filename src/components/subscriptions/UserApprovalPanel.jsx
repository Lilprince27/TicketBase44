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

  const handleApprove = async (record) => {
    const me = await base44.auth.me();
    await base44.entities.UserApproval.update(record.id, {
      status: "approved",
      approved_by: me.email,
      approved_date: new Date().toISOString(),
    });
    load();
  };

  const filtered = approvals.filter(a => a.status === activeTab);

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-4">User Approvals</h3>
      <div className="flex gap-2 mb-4">
        {["pending", "approved"].map(tab => (
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
                <button
                  onClick={() => handleApprove(record)}
                  className="px-3 py-2 rounded-lg text-white text-xs font-bold border-none cursor-pointer"
                  style={{ backgroundColor: "#418029" }}
                >
                  Approve
                </button>
              ) : (
                <span className="text-green-600 text-xs font-bold">✓ Approved</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}