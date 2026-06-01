import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function EliteSubscriptionPanel() {
  const [email, setEmail] = useState("");
  const [granting, setGranting] = useState(false);
  const [result, setResult] = useState(null);

  const handleGrant = async () => {
    if (!email.trim()) return;
    setGranting(true);
    setResult(null);
    const me = await base44.auth.me();
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 90); // 3 months

    await base44.entities.Subscription.create({
      user_email: email.trim().toLowerCase(),
      user_name: email.trim(),
      duration: "elite",
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
      status: "active",
      granted_by: me.email,
    });

    setResult(`✓ Elite subscription sent to ${email}`);
    setEmail("");
    setGranting(false);
  };

  return (
    <div className="border border-yellow-300 rounded-xl p-5 mt-6 bg-yellow-50/40">
      <h3 className="text-base font-bold text-gray-800 mb-1">Elite Subscription User ✪</h3>
      <p className="text-xs text-gray-400 mb-4">Send a 3-month Elite subscription with exclusive features.</p>

      <div className="flex gap-2 mb-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="user@email.com"
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800"
        />
        <button
          onClick={handleGrant}
          disabled={granting || !email.trim()}
          className="px-4 py-3 rounded-lg text-white text-sm font-bold border-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#b7891f" }}
        >
          {granting ? "..." : "Send"}
        </button>
      </div>
      {result && <div className="text-xs text-green-600 mt-1">{result}</div>}
    </div>
  );
}