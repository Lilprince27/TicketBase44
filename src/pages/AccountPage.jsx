import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [profile, setProfile] = useState(null);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me().catch(() => null);
      if (!me) return;
      setUser(me);
      const subs = await base44.entities.Subscription.filter({ user_email: me.email, status: "active" }).catch(() => []);
      const now = new Date();
      const active = subs.find(s => new Date(s.end_date) > now);
      setSubscription(active || null);
      const profiles = await base44.entities.UserProfile.filter({ user_email: me.email }).catch(() => []);
      if (profiles.length > 0) setProfile(profiles[0]);
    }
    load();
  }, []);

  const handleAccountTap = () => {
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 600);
    if (tapCount.current >= 2 && user?.role === "admin") {
      navigate("/subscriptions");
    }
  };

  const daysLeft = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const isLifetime = subscription?.duration === "lifetime";
  const isPro = subscription?.duration === "pro_6months";

  const displayName = user?.full_name || user?.email || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white max-w-[500px] mx-auto">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-6 text-white"
        style={{ background: "linear-gradient(135deg, #001a35 0%, #003057 100%)" }}
        onClick={handleAccountTap}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30">
            {initial}
          </div>
          <div>
            <div className="text-xl font-bold">{displayName}</div>
            <div className="text-sm text-white/70">{user?.email}</div>
            {subscription && (
              <div className="mt-1 inline-flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                {isLifetime ? "♾️ Lifetime" : isPro ? "⭐ PRO USER" : `${daysLeft}d remaining`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="px-4 py-4 space-y-2">
        <MenuItem icon="🎟" label="My Tickets" onTap={() => navigate("/tickets")} />
        <MenuItem icon="💳" label="Subscription" onTap={() => navigate("/subscriptions")} />
        <MenuItem icon="👤" label="Edit Profile" onTap={() => navigate("/profile")} />
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={() => base44.auth.logout()}
            className="w-full py-3 text-red-500 font-semibold text-sm bg-red-50 rounded-xl border-none cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onTap }) {
  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-gray-50 border-none cursor-pointer text-left"
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-sm font-semibold text-gray-800">{label}</span>
      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}