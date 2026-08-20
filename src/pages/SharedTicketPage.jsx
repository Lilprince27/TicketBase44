import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const YELLOW = "#F8E71C";

export default function SharedTicketPage() {
  const { token } = useParams();
  const [ticket, setTicket] = useState(null);
  const [sharedRecord, setSharedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [acceptedBy, setAcceptedBy] = useState(null);
  const [acceptError, setAcceptError] = useState("");

  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return; }
    base44.entities.SharedTicket.filter({ share_token: token }).then(list => {
      if (list.length > 0) {
        const rec = list[0];
        setSharedRecord(rec);
        try { setTicket(JSON.parse(rec.ticket_snapshot)); }
        catch { setNotFound(true); }
        if (rec.accepted_by) setAcceptedBy(rec.accepted_by);
      } else {
        setNotFound(true);
      }
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));

    base44.auth.isAuthenticated().then(isAuth => {
      if (isAuth) base44.auth.me().then(setAuthUser).catch(() => {});
      setAuthChecked(true);
    });
  }, [token]);

  const handleAccept = async () => {
    if (accepting) return;
    setAccepting(true);
    setAcceptError("");
    try {
      const me = await base44.auth.me();
      if (!me) { setAcceptError("Please log in to add this ticket to your wallet."); return; }
      const fresh = await base44.entities.SharedTicket.filter({ share_token: token });
      const rec = fresh[0];
      if (!rec) { setAcceptError("This ticket link is no longer available."); return; }
      if (rec.accepted_by) { setAcceptedBy(rec.accepted_by); return; }
      if (rec.owner_email === me.email) { setAcceptError("You can't accept your own shared ticket."); return; }
      const snap = JSON.parse(rec.ticket_snapshot);
      await base44.entities.Ticket.create({
        venue_name: snap.venue_name, presenter: snap.presenter, event_name: snap.event_name,
        event_date: snap.event_date, entry_gate: snap.entry_gate, level_stand: snap.level_stand,
        door_area: snap.door_area, section_bay: snap.section_bay, row: snap.row, seat_number: snap.seat_number,
        holder_name: snap.holder_name, ticket_type: snap.ticket_type, price: snap.price,
        event_image: snap.event_image, serial_number: snap.serial_number, pax_number: snap.pax_number,
        purchase_date: snap.purchase_date, seller_id: snap.seller_id, transaction_number: snap.transaction_number,
        event_code: snap.event_code, order_number: snap.order_number, owner_email: me.email,
      });
      await base44.entities.SharedTicket.update(rec.id, { accepted_by: me.email, accepted_date: new Date().toISOString() });
      setAcceptedBy(me.email);
    } catch (e) {
      setAcceptError("Could not add the ticket to your wallet. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  const handleLogin = () => base44.auth.redirectToLogin(window.location.pathname);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#000" }}>
        <div className="w-8 h-8 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-6 text-center" style={{ background: "#000" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#3a1a1a" }}>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Ticket not available</h2>
        <p className="text-gray-400">This secure ticket link is invalid or has been removed.</p>
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticket.serial_number || "")}`;
  const isOwner = authUser && sharedRecord && authUser.email === sharedRecord.owner_email;
  const iAccepted = acceptedBy && authUser && acceptedBy === authUser.email;
  const someoneAccepted = acceptedBy && (!authUser || acceptedBy !== authUser.email);
  const venueUpper = (ticket.venue_name || "").toUpperCase();
  const levelLabel = ticket.level_stand || "Floor Level";

  return (
    <div style={{ margin: "0 auto", background: "#000", minHeight: "100vh", fontFamily: "-apple-system, system-ui, sans-serif", maxWidth: 500, color: "#fff" }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 18px" }}>
        <Link to="/" style={{ color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>Done</Link>
      </div>

      {/* Ticket card */}
      <div style={{ margin: "0 12px 12px", background: "#121212", borderRadius: 16, overflow: "hidden" }}>
        {/* Header bar */}
        <div style={{ background: "#000", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>TICKETEK</span>
          <span style={{ color: "#fff", fontSize: 13 }}>{ticket.event_date}</span>
        </div>
        <div style={{ padding: "12px 18px 14px" }}>
          <h1 style={{ color: YELLOW, fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>{ticket.event_name}</h1>
        </div>

        {/* Event image */}
        {ticket.event_image && (
          <div style={{ width: "100%" }}>
            <img src={ticket.event_image} alt={ticket.event_name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
          </div>
        )}

        {/* Venue + level */}
        <div style={{ padding: "16px 18px 6px" }}>
          <p style={{ color: YELLOW, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, margin: "0 0 8px", textTransform: "uppercase" }}>{venueUpper}</p>
          <p style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>{levelLabel}</p>
        </div>

        {/* Three columns */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 18px 20px", gap: 8 }}>
          {[
            { label: "SECTION", val: ticket.section_bay || "-" },
            { label: "ROW/SEAT", val: `${ticket.row || "-"} / ${ticket.seat_number || "-"}` },
            { label: "DOOR/GATE", val: ticket.door_area || ticket.entry_gate || "-" },
          ].map(col => (
            <div key={col.label} style={{ flex: 1, textAlign: "center" }}>
              <span style={{ display: "block", fontSize: 10, color: "#9a9a9a", letterSpacing: 0.5, marginBottom: 4 }}>{col.label}</span>
              <strong style={{ display: "block", fontSize: 15, color: "#fff", fontWeight: 700 }}>{col.val}</strong>
            </div>
          ))}
        </div>

        {/* QR code */}
        <div style={{ padding: "0 18px 22px", display: "flex", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 14 }}>
            <img src={qrUrl} alt="QR Code" style={{ width: 180, height: 180, display: "block" }} />
          </div>
        </div>

        {/* Wallet / accept area */}
        <div style={{ padding: "0 18px 22px" }}>
          {iAccepted ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 44, height: 44, margin: "0 auto 10px", borderRadius: "50%", background: "#1f3d28", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#4ade80", margin: "0 0 4px" }}>Ticket added to your wallet</p>
              <p style={{ fontSize: 12, color: "#9a9a9a", margin: "0 0 14px" }}>Find it in the Tickets tab of your Ticketek app.</p>
              <Link to="/tickets" style={{ display: "block", textAlign: "center", padding: "14px 0", borderRadius: 12, background: "#fff", color: "#000", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>View my tickets</Link>
            </div>
          ) : someoneAccepted ? (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#fff", margin: "0 0 4px" }}>This ticket has already been added to a wallet</p>
              <p style={{ fontSize: 12, color: "#9a9a9a", margin: 0 }}>Shared tickets can only be claimed once.</p>
            </div>
          ) : isOwner ? (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#fff", margin: "0 0 4px" }}>You shared this ticket</p>
              <p style={{ fontSize: 12, color: "#9a9a9a", margin: 0 }}>Waiting for the recipient to add it to their wallet.</p>
            </div>
          ) : !authChecked ? (
            <p style={{ textAlign: "center", color: "#9a9a9a", fontSize: 13 }}>Checking your session…</p>
          ) : (
            <div>
              {acceptError && <p style={{ fontSize: 12, color: "#ef4444", textAlign: "center", margin: "0 0 10px" }}>{acceptError}</p>}
              {!authUser ? (
                <button onClick={handleLogin} style={{ width: "100%", padding: "15px 0", borderRadius: 12, background: "#fff", color: "#000", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                  Log in to add to wallet
                </button>
              ) : (
                <button onClick={handleAccept} disabled={accepting} style={{ width: "100%", padding: "15px 0", borderRadius: 12, background: accepting ? "#3a3a3a" : "#fff", color: accepting ? "#9a9a9a" : "#000", fontWeight: 700, fontSize: 16, border: "none", cursor: accepting ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {accepting ? (
                    <>
                      <span style={{ width: 16, height: 16, border: "2px solid #9a9a9a", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                      Adding…
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                      Add to Wallet
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fine print */}
      <div className="selectable-text" style={{ padding: "4px 18px 30px", fontSize: 10.5, color: "#666", lineHeight: 1.5 }}>
        <p style={{ margin: "0 0 6px" }}><strong>Ticketek Pty Limited ABN 92 010 129 110</strong></p>
        <p style={{ margin: 0 }}>Each mobile ticket has a unique barcode that allows one entry only. Do not duplicate or forward this ticket. This ticket was shared with you via a secure link{ticket.sender_name ? ` by ${ticket.sender_name}` : ""}.</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}