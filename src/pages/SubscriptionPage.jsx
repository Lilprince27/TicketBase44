import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AdminSubscriptionPanel from "../components/subscriptions/AdminSubscriptionPanel";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me();
      setUser(me);
      const subs = await base44.entities.Subscription.filter({ user_email: me.email, status: "active" });
      const activeSub = subs.find((s) => new Date(s.end_date) > new Date());
      setSubscription(activeSub || null);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  // Calculate remaining days
  let daysRemaining = 0;
  let durationLabel = "";
  if (subscription && !isAdmin) {
    const end = new Date(subscription.end_date);
    const now = new Date();
    daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    const durMap = { "2_weeks": "2 Week", "1_month": "1 Month", "3_months": "3 Month" };
    durationLabel = durMap[subscription.duration] || subscription.duration;
  }

  return (
    <div className="bg-white min-h-screen max-w-[500px] mx-auto">
      <header className="sticky top-0 bg-white text-center py-4 border-b border-gray-200 z-50">
        <div className="flex items-center px-4">
          <button onClick={() => navigate("/account")} className="text-2xl text-gray-800 font-light">‹</button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Your Subscriptions</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-5 py-6">
        {/* Current subscription status */}
        {isAdmin ? (
          <div className="rounded-xl p-6 mb-6 text-center" style={{ backgroundColor: "#003057" }}>
            <div className="text-white text-lg font-bold mb-1">Admin Account</div>
            <div className="text-blue-200 text-sm">Unlimited subscription access</div>
          </div>
        ) : subscription ? (
          <div className="rounded-xl p-6 mb-6 text-center" style={{ backgroundColor: "#003057" }}>
            <div className="text-blue-200 text-xs uppercase tracking-wide mb-2">Active Subscription</div>
            <div className="text-white text-xl font-bold mb-1">{durationLabel} Subscription</div>
            <div className="text-blue-200 text-sm">Remaining {daysRemaining} days to expire</div>
          </div>
        ) : (
          <div className="rounded-xl p-6 mb-6 text-center bg-gray-100">
            <div className="text-gray-500 text-sm mb-2">No Active Subscription</div>
            <div className="text-gray-800 font-bold">You don't have a subscription yet</div>
            <p className="text-gray-400 text-xs mt-2">Contact admin to get a subscription</p>
          </div>
        )}

        {/* Telegram contact button */}
        <div className="flex justify-center mb-8">
          <a
            href="https://t.me/ebuka43"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg no-underline"
            style={{ backgroundColor: "#003057" }}
          >
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </a>
        </div>

        {/* Create ticket button (only if has subscription or is admin) */}
        {(subscription || isAdmin) && (
          <button
            onClick={() => navigate("/create-ticket")}
            className="w-full py-4 rounded-lg text-white font-bold text-base border-none cursor-pointer mb-8"
            style={{ backgroundColor: "#418029" }}
          >
            Create Ticket
          </button>
        )}

        {/* Admin panel */}
        {isAdmin && <AdminSubscriptionPanel />}
      </div>
    </div>
  );
}