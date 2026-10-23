import { useEffect } from "react";
import TicketekLogo from "../TicketekLogo";

const TK_NAVY = "#001f2d";
const TK_GOLD = "#EFC44B";

function isTestTicketRecord(ticket) {
  if (!ticket) return false;
  if (ticket.is_test === true || ticket.test === true || ticket.test_record === true || ticket.demo === true) {
    return true;
  }
  const combined = `${ticket.event_name || ""} ${ticket.venue_name || ""} ${ticket.holder_name || ""} ${ticket.order_number || ""}`.toLowerCase();
  return combined.includes("test") || combined.includes("demo");
}

export function launchTicketekAppOrFallback(ticket) {
  const fallbackWebUrl = "https://premier.ticketek.com.au";
  const universalAppUrl = ticket?.order_number
    ? `https://ticketek.mobi/?id=${encodeURIComponent(ticket.order_number)}`
    : "https://premier.ticketek.com.au";
  const customSchemeUrl = "ticketek://";

  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

  if (isMobile) {
    const start = Date.now();
    // Attempt custom scheme to wake native Ticketek app if installed
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = customSchemeUrl;
    document.body.appendChild(iframe);

    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch {}
      // If user is still on page and app didn't foreground, open universal link / official Ticketek web fallback
      if (document.visibilityState !== "hidden" && Date.now() - start < 1500) {
        window.location.href = universalAppUrl || fallbackWebUrl;
      }
    }, 450);
  } else {
    window.location.href = fallbackWebUrl;
  }
}

export default function TicketDoneAnimationModal({ ticket, onComplete }) {
  const isTest = isTestTicketRecord(ticket);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
      launchTicketekAppOrFallback(ticket);
    }, 1000);
    return () => clearTimeout(timer);
  }, [ticket, onComplete]);

  if (!ticket) return null;

  const section = ticket.section_bay || ticket.level_stand || "-";
  const row = ticket.row || "-";
  const seat = ticket.seat_number || "-";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "rgba(0, 31, 45, 0.92)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <style>{`
        @keyframes tkTicketInOut {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.92);
          }
          22% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          76% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-18px) scale(0.96);
          }
        }
        @keyframes tkCheckPulse {
          0% { transform: scale(0.7); opacity: 0; }
          30% { transform: scale(1.08); opacity: 1; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 350,
          backgroundColor: "#ffffff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
          animation: "tkTicketInOut 1000ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
          position: "relative",
        }}
      >
        {/* Top navy ticket band */}
        <div
          style={{
            backgroundColor: TK_NAVY,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `3px solid ${TK_GOLD}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TicketekLogo size={20} variant="white" />
            <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>
              TICKETEK
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              backgroundColor: "rgba(74, 222, 128, 0.16)",
              padding: "3px 9px",
              borderRadius: 999,
              animation: "tkCheckPulse 1000ms ease-out forwards",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700 }}>
              Ticket Ready
            </span>
          </div>
        </div>

        {/* Optional TEST DEMONSTRATION badge */}
        {isTest && (
          <div
            style={{
              backgroundColor: "#fef3c7",
              borderBottom: "1px solid #fde68a",
              padding: "4px 12px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 1.1,
                color: "#92400e",
                textTransform: "uppercase",
              }}
            >
              TEST DEMONSTRATION
            </span>
          </div>
        )}

        {/* Ticket Body */}
        <div style={{ padding: "18px 20px 16px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#666666", margin: "0 0 4px", fontWeight: 500 }}>
            {ticket.venue_name || "Venue"}
          </p>
          <h3
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: "#111111",
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}
          >
            {ticket.event_name || "Event"}
          </h3>
          <p style={{ fontSize: 13, fontWeight: 700, color: TK_NAVY, margin: "0 0 16px" }}>
            {ticket.event_date || ""}
          </p>

          {/* Perforated divider with side notches */}
          <div style={{ position: "relative", margin: "0 -20px 14px", display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "rgba(0, 31, 45, 0.92)",
                marginLeft: -8,
              }}
            />
            <div style={{ flex: 1, borderTop: "1.5px dashed #d1d5db", margin: "0 6px" }} />
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "rgba(0, 31, 45, 0.92)",
                marginRight: -8,
              }}
            />
          </div>

          {/* Seat Info Row */}
          <div style={{ display: "flex", justifyContent: "space-around", gap: 8 }}>
            <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: 8, padding: "8px 6px" }}>
              <span style={{ display: "block", fontSize: 10, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>
                Section
              </span>
              <strong style={{ display: "block", fontSize: 15, color: "#0f172a", marginTop: 2 }}>
                {section}
              </strong>
            </div>
            <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: 8, padding: "8px 6px" }}>
              <span style={{ display: "block", fontSize: 10, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>
                Row
              </span>
              <strong style={{ display: "block", fontSize: 15, color: "#0f172a", marginTop: 2 }}>
                {row}
              </strong>
            </div>
            <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: 8, padding: "8px 6px" }}>
              <span style={{ display: "block", fontSize: 10, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>
                Seat
              </span>
              <strong style={{ display: "block", fontSize: 15, color: "#0f172a", marginTop: 2 }}>
                {seat}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}