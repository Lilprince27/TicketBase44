import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import TicketekLogo from "@/components/TicketekLogo";

const TK_NAVY = "#001f2d";
const TK_GREEN = "#4e783e";
const TK_DARK_BLUE = "#002d5c";

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
  const [countdown, setCountdown] = useState(600);

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (authed) window.location.href = nextUrl;
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
      window.location.href = nextUrl;
    } catch (e) {
      setError(e.message || "Invalid verification code. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = () => {
    base44.auth.loginWithProvider("google", nextUrl);
  };

  const handleAppleLogin = () => {
    base44.auth.loginWithProvider("apple", nextUrl);
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 4, border: "1px solid #ccc",
    color: "#000", fontSize: 16, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "-apple-system, system-ui, sans-serif" }}>
      {/* Yellow top strip */}
      <div style={{ background: "#EFC44B", height: 6 }} />
      {/* Navy header */}
      <div style={{ background: TK_NAVY, padding: "14px 18px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <TicketekLogo size={24} variant="white" />
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
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 4, overflow: "hidden" }}>
            <input type="text" placeholder="Look up shows by artist, city, or venue..." readOnly
              style={{ flex: 1, padding: "10px 14px", border: "none", outline: "none", fontSize: 14, color: "#333", background: "transparent", cursor: "pointer" }} />
            <div style={{ background: "#e9e9e9", padding: "10px 14px", display: "flex", alignItems: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Yellow timer banner */}
      <div style={{ background: "#EFC44B", padding: "10px 18px", textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#001f2d" }}>Time remaining {formatTime(countdown)}</span>
      </div>

      {/* Form area */}
      <div style={{ padding: "32px 24px 0" }}>
        {mode === "signin" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#000", margin: 0 }}>Sign in</h2>
              <span style={{ fontSize: 13, color: "#666" }}>*Required</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 6 }}>Email*</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 6 }}>Password*</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            </div>

            {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

            <button onClick={handleSignIn} disabled={!emailValid || !passwordValid || busy}
              style={{ width: "100%", padding: "16px 0", borderRadius: 4, background: emailValid && passwordValid && !busy ? TK_GREEN : "#9cb89a", color: "#fff", fontWeight: 700, fontSize: 17, border: "none", cursor: emailValid && passwordValid && !busy ? "pointer" : "default", letterSpacing: 0.5 }}>
              {busy ? "Signing in..." : "Sign In"}
            </button>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <span style={{ color: TK_DARK_BLUE, fontSize: 15, fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>Reset Password</span>
            </div>

            {/* OR divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "28px 0", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "#e1e1e1" }} />
              <span style={{ fontSize: 13, color: "#999" }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "#e1e1e1" }} />
            </div>

            {/* Social login */}
            <button onClick={handleGoogleLogin}
              style={{ width: "100%", padding: "14px 0", borderRadius: 4, border: "1px solid #e1e1e1", background: "#fff", color: "#000", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button onClick={handleAppleLogin}
              style={{ width: "100%", padding: "14px 0", borderRadius: 4, border: "1px solid #e1e1e1", background: "#fff", color: "#000", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.46 15.6 3.08 9.26 7.94 8.94c1.4.08 2.38.76 3.2.72 1.83-.1 2.7-1.72 4.6-1.72 1.56.06 2.74.76 3.56.76-1.04 1.46-2.2 2.36-2.2 4.32 0 2.18 1.3 3.34 2.94 4.28-.42.96-.74 1.86-1.99 2.98zM12.6 8.7c-.16-2.2 1.82-4.02 3.72-4.16.26 2.56-2.32 4.3-3.72 4.16z"/>
              </svg>
              Continue with Apple
            </button>

            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{ color: "#666", fontSize: 15 }}>Need an account? </span>
              <span onClick={() => { setMode("signup"); setError(""); }} style={{ color: TK_DARK_BLUE, fontSize: 15, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Sign up</span>
            </div>
          </>
        )}

        {mode === "signup" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#000", margin: 0 }}>Create account</h2>
              <span style={{ fontSize: 13, color: "#666" }}>*Required</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 6 }}>Email*</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 6 }}>Password*</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={inputStyle} />
            </div>

            {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

            <button onClick={handleSignUp} disabled={!emailValid || !passwordValid || busy}
              style={{ width: "100%", padding: "16px 0", borderRadius: 4, background: emailValid && passwordValid && !busy ? TK_GREEN : "#9cb89a", color: "#fff", fontWeight: 700, fontSize: 17, border: "none", cursor: emailValid && passwordValid && !busy ? "pointer" : "default", letterSpacing: 0.5 }}>
              {busy ? "Creating..." : "Sign Up"}
            </button>

            <div style={{ textAlign: "center", marginTop: 20, marginBottom: 24 }}>
              <span style={{ color: "#666", fontSize: 15 }}>Already have an account? </span>
              <span onClick={() => { setMode("signin"); setError(""); }} style={{ color: TK_DARK_BLUE, fontSize: 15, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Sign in</span>
            </div>
          </>
        )}

        {mode === "otp" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#000", margin: "0 0 8px" }}>Verify your email</h2>
              {info && <p style={{ fontSize: 14, color: "#666", margin: 0 }}>{info}</p>}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 6 }}>Verification code*</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit code" maxLength={6}
                style={{ ...inputStyle, textAlign: "center", letterSpacing: 4, fontSize: 18 }} />
            </div>

            {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

            <button onClick={handleVerifyOtp} disabled={!otp || busy}
              style={{ width: "100%", padding: "16px 0", borderRadius: 4, background: otp && !busy ? TK_GREEN : "#9cb89a", color: "#fff", fontWeight: 700, fontSize: 17, border: "none", cursor: otp && !busy ? "pointer" : "default", letterSpacing: 0.5 }}>
              {busy ? "Verifying..." : "Verify"}
            </button>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <span onClick={() => { setMode("signin"); setError(""); }} style={{ color: TK_DARK_BLUE, fontSize: 15, fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}>Back to sign in</span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "40px 24px 30px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>
          We treat your personal data with care. Please find our Privacy Policy here.
        </p>
      </div>
    </div>
  );
}