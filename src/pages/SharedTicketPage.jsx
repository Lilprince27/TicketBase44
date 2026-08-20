import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

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
      if (!me) { setAcceptError("Please log in to accept."); return; }
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
      setAcceptError("Could not accept the ticket. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  const handleLogin = () => base44.auth.redirectToLogin(window.location.pathname);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ticket not available</h2>
        <p className="text-gray-500">This secure ticket link is invalid or has been removed.</p>
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.serial_number || "")}`;
  const isOwner = authUser && sharedRecord && authUser.email === sharedRecord.owner_email;
  const iAccepted = acceptedBy && authUser && acceptedBy === authUser.email;
  const someoneAccepted = acceptedBy && (!authUser || acceptedBy !== authUser.email);

  return (
    <div style={{ margin: "0 auto", backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "-apple-system, system-ui, sans-serif", color: "#000", maxWidth: 500 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#003057", color: "white", padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 17l-5.5 3 1-6.3L3 9l6-.9z"/>
        </svg>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Ticketek · Secure Ticket</div>
      </div>

      <div style={{ padding: 12 }}>
        {ticket.sender_name && (
          <div style={{ background: "#eaf3fb", borderRadius: 8, padding: "12px 14px", marginBottom: 8, fontSize: 13, color: "#003057" }}>
            This ticket was shared with you by <strong>{ticket.sender_name}</strong>.
          </div>
        )}

        {ticket.event_image && (
          <div style={{ background: "white", marginBottom: 8, overflow: "hidden", borderRadius: 6 }}>
            <img src={ticket.event_image} alt={ticket.event_name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
          </div>
        )}

        <div style={{ background: "white", marginBottom: 8, padding: "30px 0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 25, padding: "0 20px" }}>
            <p style={{ fontSize: 13, color: "#777", margin: 0 }}>{ticket.venue_name}</p>
            <h1 style={{ fontSize: 24, margin: "6px 0", fontWeight: 700, letterSpacing: "-0.5px" }}>{ticket.event_name}</h1>
            <p style={{ fontSize: 13, color: "#333", margin: 0 }}>{ticket.presenter}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 25px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, width: 90, color: "#000" }}>
              <strong>{ticket.ticket_type || "Adult"}</strong><br />{ticket.price}
            </div>
            <div style={{ textAlign: "center" }}>
              <img src={qrUrl} alt="QR Code" style={{ width: 120, height: 120 }} />
              <span style={{ display: "block", fontSize: 11, marginTop: 10, color: "#000" }}>{ticket.serial_number}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, width: 90, color: "#000", textAlign: "right" }}>
              <strong>Held by</strong><br />{ticket.holder_name}
            </div>
          </div>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, marginTop: 25, color: "#000" }}>
            {ticket.event_date}
          </div>
        </div>

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
                {item.val || "-"}
              </div>
            ))}
          </div>
        </div>

        {/* Accept / wallet panel */}
        <div style={{ background: "white", borderRadius: 8, padding: "18px 18px", marginBottom: 8 }}>
          {iAccepted ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 48, height: 48, margin: "0 auto 10px", borderRadius: "50%", background: "#e6f4ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#2e7d32", margin: "0 0 4px" }}>Ticket added to your wallet</p>
              <p style={{ fontSize: 12, color: "#666", margin: "0 0 14px" }}>You can find this ticket in the Tickets tab of your Ticketek app.</p>
              <Link to="/tickets" style={{ display: "block", textAlign: "center", padding: "13px 0", borderRadius: 10, background: "#003057", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>View my tickets</Link>
            </div>
          ) : someoneAccepted ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#333", margin: "0 0 4px" }}>This ticket has already been accepted</p>
              <p style={{ fontSize: 12, color: "#777", margin: 0 }}>Shared tickets can only be claimed once.</p>
            </div>
          ) : isOwner ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#333", margin: "0 0 4px" }}>You shared this ticket</p>
              <p style={{ fontSize: 12, color: "#777", margin: 0 }}>Waiting for the recipient to accept it into their wallet.</p>
            </div>
          ) : !authChecked ? (
            <div style={{ textAlign: "center", color: "#777", fontSize: 13 }}>Checking your session…</div>
          ) : !authUser ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#003057", margin: "0 0 4px" }}>Accept this ticket</p>
              <p style={{ fontSize: 12, color: "#666", margin: "0 0 14px" }}>Log in or sign up to save this ticket to your wallet.</p>
              <button onClick={handleLogin} style={{ width: "100%", padding: "14px 0", borderRadius: 10, background: "#003057", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>Log in to accept</button>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#003057", margin: "0 0 4px" }}>Accept this ticket</p>
              <p style={{ fontSize: 12, color: "#666", margin: "0 0 14px" }}>Add it to your Tickets tab. A shared ticket can only be accepted once.</p>
              {acceptError && <p style={{ fontSize: 12, color: "#dc2626", margin: "0 0 10px" }}>{acceptError}</p>}
              <button onClick={handleAccept} disabled={accepting} style={{ width: "100%", padding: "14px 0", borderRadius: 10, background: accepting ? "#9aa9b8" : "#003057", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: accepting ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {accepting && <span style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />}
                {accepting ? "Accepting…" : "Accept ticket"}
              </button>
            </div>
          )}
        </div>

        <div className="selectable-text" style={{ background: "white", borderRadius: 6, padding: "16px 18px", fontSize: 11.5, color: "#555", lineHeight: 1.5, marginBottom: 8 }}>
          <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#003057" }}>Secure view-only ticket</p>
          <p style={{ margin: 0 }}>This ticket was shared with you via a secure link. Each mobile ticket has a unique barcode that allows one entry only. Do not duplicate or forward this ticket.</p>
        </div>

        <div className="selectable-text" style={{ padding: "8px 8px 24px", fontSize: "10.5px", color: "#777", lineHeight: 1.4 }}>
          <p><strong>Ticketek Pty Limited ABN 92 010 129 110</strong></p>
          <p>Do not buy a mobile ticket except from Ticketek's website, mobile site, call centre or agencies. If there are multiple copies of a mobile ticket, only the 1st copy to be scanned on arrival will allow entry.</p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}