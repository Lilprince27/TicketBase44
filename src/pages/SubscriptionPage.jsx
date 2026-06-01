import { useState, useEffect, useRef } from "react";
// UserProfile entity used for UID display
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AdminUIDPanel from "../components/subscriptions/AdminUIDPanel";
import AdminSubscriptionPanel from "../components/subscriptions/AdminSubscriptionPanel";
import UserApprovalPanel from "../components/subscriptions/UserApprovalPanel";
import DeviceCodePanel from "../components/subscriptions/DeviceCodePanel";
import AdminTicketDeletePanel from "../components/subscriptions/AdminTicketDeletePanel";
import UserTicketManager from "../components/tickets/UserTicketManager";
import AdminTelegramPanel from "../components/subscriptions/AdminTelegramPanel.jsx";
import SendNotificationPanel from "../components/subscriptions/SendNotificationPanel";
import LifetimeSubscriptionPanel from "../components/subscriptions/LifetimeSubscriptionPanel";
import ProSubscriptionPanel from "../components/subscriptions/ProSubscriptionPanel";
import TicketTransferSettingsPanel from "../components/subscriptions/TicketTransferSettingsPanel";
import HideSettingsPanel from "../components/subscriptions/HideSettingsPanel";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMyTickets, setShowMyTickets] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [authCodeVisible, setAuthCodeVisible] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me();
      setUser(me);
      const subs = await base44.entities.Subscription.filter({ user_email: me.email, status: "active" });
      const activeSub = subs.find((s) => s.duration === "lifetime" || new Date(s.end_date) > new Date());
      setSubscription(activeSub || null);
      const profiles = await base44.entities.UserProfile.filter({ user_email: me.email }).catch(() => []);
      if (profiles.length > 0) setUserProfile(profiles[0]);
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
        {/* User Dashboard card */}
        {!isAdmin && userProfile && (
          <div className="rounded-xl p-4 mb-4 bg-gray-50 border border-gray-200">
            <div className="text-sm font-bold text-gray-800 mb-1">
              {userProfile.first_name ? `${userProfile.first_name} ${userProfile.last_name || ""}` : user?.full_name || ""}
            </div>
            <div className="text-xs text-gray-400 font-mono break-all">{userProfile.uid || ""}</div>
          </div>
        )}

        {/* Current subscription status */}
        {isAdmin ? (
          <div className="rounded-xl p-6 mb-6 text-center" style={{ backgroundColor: "#003057" }}>
            <div className="text-white text-lg font-bold mb-1">Admin Account</div>
            <div className="text-blue-200 text-sm">Unlimited subscription access</div>
          </div>
        ) : subscription?.duration === "lifetime" ? (
          <div className="rounded-xl p-6 mb-6 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
            <div className="text-yellow-300 text-xs uppercase tracking-widest mb-2">♾️ Lifetime Access</div>
            <div className="text-white text-2xl font-bold mb-1">Life Time User</div>
            <div className="text-blue-200 text-sm">Unlimited access — never expires</div>
          </div>
        ) : subscription?.duration === "pro_6months" ? (
          <div className="rounded-xl p-6 mb-6 text-center" style={{ background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }}>
            <div className="text-yellow-300 text-xs uppercase tracking-widest mb-2">⭐ Pro Member</div>
            <div className="text-white text-2xl font-bold mb-1">PRO USER</div>
            <div className="text-blue-200 text-sm">{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining</div>
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

        {/* Contact Admin buttons */}
        <div className="mb-6 space-y-3">
          <a
            href="https://wa.link/xi31ao"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-white font-semibold text-base no-underline"
            style={{ backgroundColor: "#25d366" }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Message Admin on WhatsApp
          </a>
          <a
            href="https://t.me/ebuka43"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-white font-semibold text-base no-underline"
            style={{ backgroundColor: "#0088cc" }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Message Admin on Telegram
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

        {isAdmin && <AdminSubscriptionPanel />}
        {isAdmin && <UserApprovalPanel />}
        {isAdmin && <DeviceCodePanel />}
        {isAdmin && <AdminTicketDeletePanel />}
        {isAdmin && <AdminTelegramPanel />}
        {isAdmin && <AdminUIDPanel />}
        {isAdmin && <SendNotificationPanel />}
        {isAdmin && <LifetimeSubscriptionPanel />}
        {isAdmin && <ProSubscriptionPanel />}
        {isAdmin && <TicketTransferSettingsPanel />}
        {isAdmin && <HideSettingsPanel />}

      </div>
    </div>
  );
}