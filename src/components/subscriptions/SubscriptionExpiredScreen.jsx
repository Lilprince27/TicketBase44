import { base44 } from "@/api/base44Client";

export default function SubscriptionExpiredScreen({ subscription }) {
  const durMap = { "2_weeks": "2 Weeks", "1_month": "1 Month", "3_months": "3 Months" };
  const plan = durMap[subscription?.duration] || subscription?.duration || "Unknown";
  const expiredDate = subscription?.end_date
    ? new Date(subscription.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "Unknown";

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 text-center z-50" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="text-5xl mb-4">❌</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Expired</h1>
      <p className="text-gray-500 mb-6 text-sm max-w-xs">Your subscription has expired and you no longer have access to the full app.</p>

      <div className="bg-gray-50 rounded-xl p-5 text-left w-full max-w-sm mb-6">
        <p className="font-bold text-gray-800 mb-3">What this means?</p>
        <ul className="text-sm text-gray-600 space-y-2 mb-4">
          <li>• You no longer have access to the app</li>
          <li>• Contact admin to renew your subscription</li>
          <li>• You'll regain access once renewed</li>
        </ul>
        <div className="pt-4 border-t border-gray-200 text-sm space-y-2">
          <div className="flex justify-between"><span className="text-gray-500">Plan:</span><span className="font-semibold">{plan}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Expired:</span><span className="font-semibold text-red-500">{expiredDate}</span></div>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mb-3 max-w-xs">Need help? Contact your admin to renew your subscription or get assistance.</p>
      <a
        href="https://t.me/ebuka43"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full max-w-sm py-4 rounded-xl text-white font-semibold no-underline mb-4"
        style={{ backgroundColor: "#0088cc" }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        Message @ebuka43 on Telegram
      </a>
      <button
        onClick={() => base44.auth.logout()}
        className="text-sm text-gray-400 underline cursor-pointer bg-transparent border-none"
      >
        Sign out
      </button>
    </div>
  );
}