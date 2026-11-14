import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DeviceCodeVerification({ user, onVerified }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) return;

    setVerifying(true);
    setError("");

    try {
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;

      const { data, error: verifyError } = await supabase.rpc(
        "verify_device_code",
        {
          p_code: code.trim(),
          p_session_id: sessionId
        }
      );

      if (verifyError) {
        throw verifyError;
      }

      if (data !== true) {
        setError("Incorrect code or your account has not yet been approved.");
        return;
      }

      localStorage.setItem(`tk_active_session_${user.email.toLowerCase()}`, sessionId);
      localStorage.setItem(`tk_device_${user.email}`, "verified");
      localStorage.setItem(`tk_device_${user.email}_permanent`, "true");

      onVerified();
    } catch (err) {
      console.error("Device verification error:", err);
      setError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
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
        href="https://wa.me/2347026855490"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline text-center"
      >
        Lost your code? Message admin on WhatsApp 07026855490
      </a>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
        className="mt-6 text-sm text-gray-400 underline cursor-pointer bg-transparent border-none"
      >
        Sign out
      </button>
    </div>
  );
}