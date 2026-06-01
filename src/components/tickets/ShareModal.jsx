import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

function ShareFeeModal({ fee, onCancel }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6 text-2xl font-medium">$</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Share Processing Fee</h2>
        <p className="text-gray-500 text-sm mb-5">A processing fee is required to share 1 ticket.</p>
        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <div className="text-sm text-gray-400 font-medium mb-2">Share Fee</div>
          <div className="text-4xl font-semibold text-gray-900 mb-3" style={{ letterSpacing: "-0.02em" }}>{fee}</div>
          <p className="text-xs text-gray-400">This fee covers secure ticket verification and share processing. It is non-refundable.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm cursor-pointer border-none">Cancel</button>
          <button className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-medium text-sm cursor-pointer border-none">Pay {fee}</button>
        </div>
      </div>
    </div>
  );
}

function ServiceUnavailableModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <div className="bg-gray-100 rounded-3xl w-full max-w-md p-10 text-center shadow-2xl">
        <div className="flex justify-center mb-7">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Share Service Unavailable</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">The Ticketek ticket transfer service is temporarily unavailable due to scheduled maintenance. Please try again later.</p>
        <div className="text-gray-400 text-sm mb-7">Error Code: Error 0011</div>
        <button onClick={onClose} className="px-11 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm cursor-pointer border-none">OK</button>
      </div>
    </div>
  );
}

function NotAvailableModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <div className="bg-gray-100 rounded-3xl w-full max-w-md p-10 text-center shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 text-red-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tickets Locked</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">Barcodes may remain locked until approximately 48 hours before the event. Tickets cannot be added to a mobile wallet or shared until they are unlocked.</p>
        <button onClick={onClose} className="px-11 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm cursor-pointer border-none">Got It</button>
      </div>
    </div>
  );
}

const TicketShareIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(12, 12) scale(0.85) translate(-12, -12) rotate(-45 12 12)">
      <path d="M 5 7 H 19 V 10 C 16.5 10 16.5 14 19 14 V 17 H 5 V 14 C 7.5 14 7.5 10 5 10 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter"/>
    </g>
    <g transform="translate(3.5, 3.5)">
      <circle cx="5" cy="5" r="4.5" fill="#ffffff"/>
      <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M 3.6 6.4 L 5.2 4.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <polygon points="4.2,3.2 7.0,3.2 7.0,6.0" fill="currentColor"/>
    </g>
  </svg>
);

