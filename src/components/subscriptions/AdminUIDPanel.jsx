import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function AdminUIDPanel() {
  const [uid, setUid] = useState("");
  const [foundProfile, setFoundProfile] = useState(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Subscription form
  const [subDuration, setSubDuration] = useState("1_month");
  const [grantingSub, setGrantingSub] = useState(false);
  const [subResult, setSubResult] = useState(null);

  // Device code
  const [generatingCode, setGeneratingCode] = useState(false);
  const [codeResult, setCodeResult] = useState(null);

  // Approval
  const [approvingUser, setApprovingUser] = useState(false);
  const [approvalResult, setApprovalResult] = useState(null);

  const handleSearch = async () => {
    if (!uid.trim()) return;
    setSearching(true);
    setFoundProfile(null);
    setNotFound(false);
    setSubResult(null);
    setCodeResult(null);
    setApprovalResult(null);

    // Search by UID or auth_code
    const trimmed = uid.trim();
    let profiles = await base44.entities.UserProfile.filter({ uid: trimmed }).catch(() => []);
    if (profiles.length === 0) {
      profiles = await base44.entities.UserProfile.filter({ auth_code: trimmed }).catch(() => []);
    }
    if (profiles.length > 0) {
      setFoundProfile(profiles[0]);
    } else {
      setNotFound(true);
    }
    setSearching(false);
  };

  const handleGrantSubscription = async () => {
    if (!foundProfile) return;
    setGrantingSub(true);
    const me = await base44.auth.me();
    const start = new Date();
    const end = new Date();
    if (subDuration === "2_weeks") end.setDate(end.getDate() + 14);
    else if (subDuration === "1_month") end.setDate(end.getDate() + 30);
    else if (subDuration === "3_months") end.setDate(end.getDate() + 90);
    else if (subDuration === "pro_6months") end.setDate(end.getDate() + 180);
    else if (subDuration === "elite") end.setDate(end.getDate() + 90);
    else if (subDuration === "lifetime") end.setFullYear(end.getFullYear() + 99);

    await base44.entities.Subscription.create({
      user_email: foundProfile.user_email,
      user_name: `${foundProfile.first_name || ""} ${foundProfile.last_name || ""}`.trim(),
      duration: subDuration,
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
      status: "active",
      granted_by: me.email,
    });
    setSubResult("✓ Subscription granted!");
    setGrantingSub(false);
  };

  const handleGenerateCode = async () => {
    if (!foundProfile) return;
    setGeneratingCode(true);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const code = "TK-" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const existing = await base44.entities.DeviceCode.filter({ user_email: foundProfile.user_email }).catch(() => []);
    if (existing.length > 0) {
      await base44.entities.DeviceCode.update(existing[0].id, { code });
    } else {
      await base44.entities.DeviceCode.create({ user_email: foundProfile.user_email, user_name: `${foundProfile.first_name || ""} ${foundProfile.last_name || ""}`.trim(), code });
    }
    setCodeResult(`✓ Device code: ${code}`);
    setGeneratingCode(false);
  };

  const handleApprove = async () => {
    if (!foundProfile) return;
    setApprovingUser(true);
    const me = await base44.auth.me();
    const approvals = await base44.entities.UserApproval.filter({ user_email: foundProfile.user_email }).catch(() => []);
    if (approvals.length > 0) {
      await base44.entities.UserApproval.update(approvals[0].id, { status: "approved", approved_by: me.email, approved_date: new Date().toISOString() });
    } else {
      await base44.entities.UserApproval.create({ user_email: foundProfile.user_email, full_name: `${foundProfile.first_name || ""} ${foundProfile.last_name || ""}`.trim(), status: "approved", approved_by: me.email, approved_date: new Date().toISOString() });
    }
    setApprovalResult("✓ User approved!");
    setApprovingUser(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-1">Manage by UID</h3>
      <p className="text-xs text-gray-400 mb-4">Search a user by their UID to grant subscription, device code, or approval.</p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={uid}
          onChange={e => setUid(e.target.value)}
          placeholder="Enter UID or Auth Code..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800"
        />
        <button
          onClick={handleSearch}
          disabled={searching || !uid.trim()}
          className="px-4 py-3 rounded-lg text-white text-sm font-bold border-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#003057" }}
        >
          {searching ? "..." : "Search"}
        </button>
      </div>

      {notFound && <div className="text-sm text-red-500 mb-3">No user found with that UID.</div>}

      {foundProfile && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-4">
          <div>
            <div className="text-sm font-bold text-blue-800">{foundProfile.first_name} {foundProfile.last_name}</div>
            <div className="text-xs text-blue-600">{foundProfile.user_email}</div>
            <div className="text-xs text-blue-400 font-mono">{foundProfile.uid}</div>
          </div>

          {/* Grant Subscription */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Grant Subscription</div>
            <div className="flex gap-2">
              <select
                value={subDuration}
                onChange={e => setSubDuration(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
              >
                <option value="2_weeks">2 Weeks</option>
                <option value="1_month">1 Month</option>
                <option value="3_months">3 Months</option>
                <option value="lifetime">Lifetime</option>
                <option value="pro_6months">PRO 6 Months</option>
                <option value="elite">Elite (3 Months)</option>
              </select>
              <button
                onClick={handleGrantSubscription}
                disabled={grantingSub}
                className="px-3 py-2 rounded-lg text-white text-xs font-bold border-none cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: "#427926" }}
              >
                {grantingSub ? "..." : "Grant"}
              </button>
            </div>
            {subResult && <div className="text-xs text-green-600 mt-1">{subResult}</div>}
          </div>

          {/* Generate Device Code */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Device Code</div>
            <button
              onClick={handleGenerateCode}
              disabled={generatingCode}
              className="w-full py-2 rounded-lg text-white text-xs font-bold border-none cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: "#003057" }}
            >
              {generatingCode ? "Generating..." : "Generate Device Code"}
            </button>
            {codeResult && <div className="text-xs text-green-600 mt-1 font-mono">{codeResult}</div>}
          </div>

          {/* Approve User */}
          <div>
            <button
              onClick={handleApprove}
              disabled={approvingUser}
              className="w-full py-2 rounded-lg text-white text-xs font-bold border-none cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: "#7c3aed" }}
            >
              {approvingUser ? "Approving..." : "Approve User"}
            </button>
            {approvalResult && <div className="text-xs text-green-600 mt-1">{approvalResult}</div>}
          </div>
        </div>
      )}
    </div>
  );
}