import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function LifetimeSubscriptionPanel() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGrant = async () => {
    if (!email) return;
    setSaving(true);
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    await base44.entities.Subscription.create({
      user_email: email.trim(),
      user_name: name.trim(),
      duration: "lifetime",
      start_date: now.toISOString().split("T")[0],
      end_date: "2099-12-31",
      status: "active",
      maintenance_approved_month: currentMonth,
    });
    setEmail("");
    setName("");
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Grant Lifetime Subscription</h3>
      <input type="text" value={name} onChange={e => setName(e.target.value)}
        placeholder="User Name"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 outline-none" />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="User Email"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none" />
      <button onClick={handleGrant} disabled={saving || !email}
        className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: "#003057" }}>
        {success ? "✓ Granted!" : saving ? "Granting..." : "Grant Lifetime Access"}
      </button>
    </div>
  );
}