export default function ShareModal({ ticket, onClose }) {
  const [shareContact, setShareContact] = useState("");
  const [shareName, setShareName] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shareResult, setShareResult] = useState(null);
  const [shareMode, setShareMode] = useState("normal");
  const [shareFee, setShareFee] = useState("");
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [showNotAvailable, setShowNotAvailable] = useState(false);

  useEffect(() => {
    base44.entities.ShareSettings.list().then(list => {
      if (list.length > 0) {
        setShareMode(list[0].mode || "normal");
        setShareFee(list[0].share_fee || "");
      }
    }).catch(() => {});
  }, []);

  const handleShare = async () => {
    if (shareMode === "require_fee") { setShowFeeModal(true); return; }
    if (shareMode === "service_unavailable") { setShowUnavailable(true); return; }
    if (shareMode === "not_available") { setShowNotAvailable(true); return; }

    if (!shareContact.trim() || !shareName.trim()) return;
    setSharing(true);
    const me = await base44.auth.me().catch(() => null);
    const senderName = me?.full_name || me?.email || "Someone";
    const emailHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#f4f7f9;margin:0;padding:0}.wrapper{max-width:600px;margin:20px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1);border:1px solid #e1e8ed}.header img{width:100%;height:auto;display:block}.content{padding:35px;color:#1a1a1b;line-height:1.6}.headline{font-size:22px;font-weight:800;color:#05162a;margin-bottom:10px}.event-card{background:#f8fafc;border:1px solid #edf2f7;border-left:5px solid #00aced;padding:20px;margin:25px 0;border-radius:4px}.event-name{font-size:19px;font-weight:800;color:#05162a;margin-bottom:8px;text-transform:uppercase}.event-meta{font-size:14px;color:#4a5568}.cta-container{text-align:center;margin:35px 0}.accept-button{background-color:#00aced;color:#fff;padding:18px 45px;text-decoration:none;border-radius:50px;font-weight:bold;font-size:16px;display:inline-block}.expiry-alert{font-size:13px;color:#c53030;background-color:#fff5f5;border:1px solid #feb2b2;padding:12px;border-radius:6px;text-align:center;margin-top:20px}.footer{background:#f4f7f9;padding:25px;text-align:center;font-size:12px;color:#718096;border-top:1px solid #e2e8f0}.footer-links a{color:#00aced;text-decoration:none;margin:0 5px}</style></head><body><div class="wrapper"><div class="header"><img src="https://www.image2url.com/r2/default/images/1777756287942-dbc8bdd0-7c09-4eac-accf-60a99708c6e1.jpeg" alt="Ticketek Header"/></div><div class="content"><div class="headline">Great news! You've got tickets.</div><p>Hi ${shareName},</p><p><strong>${senderName}</strong> has just transferred <strong>1</strong> mobile ticket(s) to you for your upcoming event.</p><div class="event-card"><div class="event-name">${ticket.event_name}</div><div class="event-meta"><strong>Date:</strong> ${ticket.event_date}<br><strong>Venue:</strong> ${ticket.venue_name}<br><strong>Section:</strong> ${ticket.section_bay||"-"}, <strong>Row:</strong> ${ticket.row||"-"}</div></div><p>To claim these tickets and add them to your digital wallet, please click the button below.</p><div class="cta-container"><a href="https://ticketek.mobi" class="accept-button">ACCEPT TICKETS</a></div><div class="expiry-alert"><strong>Hurry!</strong> This transfer offer expires in <strong>48 hours</strong>.</div></div><div class="footer">Ticketek Pty Ltd | Level 3, 175 Liverpool St, Sydney NSW 2000<br>This is an automated message. Please do not reply to this email.<div class="footer-links"><a href="#">Help Centre</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a></div></div></div></body></html>`;
    try {
      await base44.integrations.Core.SendEmail({
        to: shareContact.trim(),
        subject: `Action Required: ${senderName} shared 1 ticket(s) with you for ${ticket.event_name}`,
        body: emailHtml,
      });
      setShareResult("success");
      setTimeout(() => { onClose(); }, 1500);
    } catch (e) {
      setShareResult("error");
    } finally {
      setSharing(false);
    }
  };

  if (showFeeModal) return <ShareFeeModal fee={shareFee || "£0.00"} onCancel={() => setShowFeeModal(false)} />;
  if (showUnavailable) return <ServiceUnavailableModal onClose={() => setShowUnavailable(false)} />;
  if (showNotAvailable) return <NotAvailableModal onClose={() => setShowNotAvailable(false)} />;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-xl p-5" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="text-gray-800 mt-0.5 flex-shrink-0"><TicketShareIcon /></div>
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-0.5" style={{ letterSpacing: "-0.2px" }}>Share ticket – Seat {ticket.seat_number}</h2>
            <p className="text-sm text-gray-500">Securely share tickets. <a href="#" className="text-blue-500 no-underline">How it works</a></p>
          </div>
        </div>
        <hr className="border-gray-200 -mx-5 mb-5" />
        {/* Inputs */}
        <div className="flex items-center border border-gray-300 rounded-md px-3 mb-3 bg-white">
          <input type="email" placeholder="Enter recipient email" value={shareContact} onChange={e => setShareContact(e.target.value)}
            className="flex-1 py-3 text-base text-gray-700 outline-none bg-transparent placeholder-gray-400" />
        </div>
        <div className="border border-gray-300 rounded-md px-3 mb-3 bg-white">
          <input type="text" placeholder="Recipient name" value={shareName} onChange={e => setShareName(e.target.value)}
            className="w-full py-3 text-base text-gray-700 outline-none bg-transparent placeholder-gray-400" />
        </div>
        <p className="text-xs text-gray-500 text-center px-2 mb-4 leading-relaxed">By entering this information you agree that you have the receiver's consent to do so.</p>
        <hr className="border-gray-200 mb-4" />
        {shareResult === "success" && <div className="text-center text-green-600 font-semibold py-2 mb-2">✓ Email sent!</div>}
        {shareResult === "error" && <div className="text-center text-red-500 text-sm py-2 mb-2">Failed. Please try again.</div>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-md border border-gray-200 bg-white text-blue-700 font-medium text-base cursor-pointer">Cancel</button>
          <button onClick={handleShare} disabled={!shareContact.trim() || !shareName.trim() || sharing}
            className="flex-1 py-3 rounded-md text-white font-medium text-base border-none cursor-pointer"
            style={{ backgroundColor: shareContact.trim() && shareName.trim() ? "#43822a" : "#d1d5db" }}>
            {sharing ? "Sending..." : "Share ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}