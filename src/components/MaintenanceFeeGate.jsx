import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getNextMonth() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toLocaleString("default", { month: "long", year: "numeric" });
}

function daysUntilMonthEnd() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return Math.ceil((lastDay - now) / (1000 * 60 * 60 * 24));
}

function getLastDayOfMonth() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

export default function MaintenanceFeeGate({ userEmail, children }) {
  const [status, setStatus] = useState("checking"); // checking | ok | locked | reminder
  const [reminderDismissed, setReminderDismissed] = useState(false);

  useEffect(() => {
    async function check() {
      const subs = await base44.entities.Subscription.filter({ user_email: userEmail, duration: "lifetime" }).catch(() => []);
      if (subs.length === 0) { setStatus("ok"); return; }

      const sub = subs[0];
      const currentMonth = getCurrentMonth();
      const dismissKey = `maint_dismissed_${currentMonth}`;
      const dismissed = localStorage.getItem(dismissKey);

      if (sub.maintenance_approved_month === currentMonth) {
        // Approved – check if we should show reminder (3 days before month end)
        const days = daysUntilMonthEnd();
        if (days <= 3 && !dismissed) {
          setStatus("reminder");
        } else {
          setStatus("ok");
        }
      } else {
        setStatus("locked");
      }
      setReminderDismissed(!!dismissed);
    }
    if (userEmail) check();
  }, [userEmail]);

  if (status === "checking") return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  );

  if (status === "locked") return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Access Restricted</h1>
        <p className="text-gray-500 text-sm mb-5">Your account is currently locked because the new month has started.</p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left rounded mb-4">
          <h2 className="text-xs font-bold text-yellow-800 uppercase mb-1">What this means:</h2>
          <p className="text-gray-700 text-sm">To maintain your account, a monthly maintenance fee of <strong>₦6,000</strong> is required at the beginning of every month.</p>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left rounded mb-6">
          <h2 className="text-xs font-bold text-blue-800 uppercase mb-1">How to regain access:</h2>
          <p className="text-blue-700 text-sm">Please message the Admin immediately to make your payment and reactivate your account.</p>
        </div>
        <a href="https://t.me/ebuka43" target="_blank" rel="noopener noreferrer"
          className="block w-full py-3 rounded-lg text-white font-semibold text-sm no-underline"
          style={{ backgroundColor: "#007bff" }}>
          Message Admin
        </a>
        <button onClick={() => base44.auth.logout()} className="mt-3 text-sm text-gray-400 bg-transparent border-none cursor-pointer">Sign out</button>
      </div>
    </div>
  );

  const showReminder = status === "reminder" && !reminderDismissed;

  return (
    <>
      {showReminder && (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex justify-center px-4 pt-4">
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 max-w-sm w-full shadow-md">
            <p className="text-sm text-yellow-800 leading-relaxed">
              <strong>Reminder:</strong> Your maintenance fee for <strong>{getNextMonth()}</strong> is due by <strong>{getLastDayOfMonth()}</strong>. Please ensure payment is made promptly to avoid any service disruptions.
            </p>
            <button
              onClick={() => {
                localStorage.setItem(`maint_dismissed_${getCurrentMonth()}`, "1");
                setReminderDismissed(true);
                setStatus("ok");
              }}
              className="mt-2 text-sm font-semibold text-yellow-700 bg-transparent border-none cursor-pointer"
            >
              Okay 👍
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}