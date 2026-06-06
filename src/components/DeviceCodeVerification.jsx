import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function DeviceCodeVerification({ user, onVerified }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) return;
    setVerifying(true);
    setError("");

    // Check auth code from UserProfile
    const profiles = await base44.entities.UserProfile.filter({ user_email: user.email }).catch(() => []);
    const authCode = profiles[0]?.auth_code;
    if (authCode && authCode.toLowerCase() === code.toLowerCase().trim()) {
      // Persist permanently so user is never asked again unless they log out
      localStorage.setItem(`tk_device_${user.email}`, "verified");
      localStorage.setItem(`tk_device_${user.email}_permanent`, "true");
      onVerified();
      setVerifying(false);
      return;
    }

    // Fallback: check DeviceCode records
    const records = await base44.entities.DeviceCode.filter({ user_email: user.email }).catch(() => []);
    const match = records.find(r => r.code.toUpperCase() === code.toUpperCase().trim());
    if (match) {
      localStorage.setItem(`tk_device_${user.email}`, "verified");
      localStorage.setItem(`tk_device_${user.email}_permanent`, "true");
      onVerified();
    } else {
      setError("Incorrect code. Please check your Authentication Code.");
    }
    setVerifying(false);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <img
        src="https://image2url.com/r2/default/images/1775680602688-74d1916c-f13e-492b-aaaf-20e00c0a9469.jpeg"
        alt="Ticketek"
        className="w-40 mb-8 object-contain"
      />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
      <p className="text-sm text-gray-500 text-center mb-8 max-w-xs">Enter your Authentication Code to access the app.</p>

      <div className="w-full max-w-sm mb-4">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="e.g. eze:hel68jgek69z"
          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-base font-mono tracking-widest outline-none focus:border-blue-400"
        />
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
      </div>

      <button
        onClick={handleVerify}
        disabled={!code || verifying}
        className="w-full max-w-sm py-4 rounded-xl text-white font-bold text-base border-none cursor-pointer mb-6 disabled:opacity-50"
        style={{ backgroundColor: "#003057" }}
      >
        {verifying ? "Verifying..." : "Verify"}
      </button>

      <a
        href="https://t.me/ebuka43"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline text-center"
      >
        Lost your code? Contact admin @ebuka43
      </a>

      <button
        onClick={() => base44.auth.logout()}
        className="mt-6 text-sm text-gray-400 underline cursor-pointer bg-transparent border-none"
      >
        Sign out
      </button>
    </div>
  );
}