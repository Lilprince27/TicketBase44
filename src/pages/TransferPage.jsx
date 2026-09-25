import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { buildTicketUrl } from "@/lib/ticketUtils";
import TicketekLogo from "@/components/TicketekLogo";
import AppleWalletModal from "@/components/tickets/AppleWalletModal";
import AcceptTransferForm from "@/components/tickets/AcceptTransferForm";
import TransferTicketDetail from "@/components/tickets/TransferTicketDetail";

const TK_NAVY = "#001f2d";
const TK_GREEN = "#4e783e";
const TK_YELLOW = "#EFC44B";
const TK_DARK_BLUE = "#002d5c";

export default function TransferPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [transfer, setTransfer] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState("loading"); // loading | review | auth_required | confirm | processing | accepted | declined | expired | invalid
  const [busy, setBusy] = useState(false);
  const [acceptedTickets, setAcceptedTickets] = useState([]);
  const [showWallet, setShowWallet] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // Inline login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [countdown, setCountdown] = useState(600);

  useEffect(() => {
    if (!token) { setStep("invalid"); setLoading(false); return; }
    loadTransfer();
  }, [token]);

  // Countdown timer for the auth_required step
  useEffect(() => {
    if (step !== "auth_required") return;
    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInlineLogin = async () => {
    if (!emailRegex.test(loginEmail.trim()) || loginPassword.length < 6 || loginBusy) return;
    setLoginBusy(true);
    setLoginError("");
    try {
      await base44.auth.loginViaEmailPassword(loginEmail.trim(), loginPassword);
      // After login, reload transfer to check auth status
      const me = await base44.auth.me();
      setCurrentUser(me);
      setIsAuthenticated(true);
      setLoginEmail("");
      setLoginPassword("");
      setStep("review");
    } catch (e) {
      setLoginError(e.message || "Invalid email or password. Please try again.");
    } finally {
      setLoginBusy(false);
    }
  };

  const loadTransfer = async () => {
    try {
      const list = await base44.entities.TicketTransfer.filter({ secure_token: token });
      if (list.length === 0) { setStep("invalid"); setLoading(false); return; }
      const rec = list[0];
      setTransfer(rec);
      try { setTicket(JSON.parse(rec.ticket_snapshot)); } catch { setStep("invalid"); setLoading(false); return; }

      // Check expiration
      if (rec.status === "expired" || (rec.status === "pending" && new Date(rec.expires_at) < new Date())) {
        setStep("expired"); setLoading(false); return;
      }
      if (rec.status === "accepted") { setTicket(JSON.parse(rec.ticket_snapshot)); setStep("ticket_detail"); setLoading(false); return; }
      if (rec.status === "declined") { setStep("declined"); setLoading(false); return; }
      if (rec.status === "cancelled") { setStep("invalid"); setLoading(false); return; }

      // No login required — go straight to acceptance form (skip review)
      setStep("accept");
      setLoading(false);
    } catch (e) {
      setStep("invalid");
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setStep("confirm");
  };

  const handleConfirmAccept = async () => {
    if (busy) return;
    setBusy(true);
    setStep("processing");
    try {
      // Re-fetch to check current status (prevent race conditions)
      const fresh = await base44.entities.TicketTransfer.filter({ secure_token: token });
      const rec = fresh[0];
      if (!rec) { setStep("invalid"); setBusy(false); return; }
      if (rec.status === "accepted") { setStep("accepted"); setBusy(false); return; }
      if (rec.status !== "pending") { setError("This transfer is no longer available."); setStep("invalid"); setBusy(false); return; }
      if (new Date(rec.expires_at) < new Date()) { setStep("expired"); setBusy(false); return; }

      // Parse ticket snapshot
      const ticketData = JSON.parse(rec.ticket_snapshot);

      // No login required — mark transfer as accepted using recipient email from record
      await base44.entities.TicketTransfer.update(rec.id, {
        status: "accepted",
        accepted_at: new Date().toISOString(),
      });

      // Create audit log
      try {
        await base44.entities.TransferAuditLog.create({
          transfer_id: rec.id,
          secure_token: token,
          action: "accepted",
          actor_email: rec.recipient_email,
          metadata: JSON.stringify({ order_number: ticketData.order_number }),
        });
      } catch (e) {}

      // Create ticket history
      try {
        await base44.entities.TicketHistory.create({
          ticket_id: rec.id,
          ticket_name: ticketData.event_name || "Transferred ticket",
          owner_email: rec.sender_email,
          action: "accepted",
          actor_email: rec.recipient_email,
          recipient_email: rec.recipient_email,
          details: `Ticket accepted via transfer from ${rec.sender_email}`,
        });
      } catch (e) {}

      // Notify sender
      try {
        const html = `<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #001f2d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h2 style="color: #4ade80; margin: 0 0 8px;">Ticket Transfer Accepted!</h2>
            <p style="color: #fff; font-size: 14px; margin: 0;">Your ticket has been accepted by the recipient.</p>
          </div>
          <div style="background: #fff; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="color: #333; font-size: 14px; margin: 0 0 8px;"><strong>${ticketData.event_name || "Event"}</strong></p>
            <p style="color: #666; font-size: 13px; margin: 0 0 16px;">${ticketData.venue_name || ""} · ${ticketData.event_date || ""}</p>
            <p style="color: #333; font-size: 14px; margin: 0 0 24px;">The recipient (${rec.recipient_email}) has accepted the ticket. Your ticket remains in your wallet.</p>
            <p style="color: #999; font-size: 12px; margin: 0;">Ticketek Pty Limited ABN 92 010 129 110</p>
          </div>
        </div>`;
        await base44.integrations.Core.SendEmail({
          to: rec.sender_email,
          subject: `Ticket transfer accepted: ${ticketData.event_name || "Ticket"}`,
          body: html,
        });
      } catch (e) {}

 setAcceptedTickets([ticketData]);
      setTicket(ticketData);
      setTimeout(() => setStep("ticket_detail"), 1500);
    } catch (e) {
      setError(e.message || "Could not accept the transfer. Please try again.");
      setStep("review");
    } finally {
      setBusy(false);
    }
  };

  const handleDecline = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const fresh = await base44.entities.TicketTransfer.filter({ secure_token: token });
      const rec = fresh[0];
      if (!rec) return;
      await base44.entities.TicketTransfer.update(rec.id, {
        status: "declined",
        declined_at: new Date().toISOString(),
      });
      try {
        await base44.entities.TransferAuditLog.create({
          transfer_id: rec.id,
          secure_token: token,
          action: "declined",
          actor_email: currentUser?.email || rec.recipient_email,
          metadata: "{}",
        });
      } catch (e) {}
      // Sender's ticket was never modified, so nothing to restore
      setStep("declined");
    } catch (e) {
      setError("Could not decline the transfer.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #e0e0e0", borderTopColor: TK_NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const renderTicketCard = (t) => (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e8e8e8", marginBottom: 12 }}>
      {t.event_image && <img src={t.event_image} alt={t.event_name} style={{ width: "100%", height: 140, objectFit: "cover" }} />}
      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: "0 0 6px" }}>{t.event_name}</h3>
        <p style={{ fontSize: 13, color: "#666", margin: "0 0 2px" }}>{t.event_date}</p>
        <p style={{ fontSize: 13, color: "#666", margin: "0 0 12px" }}>{t.venue_name}</p>
        <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
          <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
            <p style={{ color: "#999", margin: "0 0 2px", fontSize: 10, textTransform: "uppercase" }}>Section</p>
            <p style={{ color: "#111", fontWeight: 700, margin: 0 }}>{t.section_bay || "-"}</p>
          </div>
          <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
            <p style={{ color: "#999", margin: "0 0 2px", fontSize: 10, textTransform: "uppercase" }}>Row</p>
            <p style={{ color: "#111", fontWeight: 700, margin: 0 }}>{t.row || "-"}</p>
          </div>
          <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
            <p style={{ color: "#999", margin: "0 0 2px", fontSize: 10, textTransform: "uppercase" }}>Seat</p>
            <p style={{ color: "#111", fontWeight: 700, margin: 0 }}>{t.seat_number || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "-apple-system, system-ui, sans-serif", maxWidth: 500, margin: "0 auto" }}>
      {showWallet && <AppleWalletModal ticket={showWallet} onClose={() => setShowWallet(null)} />}

      {/* Header */}
      <div style={{ background: TK_NAVY, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none" }}><TicketekLogo size={26} variant="white" /></Link>
        <Link to="/" style={{ color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>Done</Link>
      </div>

      {/* LOADING */}
      {step === "loading" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 36, height: 36, margin: "0 auto 16px", border: "3px solid #e0e0e0", borderTopColor: TK_NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#666", fontSize: 15 }}>Loading transfer...</p>
        </div>
      )}

      {/* AUTH REQUIRED — Ticketek-style inline login (matches official design) */}
      {step === "auth_required" && (
        <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "-apple-system, system-ui, sans-serif" }}>
          {/* Navy header with logo, cart, hamburger + search bar */}
          <div style={{ background: TK_NAVY, padding: "14px 18px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <TicketekLogo size={24} variant="white" />
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
            <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 4, overflow: "hidden" }}>
              <input type="text" placeholder="Look up shows by artist, city, or venue..." readOnly
                style={{ flex: 1, padding: "10px 14px", border: "none", outline: "none", fontSize: 14, color: "#333", background: "transparent" }} />
              <div style={{ background: "#e9e9e9", padding: "10px 14px", display: "flex", alignItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Yellow countdown timer banner */}
          <div style={{ background: TK_YELLOW, padding: "10px 18px", textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#001f2d" }}>Time remaining {formatTime(countdown)}</span>
          </div>

          {/* Sign in form */}
          <div style={{ padding: "32px 24px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#000", margin: 0 }}>Sign in</h2>
              <span style={{ fontSize: 13, color: "#666" }}>*Required</span>
            </div>

            {/* Email field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 6 }}>Email*</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 4, border: "1px solid #ccc", color: "#000", fontSize: 16, outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 6 }}>Password*</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 4, border: "1px solid #ccc", color: "#000", fontSize: 16, outline: "none", boxSizing: "border-box" }} />
            </div>

            {loginError && (
              <div style={{ background: "#FFF0F0", border: "1px solid #FECACA", borderRadius: 4, padding: "12px 16px", marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: "#B91C1C", margin: 0 }}>{loginError}</p>
              </div>
            )}

            {/* Sign in button */}
            <button onClick={handleInlineLogin}
              disabled={!emailRegex.test(loginEmail.trim()) || loginPassword.length < 6 || loginBusy}
              style={{ width: "100%", padding: "16px 0", borderRadius: 4,
                background: emailRegex.test(loginEmail.trim()) && loginPassword.length >= 6 && !loginBusy ? TK_GREEN : "#9cb89a",
                color: "#fff", fontWeight: 700, fontSize: 17, border: "none",
                cursor: emailRegex.test(loginEmail.trim()) && loginPassword.length >= 6 && !loginBusy ? "pointer" : "default",
                letterSpacing: 0.5 }}>
              {loginBusy ? "Signing in..." : "Sign In"}
            </button>

            {/* Reset password link */}
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
            <button onClick={() => base44.auth.loginWithProvider("google", "/transfer/" + token)}
              style={{ width: "100%", padding: "14px 0", borderRadius: 4, border: "1px solid #e1e1e1", background: "#fff", color: "#000", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button onClick={() => base44.auth.loginWithProvider("apple", "/transfer/" + token)}
              style={{ width: "100%", padding: "14px 0", borderRadius: 4, border: "1px solid #e1e1e1", background: "#fff", color: "#000", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.46 15.6 3.08 9.26 7.94 8.94c1.4.08 2.38.76 3.2.72 1.83-.1 2.7-1.72 4.6-1.72 1.56.06 2.74.76 3.56.76-1.04 1.46-2.2 2.36-2.2 4.32 0 2.18 1.3 3.34 2.94 4.28-.42.96-.74 1.86-1.99 2.98zM12.6 8.7c-.16-2.2 1.82-4.02 3.72-4.16.26 2.56-2.32 4.3-3.72 4.16z"/>
              </svg>
              Continue with Apple
            </button>

            {/* Need an account link */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{ color: "#666", fontSize: 15 }}>Need an account? </span>
              <Link to={`/login?next=${encodeURIComponent("/transfer/" + token)}&mode=signup`}
                style={{ color: TK_DARK_BLUE, fontSize: 15, fontWeight: 600, textDecoration: "underline" }}>Sign up</Link>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "40px 24px 30px", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>
              We treat your personal data with care. Please find our Privacy Policy here.
            </p>
          </div>
        </div>
      )}

      {/* REVIEW */}
      {step === "review" && ticket && (
        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Accept Transferred Tickets</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 20px" }}>You have received {transfer?.ticket_count || 1} ticket(s) from {transfer?.sender_email}.</p>

          {renderTicketCard(ticket)}

          <div style={{ background: "#f0f4ff", borderRadius: 10, padding: 14, marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TK_NAVY} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: 13, color: "#333", margin: 0, lineHeight: 1.4 }}>Click "Accept Ticket" to open your ticket on Ticketek and add it to your wallet.</p>
          </div>

          {error && <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: "0 0 16px" }}>{error}</p>}

          <button onClick={() => setStep("accept")}
            style={{ display: "block", width: "100%", padding: "18px 0", borderRadius: 8, background: TK_GREEN, color: "#fff", fontWeight: 700, fontSize: 18, border: "none", cursor: "pointer", marginBottom: 12, boxShadow: "0 2px 8px rgba(78,120,62,0.3)", textAlign: "center" }}>Accept Ticket</button>
          <button onClick={handleDecline} disabled={busy} style={{ width: "100%", padding: "16px 0", borderRadius: 8, background: "transparent", color: "#ef4444", fontWeight: 600, fontSize: 16, border: "1px solid #ef4444", cursor: busy ? "default" : "pointer" }}>Decline</button>
        </div>
      )}

      {/* ACCEPT — Sign in / Create account page (matches official Ticketek design) */}
      {step === "accept" && ticket && (
        <AcceptTransferForm
          senderName={(transfer?.sender_email || "").split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "sender"}
          eventName={ticket.event_name || "event"}
          orderNumber={ticket.order_number}
          onAccept={handleConfirmAccept}
          busy={busy}
          redirectPath={"/transfer/" + token}
        />
      )}

      {/* PROCESSING */}
      {step === "processing" && (
        <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <TicketekLogo size={48} variant="color" />
          <div style={{ width: 40, height: 40, margin: "24px auto 16px", border: "3px solid #e0e0e0", borderTopColor: TK_NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 18, fontWeight: 600, color: "#111", margin: 0 }}>Verifying your tickets...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* TICKET DETAIL — full ticket view after acceptance, with only Apple Wallet button */}
      {step === "ticket_detail" && ticket && (
        <TransferTicketDetail ticket={ticket} onBack={() => navigate("/")} />
      )}

      {/* DECLINED */}
      {step === "declined" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Transfer Declined</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>You have declined this ticket transfer. The sender has been notified.</p>
          <Link to="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>Done</Link>
        </div>
      )}

      {/* EXPIRED */}
      {step === "expired" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#fff7e6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e6a700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Transfer Expired</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>The ticket transfer is no longer available. Please ask the sender to send the ticket again.</p>
          <Link to="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>Done</Link>
        </div>
      )}

      {/* INVALID */}
      {step === "invalid" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: "#ffeaea", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Invalid Transfer</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>{error || "This transfer link is invalid or has been cancelled."}</p>
          <Link to="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: TK_NAVY, color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>Done</Link>
        </div>
      )}
    </div>
  );
}