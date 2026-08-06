import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { generateTicketPdf } from "@/lib/ticketPdf";

function makeToken() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < 32; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function SendTicketModal({ ticket, onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.auth.me().then(me => {
      base44.entities.UserProfile.filter({ user_email: me.email }).then(p => {
        const disp = p[0]?.first_name
          ? `${p[0].first_name}${p[0].last_name ? " " + p[0].last_name : ""}`
          : (me.display_name || me.full_name || me.email);
        setSenderName(disp);
      }).catch(() => setSenderName(me.display_name || me.full_name || me.email));
    }).catch(() => {});
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = emailRegex.test(email.trim());

  const handleSend = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    try {
      const me = await base44.auth.me();
      const token = makeToken();
      const url = `${window.location.origin}/shared-ticket/${token}`;
      const snapshot = JSON.stringify({
        event_name: ticket.event_name, venue_name: ticket.venue_name, presenter: ticket.presenter,
        event_date: ticket.event_date, entry_gate: ticket.entry_gate, level_stand: ticket.level_stand,
        door_area: ticket.door_area, section_bay: ticket.section_bay, row: ticket.row, seat_number: ticket.seat_number,
        holder_name: ticket.holder_name, ticket_type: ticket.ticket_type, price: ticket.price,
        serial_number: ticket.serial_number, order_number: ticket.order_number, event_code: ticket.event_code,
        transaction_number: ticket.transaction_number, purchase_date: ticket.purchase_date, seller_id: ticket.seller_id,
        pax_number: ticket.pax_number, event_image: ticket.event_image, sender_name: senderName,
      });
      await base44.entities.SharedTicket.create({
        share_token: token,
        ticket_snapshot: snapshot,
        owner_email: me.email,
        event_image: ticket.event_image || "",
      });

      const doc = generateTicketPdf(ticket, url);
      const safeName = (ticket.event_name || "ticket").replace(/[^a-z0-9]/gi, "_");
      const pdfBlob = doc.output("blob");
      const file = new File([pdfBlob], `Ticket-${safeName}.pdf`, { type: "application/pdf" });

      const subject = `A ticket has been sent to you: ${ticket.event_name || "Event"}`;
      const body = `Hi ${name.trim() || "there"},\n\n${senderName} sent you a ticket for ${ticket.event_name || "an event"}${ticket.event_date ? ` on ${ticket.event_date}` : ""}${ticket.venue_name ? ` at ${ticket.venue_name}` : ""}.\n\nOpen your secure ticket here:\n${url}\n\nA PDF copy is attached.\n\n— Ticketek`;

      setShareUrl(url);

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: subject, text: body });
          setDone(true);
        } catch (e) {
          if (e && e.name === "AbortError") return; // user dismissed the sheet — keep modal open
          throw e;
        }
      } else {
        // Fallback: download the PDF, then open the user's email client pre-filled
        doc.save(`Ticket-${safeName}.pdf`);
        window.location.href = `mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setDone(true);
      }
    } catch (e) {
      console.error(e);
      setError("Could not send the ticket. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const overlayStyle = { background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center" style={overlayStyle} onClick={onClose}>
      <div className="bg-white w-full max-w-[500px] rounded-t-xl px-5 pt-6 pb-9 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]" onClick={e => e.stopPropagation()}>
        {done ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ticket sent!</h3>
            <p className="text-sm text-gray-500 mb-5">The ticket has been handed to your email or share sheet. A PDF copy and the secure link are ready for the recipient.</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 mb-5">
              <span className="flex-1 text-xs text-gray-700 break-all text-left">{shareUrl}</span>
              <button onClick={handleCopy} className="flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold text-white border-none cursor-pointer" style={{ backgroundColor: "#003057" }}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <button onClick={onClose} className="w-full py-4 rounded-xl font-bold text-white border-none cursor-pointer" style={{ backgroundColor: "#003057" }}>Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Send ticket to email</h2>
                <p className="text-sm text-gray-500 mt-1">Deliver a secure PDF + link to any email address — registered or not. No ownership transfer.</p>
              </div>
            </div>

            <div className="mb-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Recipient email address"
                className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base outline-none text-gray-800 placeholder-gray-400" />
            </div>
            <div className="mb-4">
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Recipient name (optional)"
                className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base outline-none text-gray-800 placeholder-gray-400" />
            </div>

            {error && <p className="text-sm text-red-500 text-center mb-3">{error}</p>}

            <p className="text-sm text-gray-400 text-center my-5 px-2">
              We'll generate a secure view-only link and a PDF, then open your share/email sheet to send it.
            </p>

            <div className="flex gap-3">
              <button onClick={onClose} disabled={busy}
                className="flex-1 py-4 rounded-lg font-semibold text-base border border-gray-200 bg-white cursor-pointer disabled:opacity-50" style={{ color: "#003057" }}>Cancel</button>
              <button onClick={handleSend} disabled={!valid || busy}
                className="flex-1 py-4 rounded-lg font-semibold text-base border-none transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{ backgroundColor: valid && !busy ? "#003057" : "#e8e8e8", color: valid && !busy ? "white" : "#9ca3af" }}>
                {busy ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Preparing...
                  </>
                ) : "Send ticket"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}