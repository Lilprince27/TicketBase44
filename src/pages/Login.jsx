import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import TicketekLogo from "@/components/TicketekLogo";
import { claimSingleDeviceSession } from "@/lib/singleDeviceSession";

const TK_NAVY = "#0e1e2d";
const TK_GOLD = "#fcc93b";
const TK_GREEN = "#56773c";
const TK_BLUE = "#0055aa";

export default function Login() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const nextUrl = searchParams.get("next") || "/";

  const [mode, setMode] = useState("signin"); // signin | signup | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [countdown, setCountdown] = useState(513); // 8:33

 useEffect(() => {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      window.location.href = nextUrl;
    }
  });
}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(email.trim());
  const passwordValid = password.length >= 6;

  const handleSignIn = async () => {
    if (!emailValid || !passwordValid || busy) return;
    setBusy(true);
    setError("");
    try {
      await base44.auth.loginViaEmailPassword(email.trim(), password);
      await claimSingleDeviceSession(email.trim());
      window.location.href = nextUrl;
    } catch (e) {
      setError(e.message || "Invalid email or password. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async () => {
    if (!emailValid || !passwordValid || busy) return;
    setBusy(true);
    setError("");
    try {
      await base44.auth.register({ email: email.trim(), password });
      setInfo("A verification code has been sent to your email. Enter it below.");
      setMode("otp");
    } catch (e) {
      setError(e.message || "Could not create account. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || busy) return;
    setBusy(true);
    setError("");
    try {
      await base44.auth.verifyOtp({ email: email.trim(), otpCode: otp });
      await base44.auth.loginViaEmailPassword(email.trim(), password);
      await claimSingleDeviceSession(email.trim());
      window.location.href = nextUrl;
    } catch (e) {
      setError(e.message || "Invalid verification code. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 8, border: "1px solid #d0d0d0",
    color: "#000", fontSize: 16, outline: "none", boxSizing: "border-box",
    background: "#fff",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "-apple-system, system-ui, sans-serif" }}>
      {/* Navy header */}
      <div style={{ background: TK_NAVY, padding: "14px 18px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <TicketekLogo size={22} variant="white" />
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>TICKETEK</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </div>
        </div>
        {/* Search bar */}
        <Link to="/" style={{ textDecoration: "none", display: "flex" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 6, overflow: "hidden", width: "100%" }}>
            <input type="text" placeholder="Search comedy shows" readOnly
              style={{ flex: 1, padding: "10px 14px", border: "none", outline: "none", fontSize: 14, color: "#999", background: "transparent", cursor: "pointer" }} />
            <div style={{ background: "#e9e9e9", padding: "10px 14px", display: "flex", alignItems: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Gold timer banner */}
      <div style={{ background: TK_GOLD, padding: "10px 18px", textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: TK_NAVY }}>Time remaining&nbsp;&nbsp;{formatTime(countdown)}</span>
      </div>

      {/* Form area */}
      <div style={{ padding: "36px 24px 0" }}>
        {mode === "signin" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: "#000", margin: 0 }}>Sign in</h2>
              <span style={{ fontSize: 13, color: "#666" }}>*Required</span>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>Email*</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>Password*</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            </div>

            {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

            <button onClick={handleSignIn} disabled={!emailValid || !passwordValid || busy}
              style={{ width: "100%", padding: "16px 0", borderRadius: 8, background: emailValid && passwordValid && !busy ? TK_GREEN : "#9cb89a", color: "#fff", fontWeight: 700, fontSize: 17, border: "none", cursor: emailValid && passwordValid && !busy ? "pointer" : "default" }}>
              {busy ? "Signing in..." : "Sign In"}
            </button>

            <div style={{ textAlign: "center", marginTop: 22 }}>
              <span style={{ color: TK_BLUE, fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Reset Password</span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#e1e1e1", margin: "32px 0" }} />

            {/* Sign up outline button — gray border, black text (matches reference) */}
            <button onClick={() => { setMode("signup"); setError(""); }}
              style={{ width: "100%", padding: "15px 0", borderRadius: 8, border: "1px solid #cccccc", background: "#fff", color: "#000", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>
              Sign up
            </button>
          </>
        )}

        {mode === "signup" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: "#000", margin: 0 }}>Create account</h2>
              <span style={{ fontSize: 13, color: "#666" }}>*Required</span>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>Email*</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>Password*</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={inputStyle} />
            </div>

            {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

            <button onClick={handleSignUp} disabled={!emailValid || !passwordValid || busy}
              style={{ width: "100%", padding: "16px 0", borderRadius: 8, background: emailValid && passwordValid && !busy ? TK_GREEN : "#9cb89a", color: "#fff", fontWeight: 700, fontSize: 17, border: "none", cursor: emailValid && passwordValid && !busy ? "pointer" : "default" }}>
              {busy ? "Creating..." : "Sign Up"}
            </button>

            {/* Divider */}
            <div style={{ height: 1, background: "#e1e1e1", margin: "32px 0" }} />

            <button onClick={() => { setMode("signin"); setError(""); }}
              style={{ width: "100%", padding: "15px 0", borderRadius: 8, border: "1px solid #cccccc", background: "#fff", color: "#000", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>
              Sign in
            </button>
          </>
        )}

        {mode === "otp" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: "#000", margin: "0 0 8px" }}>Verify your email</h2>
              {info && <p style={{ fontSize: 14, color: "#666", margin: 0 }}>{info}</p>}
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>Verification code*</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit code" maxLength={6}
                style={{ ...inputStyle, textAlign: "center", letterSpacing: 4, fontSize: 18 }} />
            </div>

            {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

            <button onClick={handleVerifyOtp} disabled={!otp || busy}
              style={{ width: "100%", padding: "16px 0", borderRadius: 8, background: otp && !busy ? TK_GREEN : "#9cb89a", color: "#fff", fontWeight: 700, fontSize: 17, border: "none", cursor: otp && !busy ? "pointer" : "default" }}>
              {busy ? "Verifying..." : "Verify"}
            </button>

            <div style={{ textAlign: "center", marginTop: 22 }}>
              <span onClick={() => { setMode("signin"); setError(""); }} style={{ color: TK_BLUE, fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Back to sign in</span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "48px 24px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, margin: 0 }}>
          We treat your personal data with care. Please find our{" "}
          <span style={{ color: TK_BLUE }}>Privacy Policy</span>
          {" "}here.
        </p>
      </div>

      {/* Chat widget — floating blue circle with smiling face */}
      <div style={{ position: "fixed", bottom: 24, right: 20, width: 52, height: 52, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37,99,235,0.4)", cursor: "pointer", zIndex: 9999 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      </div>
    </div>
  );
}