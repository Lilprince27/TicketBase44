import { base44 } from "@/api/base44Client";

export default function SuspendedScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 text-center" style={{ zIndex: 9998 }}>
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-3">Access Denied</h2>
      <p className="text-sm text-gray-600 leading-relaxed mb-6" style={{ maxWidth: 320 }}>
        Your account has been suspended. Our moderation team has determined that your recent activity violates the{" "}
        <strong>[TICKETEK]</strong> Terms of Service. If you believe this is a mistake, please reach out to our support team at{" "}
        <a
          href="https://t.me/ebuka43"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0088cc", fontWeight: 600 }}
        >
          @ebuka43
        </a>.
      </p>
      <a
        href="https://t.me/ebuka43"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-xs py-4 rounded-xl text-white font-bold mb-3 flex items-center justify-center gap-2 no-underline"
        style={{ backgroundColor: "#0088cc" }}
      >
        Contact Support on Telegram
      </a>
      <button
        onClick={() => base44.auth.logout()}
        className="w-full max-w-xs py-4 rounded-xl font-bold border-2 bg-white cursor-pointer"
        style={{ color: "#003057", borderColor: "#003057" }}
      >
        Log Out
      </button>
    </div>
  );
}