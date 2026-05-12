import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppleWalletModal from "../components/tickets/AppleWalletModal";

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWallet, setShowWallet] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContact, setShareContact] = useState("");
  const [shareName, setShareName] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shareResult, setShareResult] = useState(null);

  useEffect(() => {
    async function load() {
      const tickets = await base44.entities.Ticket.filter({ id });
      if (tickets.length > 0) setTicket(tickets[0]);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Ticket not found
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket.serial_number}`;

  const handleShareTicket = async () => {
    if (!shareContact.trim() || !shareName.trim()) return;
    setSharing(true);
    const me = await base44.auth.me().catch(() => null);
    const senderName = me?.full_name || me?.email || "Someone";
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e1e8ed; }
        .header img { width: 100%; height: auto; display: block; }
        .content { padding: 35px; color: #1a1a1b; line-height: 1.6; }
        .headline { font-size: 22px; font-weight: 800; color: #05162a; margin-bottom: 10px; }
        .event-card { background-color: #f8fafc; border: 1px solid #edf2f7; border-left: 5px solid #00aced; padding: 20px; margin: 25px 0; border-radius: 4px; }
        .event-name { font-size: 19px; font-weight: 800; color: #05162a; margin-bottom: 8px; text-transform: uppercase; }
        .event-meta { font-size: 14px; color: #4a5568; }
        .cta-container { text-align: center; margin: 35px 0; }
        .accept-button { background-color: #00aced; color: #ffffff; padding: 18px 45px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; }
        .expiry-alert { font-size: 13px; color: #c53030; background-color: #fff5f5; border: 1px solid #feb2b2; padding: 12px; border-radius: 6px; text-align: center; margin-top: 20px; }
        .footer { background-color: #f4f7f9; padding: 25px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; }
        .footer-links a { color: #00aced; text-decoration: none; margin: 0 5px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header"><img src="https://www.image2url.com/r2/default/images/1777756287942-dbc8bdd0-7c09-4eac-accf-60a99708c6e1.jpeg" alt="Ticketek Header" /></div>
        <div class="content">
            <div class="headline">Great news! You've got tickets.</div>
            <p>Hi ${shareName},</p>
            <p><strong>${senderName}</strong> has just transferred <strong>1</strong> mobile ticket(s) to you for your upcoming event.</p>
            <div class="event-card">
                <div class="event-name">${ticket.event_name}</div>
                <div class="event-meta">
                    <strong>Date:</strong> ${ticket.event_date}<br>
                    <strong>Venue:</strong> ${ticket.venue_name}<br>
                    <strong>Section:</strong> ${ticket.section_bay || "-"}, <strong>Row:</strong> ${ticket.row || "-"}
                </div>
            </div>
            <p>To claim these tickets and add them to your digital wallet, please click the button below.</p>
            <div class="cta-container"><a href="https://ticketek.mobi" class="accept-button">ACCEPT TICKETS</a></div>
            <div class="expiry-alert"><strong>Hurry!</strong> This transfer offer expires in <strong>48 hours</strong>.</div>
        </div>
        <div class="footer">
            Ticketek Pty Ltd | Level 3, 175 Liverpool St, Sydney NSW 2000<br>
            This is an automated message. Please do not reply to this email.
            <div class="footer-links"><a href="#">Help Centre</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a></div>
        </div>
    </div>
</body>
</html>`;

    try {
      await base44.integrations.Core.SendEmail({
        to: shareContact.trim(),
        subject: `Action Required: ${senderName} shared 1 ticket(s) with you for ${ticket.event_name}`,
        body: emailHtml,
      });
      setShareResult("success");
      setTimeout(() => {
        setShowShareModal(false);
        setShareContact("");
        setShareName("");
        setShareResult(null);
      }, 1500);
    } catch (e) {
      setShareResult("error");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div style={{ margin: "0 auto", backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "-apple-system, system-ui, sans-serif", color: "#000", maxWidth: 500 }}>
      {showWallet && <AppleWalletModal ticket={ticket} onClose={() => setShowWallet(false)} />}

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "white", height: 55, display: "flex", alignItems: "center", borderBottom: "1px solid #ddd" }}>
        <button onClick={() => navigate("/tickets")} style={{ padding: "0 15px", background: "none", border: "none", cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div style={{ flex: 1, textAlign: "center", fontWeight: 500, fontSize: 18, marginRight: 45 }}>Ticket</div>
      </div>

      <div style={{ padding: 12 }}>
        {/* Top card */}
        <div style={{ background: "white", marginBottom: 8, padding: "30px 0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 25 }}>
            <p style={{ fontSize: 13, color: "#777", margin: 0 }}>{ticket.venue_name}</p>
            <h1 style={{ fontSize: 26, margin: "6px 0", fontWeight: 700, letterSpacing: "-0.5px" }}>{ticket.event_name}</h1>
            <p style={{ fontSize: 13, color: "#333", margin: 0 }}>{ticket.presenter}</p>
          </div>

          {ticket.barcode_locked ? (
            /* Locked barcode — centered */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#000" }}>
                  <strong>{ticket.ticket_type || "Adult"}</strong><br />{ticket.price}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#000", textAlign: "right" }}>
                  <strong>Held by</strong><br />{ticket.holder_name}
                </div>
              </div>
              <div style={{ position: "relative", width: 110, height: 110, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src={qrUrl} alt="QR" style={{ width: "100%", height: "100%" }} />
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.5)", backdropFilter: "blur(2px)" }} />
                <div style={{ position: "absolute", zIndex: 10 }}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="#000033">
                    <path d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm3 8H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: 11, marginTop: 10, color: "#000", textAlign: "center" }}>
                {ticket.auth_message || "This ticket will be unlocked prior to the event"}
              </span>
            </div>
          ) : (
            /* Unlocked — normal layout */
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 25px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, width: 90, color: "#000" }}>
                <strong>{ticket.ticket_type || "Adult"}</strong><br />{ticket.price}
              </div>
              <div style={{ textAlign: "center" }}>
                <img src={qrUrl} alt="QR Code" style={{ width: 95, height: 95 }} />
                <span style={{ display: "block", fontSize: 11, marginTop: 10, color: "#000" }}>{ticket.serial_number}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, width: 90, color: "#000", textAlign: "right" }}>
                <strong>Held by</strong><br />{ticket.holder_name}
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, marginTop: 25, color: "#000" }}>
            {ticket.event_date}
          </div>
        </div>

        {/* Bottom card */}
        <div style={{ background: "white", marginBottom: 8, padding: "20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: 30 }}>
            {[
              { label: "Enter Via Door", val: ticket.door_area || "-" },
              { label: "Section", val: ticket.section_bay || "-" },
              { label: "Row", val: ticket.row || "-" },
              { label: "Seat", val: ticket.seat_number || "-" },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <span style={{ fontSize: 10, color: "#000", textTransform: "uppercase", display: "block" }}>{item.label}</span>
                <strong style={{ display: "block", fontSize: 17, marginTop: 4, color: "#000" }}>{item.val}</strong>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            {[
              { label: "Event", val: ticket.event_code },
              { label: "Trans No.", val: ticket.transaction_number },
              { label: "Purchased", val: ticket.purchase_date },
              { label: "Seller", val: ticket.seller_id },
              { label: "Pax No.", val: ticket.pax_number },
            ].map(item => (
              <div key={item.label} style={{ fontSize: "9.5px", color: "#000", fontWeight: 500 }}>
                <span style={{ fontSize: 10, color: "#000", textTransform: "uppercase", display: "block" }}>{item.label}</span>
                {item.val}
              </div>
            ))}
          </div>
        </div>

        {/* Share button */}
        <button
          onClick={() => setShowShareModal(true)}
          style={{ backgroundColor: "#43822a", color: "white", width: "100%", border: "none", padding: "12px", fontSize: 17, borderRadius: 4, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" }}
        >
          <svg style={{ width: 32, height: 32 }} viewBox="0 0 100 100">
            <circle cx="42" cy="32" r="14" fill="white" />
            <path d="M15 85 Q15 58 42 58 Q69 58 69 85" fill="white" />
            <rect x="58" y="65" width="28" height="20" rx="3" fill="white" stroke="#43822a" strokeWidth="2" />
            <line x1="64" y1="75" x2="80" y2="75" stroke="#43822a" strokeWidth="2.5" />
          </svg>
          Share ticket
        </button>

        {/* Apple Wallet button */}
        <button
          onClick={() => setShowWallet(true)}
          style={{ backgroundColor: "black", color: "white", width: "100%", border: "none", padding: "8px", fontSize: 16, borderRadius: 6, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}
        >
          <img src="https://www.image2url.com/r2/default/images/1777758037946-fd4ad460-0bfd-4c21-9c8f-3949e32a0c92.jpeg" alt="Wallet Icon" style={{ height: 32 }} />
          Add to Apple Wallet
        </button>

        {/* Fine print */}
        <div style={{ padding: "25px 8px", fontSize: "10.5px", color: "#777", lineHeight: 1.4 }}>
          <p><strong>Ticketek Pty Limited ABN 92 010 129 110</strong></p>
          <p>Each mobile ticket has a unique bar code. This bar code allows one entry only so please ensure that each individual attending the event has his or her own mobile ticket.</p>
          <p>Do not give a copy of your mobile ticket to anyone and do not buy a mobile ticket except from Ticketek's website, mobile site, call centre or agencies. If there are multiple copies of a mobile ticket, only the 1st copy to be scanned on arrival at the event will allow the ticket holder entry. Additional copies will fail the scanning process and will not be granted entry.</p>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowShareModal(false)}
        >
          <div className="w-full max-w-[500px] bg-white rounded-t-2xl pb-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 pt-6 pb-4 border-b border-gray-200">
              <div>
                <div className="font-bold text-gray-800 text-base">Share ticket – Seat {ticket.seat_number}</div>
                <div className="text-sm text-gray-400 mt-0.5">Recipient will receive an email invitation</div>
              </div>
            </div>
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3.5 mb-3 bg-white">
                <input
                  type="text"
                  placeholder="Enter recipient email"
                  value={shareContact}
                  onChange={e => setShareContact(e.target.value)}
                  className="flex-1 text-base text-gray-700 outline-none bg-transparent placeholder-gray-400"
                />
              </div>
              <div className="border border-gray-300 rounded-xl px-4 py-3.5 mb-4 bg-white">
                <input
                  type="text"
                  placeholder="Recipient name"
                  value={shareName}
                  onChange={e => setShareName(e.target.value)}
                  className="w-full text-base text-gray-700 outline-none bg-transparent placeholder-gray-400"
                />
              </div>
              <p className="text-sm text-gray-400 text-center px-2 mb-4 leading-relaxed">
                By entering this information you agree that you have the receiver's consent to do so.
              </p>
              <div className="border-t border-gray-200 mb-4" />
              {shareResult === "success" && (
                <div className="text-center text-green-600 font-semibold py-2 mb-2">✓ Email sent successfully!</div>
              )}
              {shareResult === "error" && (
                <div className="text-center text-red-500 text-sm py-2 mb-2">Failed to send email. Please try again.</div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowShareModal(false); setShareContact(""); setShareName(""); setShareResult(null); }}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold text-base cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareTicket}
                  disabled={!shareContact.trim() || !shareName.trim() || sharing}
                  className="flex-1 py-3.5 rounded-xl text-white font-semibold text-base border-none cursor-pointer"
                  style={{ backgroundColor: shareContact.trim() && shareName.trim() ? "#43822a" : "#d1d5db" }}
                >
                  {sharing ? "Sending..." : "Share ticket"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}