import { useState, useEffect } from "react";
import TicketekLogo from "./TicketekLogo";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function maskEmail(email) {
  if (!email) return "A****@*****.com";
  const [name, domain] = email.split("@");
  if (!domain) return "A****@*****.com";
  const tld = domain.slice(domain.lastIndexOf("."));
  return `${name[0] || "A"}****@*****${tld}`;
}

const KEYS = [
  { d: "1", sub: "" },
  { d: "2", sub: "ABC" },
  { d: "3", sub: "DEF" },
  { d: "4", sub: "GHI" },
  { d: "5", sub: "JKL" },
  { d: "6", sub: "MNO" },
  { d: "7", sub: "PQRS" },
  { d: "8", sub: "TUV" },
  { d: "9", sub: "WXYZ" },
];

const NAVY = "#003057";

export default function ProfileAuthModal({ email, onClose, onSuccess }) {
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const c = generateCode();
    setGeneratedCode(c);
    setShowNotif(true);
    setResendTimer(30);
    const t = setTimeout(() => setShowNotif(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((r) => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleKey = (k) => {
    if (code.length >= 6) return;
    const next = code + k;
    setCode(next);
    setError(false);
    if (next.length === 6) {
      setTimeout(() => {
        if (next === generatedCode) {
          onSuccess();
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setCode("");
        }
      }, 150);
    }
  };

  const handleBackspace = () => {
    setCode((c) => c.slice(0, -1));
    setError(false);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    const c = generateCode();
    setGeneratedCode(c);
    setShowNotif(true);
    setResendTimer(30);
    setCode("");
    setError(false);
    setTimeout(() => setShowNotif(false), 6000);
  };

  const handleSubmit = () => {
    if (code.length !== 6) return;
    if (code === generatedCode) {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setCode("");
    }
  };

  const ready = code.length === 6;

  return (
    <>
      {/* Push-notification style banner — black, Ticketek star logo */}
      {showNotif && (
        <div
          className="fixed top-0 left-0 right-0 z-[10001] flex justify-center px-3"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}
          onClick={() => setShowNotif(false)}
        >
          <div
            className="rounded-xl shadow-2xl px-3 py-2 w-full max-w-[420px] flex items-center gap-2.5 border"
            style={{ backgroundColor: "#000", borderColor: "rgba(255,255,255,0.12)", color: "#fff" }}
          >
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 28, height: 28 }}>
              <TicketekLogo size={26} variant="white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">Ticketek</span>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>now</span>
              </div>
              <p className="text-xs mt-0.5 leading-snug">
                Your verification code is{" "}
                <strong className="font-bold tracking-[0.12em]">{generatedCode}</strong>. Don't share this code with anyone.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Authentication sheet — white background per design */}
      <div
        className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/50"
        style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-[500px] rounded-t-3xl shadow-2xl flex flex-col"
          style={{ maxHeight: "92vh", color: "#1A1A1A", paddingBottom: "env(safe-area-inset-bottom)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#E0E0E0" }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <h2 className="text-xl font-bold" style={{ color: "#1A1A1A" }}>Authenticate your account</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#EBEBEB" }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1L13 13M13 1L1 13" />
              </svg>
            </button>
          </div>

          {/* Instructions */}
          <p className="px-5 pt-2 pb-4 text-sm leading-relaxed" style={{ color: "#4A4A4A" }}>
            We have sent a One Time Passcode to your email {maskEmail(email)}. Enter the code below.
          </p>

          {/* Input field */}
          <div className="px-5">
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-4 transition-all ${shake ? "animate-[shake_0.4s]" : ""}`}
              style={{ backgroundColor: "#fff", border: `2px solid ${error ? "#dc2626" : "#333"}` }}
            >
              <input
                type="text"
                inputMode="numeric"
                value={code}
                readOnly
                placeholder="One Time Passcode"
                className="flex-1 bg-transparent outline-none text-base font-medium tracking-[0.3em]"
                style={{ color: "#1A1A1A" }}
              />
              {error && (
                <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#dc2626" }}>Invalid code</span>
              )}
            </div>
          </div>

          {/* Resend footer */}
          <p className="px-5 pt-3 pb-4 text-xs leading-relaxed" style={{ color: "#666" }}>
            It may take a few minutes for you to receive the code. Haven't received it?{" "}
            <button
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="underline font-semibold disabled:opacity-50 disabled:no-underline"
              style={{ color: NAVY, cursor: resendTimer > 0 ? "default" : "pointer" }}
            >
              {resendTimer > 0 ? `Resend code (${resendTimer}s)` : "Resend code"}
            </button>
          </p>

          {/* Submit button */}
          <div className="px-5 pb-4">
            <button
              onClick={handleSubmit}
              disabled={!ready}
              className="w-full py-4 rounded-full font-bold text-base border-none transition-all"
              style={{
                backgroundColor: ready ? NAVY : "#F2F2F2",
                color: ready ? "#fff" : "#BDBDBD",
                cursor: ready ? "pointer" : "default",
              }}
            >
              Submit code
            </button>
          </div>

          {/* Numeric keypad */}
          <div className="px-3 py-3 mt-auto" style={{ backgroundColor: "#E5E5E5" }}>
            <div className="grid grid-cols-3 gap-2">
              {KEYS.map((k) => (
                <button
                  key={k.d}
                  onClick={() => handleKey(k.d)}
                  className="rounded-xl py-3 flex flex-col items-center justify-center active:scale-95 transition-transform"
                  style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.05)" }}
                >
                  <span className="text-2xl font-semibold leading-none" style={{ color: "#1A1A1A" }}>{k.d}</span>
                  {k.sub && <span className="text-[9px] font-semibold tracking-wider mt-1" style={{ color: "#999" }}>{k.sub}</span>}
                </button>
              ))}
              <div />
              <button
                onClick={() => handleKey("0")}
                className="rounded-xl py-3 flex flex-col items-center justify-center active:scale-95 transition-transform"
                style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <span className="text-2xl font-semibold leading-none" style={{ color: "#1A1A1A" }}>0</span>
              </button>
              <button
                onClick={handleBackspace}
                className="rounded-xl py-3 flex items-center justify-center active:scale-95 transition-transform"
                style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.05)" }}
                aria-label="Backspace"
              >
                <svg width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 2L2 10L9 18H22A2 2 0 0024 16V4A2 2 0 0022 2H9Z" />
                  <path d="M13 7L19 13M19 7L13 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes notifslide {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </>
  );
}