import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function ProSubscriptionPanel() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGrant = async () => {
    if (!email) return;
    setSaving(true);
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 6);
    await base44.entities.Subscription.create({
      user_email: email.trim(),
      user_name: name.trim(),
      duration: "pro_6months",
      start_date: now.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
      status: "active",
    });
    setEmail("");
    setName("");
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Grant Pro Subscription (6 Months)</h3>
      <input type="text" value={name} onChange={e => setName(e.target.value)}
        placeholder="User Name"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 outline-none" />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="User Email"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none" />
      <button onClick={handleGrant} disabled={saving || !email}
        className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: "#418029" }}>
        {success ? "✓ Granted!" : saving ? "Granting..." : "Grant Pro Access"}
      </button>
    </div>
  );
}