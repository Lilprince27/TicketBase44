import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AdminSubscriptionPanel from "../components/subscriptions/AdminSubscriptionPanel";
import UserApprovalPanel from "../components/subscriptions/UserApprovalPanel";
import DeviceCodePanel from "../components/subscriptions/DeviceCodePanel";
import AdminTicketDeletePanel from "../components/subscriptions/AdminTicketDeletePanel";
import UserTicketManager from "../components/tickets/UserTicketManager";
import AdminTelegramPanel from "../components/subscriptions/AdminTelegramPanel";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMyTickets, setShowMyTickets] = useState(false);

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
    const durMap = { "2_weeks": "2 Weeks", "1_month": "1 Month", "3_months": "3 Months" };
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
            <div className="text-blue-200 text-sm">{durationLabel} Subscription: remaining {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} to expire</div>
          </div>
        ) : (
          <div className="rounded-xl p-6 mb-6 text-center bg-gray-100">
            <div className="text-gray-500 text-sm mb-2">No Active Subscription</div>
            <div className="text-gray-800 font-bold">You don't have a subscription yet</div>
            <p className="text-gray-400 text-xs mt-2">Contact admin to get a subscription</p>
          </div>
        )}

        {/* Telegram group */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 text-center mb-3">Join the ticketUPDATE group on Telegram to receive more updates about tickets</p>
          <a
            href="https://t.me/ApfMF9J1DiM2OWQ0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-white font-semibold text-base no-underline"
            style={{ backgroundColor: "#0088cc" }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Join Telegram Group
          </a>
        </div>

        {/* My Tickets button */}
        {(subscription || isAdmin) && (
          <button
            onClick={() => setShowMyTickets(!showMyTickets)}
            className="w-full py-4 rounded-lg font-bold text-base border-2 cursor-pointer mb-3"
            style={{ color: "#003057", borderColor: "#003057", background: "white" }}
          >
            {showMyTickets ? "Hide My Tickets" : "My Tickets"}
          </button>
        )}

        {showMyTickets && user && (
          <div className="mb-6 border border-gray-200 rounded-xl p-4">
            <h3 className="text-base font-bold text-gray-800 mb-3">My Tickets</h3>
            <UserTicketManager userEmail={user.email} />
          </div>
        )}

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
        {isAdmin && <UserApprovalPanel />}
        {isAdmin && <DeviceCodePanel />}
        {isAdmin && <AdminTicketDeletePanel />}

      </div>
    </div>
  );
}