import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AdminSubscriptionPanel from "../components/subscriptions/AdminSubscriptionPanel";
import UserApprovalPanel from "../components/subscriptions/UserApprovalPanel";
import AdminTicketDeletePanel from "../components/subscriptions/AdminTicketDeletePanel";
import SendNotificationPanel from "../components/subscriptions/SendNotificationPanel";
import DeviceCodePanel from "../components/subscriptions/DeviceCodePanel";
import AdminUIDPanel from "../components/subscriptions/AdminUIDPanel";
import HideSettingsPanel from "../components/subscriptions/HideSettingsPanel";
import TicketTransferSettingsPanel from "../components/subscriptions/TicketTransferSettingsPanel";
import ProSubscriptionPanel from "../components/subscriptions/ProSubscriptionPanel";
import LifetimeSubscriptionPanel from "../components/subscriptions/LifetimeSubscriptionPanel";
import EliteSubscriptionPanel from "../components/subscriptions/EliteSubscriptionPanel";
import SuspendUserPanel from "../components/subscriptions/SuspendUserPanel";
import ChangeAppUIPanel from "../components/subscriptions/ChangeAppUIPanel";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me().catch(() => null);
      if (!me) return;
      setUser(me);
      const subs = await base44.entities.Subscription.filter({ user_email: me.email, status: "active" }).catch(() => []);
      const now = new Date();
      const active = subs.find(s => new Date(s.end_date) > now);
      setSubscription(active || null);
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

  const isLifetime = subscription?.duration === "lifetime";
  const isPro = subscription?.duration === "pro_6months";
  const daysLeft = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="bg-white min-h-screen max-w-[500px] mx-auto">
      <header className="sticky top-0 bg-white py-4 border-b border-gray-200 z-50 flex items-center px-4">
        <button onClick={() => navigate(-1)} className="text-2xl text-gray-800 font-light">‹</button>
        <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Subscription</h1>
        <div className="w-6" />
      </header>

      <div className="px-5 py-6">
        {/* Current subscription status */}
        <div className="rounded-2xl p-5 mb-6 text-white" style={{ background: "linear-gradient(135deg, #001a35 0%, #003057 100%)" }}>
          <div className="text-sm opacity-70 mb-1">Current Plan</div>
          {subscription ? (
            <>
              <div className="text-2xl font-bold mb-1">
                {isLifetime ? "♾️ Lifetime" : isPro ? "⭐ PRO" : subscription?.duration === "elite" ? "Elite ✪" : "Active"}
              </div>
              <div className="text-sm opacity-80">
                {isLifetime ? "Never expires" : `${daysLeft} days remaining`}
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold mb-1">No Active Plan</div>
              <div className="text-sm opacity-80">Contact admin to get access</div>
            </>
          )}
        </div>

        {/* Change App UI - only for Lifetime/Elite users */}
        {subscription && (subscription.duration === "lifetime" || subscription.duration === "elite") && user?.role !== "admin" && (
          <ChangeAppUIPanel userEmail={user?.email} subscription={subscription} />
        )}

        {/* Admin panel */}
        {user?.role === "admin" && (
          <>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Admin Controls</div>
            <AdminUIDPanel />
            <AdminSubscriptionPanel />
            <ProSubscriptionPanel />
            <LifetimeSubscriptionPanel />
            <EliteSubscriptionPanel />
            <SuspendUserPanel />
            <UserApprovalPanel />
            <AdminTicketDeletePanel />
            <SendNotificationPanel />
            <DeviceCodePanel />
            <TicketTransferSettingsPanel />
            <HideSettingsPanel />
          </>
        )}
      </div>
    </div>
  );
}