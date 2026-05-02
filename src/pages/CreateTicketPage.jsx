import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  generateSerialNumber,
  generatePaxNumber,
  generateTransactionNumber,
  generateSellerId,
  generatePurchaseDate,
  generateEventCode,
  generateOrderNumber,
} from "../lib/ticketUtils";

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [recipientEmail, setRecipientEmail] = useState("");
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [seats, setSeats] = useState([{ row: "", seat_number: "" }]);
  const [barcodeLocked, setBarcodeLocked] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [marketplaceNotice, setMarketplaceNotice] = useState(false);

  // Email pricing fields

  const [emailPricing, setEmailPricing] = useState({
    ticket_item_price: "",
    sub_total: "",
    refundable_fee: "",
    service_fee: "",
    total: "",
  });

  const urlParams = new URLSearchParams(window.location.search);

  const [form, setForm] = useState({
    venue_name: urlParams.get("venue_name") || "",
    presenter: "",
    event_name: urlParams.get("event_name") || "",
    event_date: urlParams.get("event_date") || "",
    entry_gate: "",
    level_stand: "",
    door_area: "",
    section_bay: "",
    row: "",
    seat_number: "",
    holder_name: "",
    ticket_type: "",
    price: "",
  });

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me();
      setUser(me);
      const subs = await base44.entities.Subscription.filter({ user_email: me.email, status: "active" });
      const activeSub = subs.find((s) => new Date(s.end_date) > new Date());
      setSubscription(activeSub || null);
      if (me.role === "admin") setSubscription({ bypass: true });
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const handlePricingChange = (field, value) => setEmailPricing(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const sendConfirmationEmail = async (ticket, me, orderNumber) => {
    const emailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Ticketek Purchase Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center">
<table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">
  <tr><td bgcolor="#333333" style="padding:8px 15px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
      <td align="left" style="color:#fff;font-size:11px;font-family:Arial,sans-serif;">Ticketek purchase confirmation<br/><a href="#" style="color:#fff;text-decoration:underline;">Add to safe list</a> | <a href="#" style="color:#fff;text-decoration:underline;">Order History</a></td>
      <td align="right" style="color:#fff;font-size:11px;font-family:Arial,sans-serif;">Follow us on <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png" width="18" height="18" style="display:inline-block;vertical-align:middle;margin-left:4px;" /> <img src="https://img.icons8.com/ios-filled/50/ffffff/twitter.png" width="18" height="18" style="display:inline-block;vertical-align:middle;margin-left:4px;" /></td>
    </tr></table>
  </td></tr>
  <tr><td bgcolor="#002142" style="padding:15px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
      <td align="left" valign="middle"><table border="0" cellpadding="0" cellspacing="0"><tr>
        <td style="padding-right:8px;"><img src="https://image2url.com/r2/default/images/1775950793367-1b297377-3a0d-4320-985a-ef09fa17d83a.jpeg" width="30" alt="Logo" /></td>
        <td style="color:#fff;font-size:28px;font-weight:900;letter-spacing:-1px;font-family:Arial Black,sans-serif;">TICKETEK</td>
      </tr></table></td>
      <td align="right" valign="middle" style="color:#fff;font-size:18px;font-weight:bold;font-family:Arial,sans-serif;">Purchase Confirmation</td>
    </tr></table>
  </td></tr>
  <tr><td bgcolor="#ffffff" style="padding:30px 20px;">
    <h2 style="font-size:18px;font-weight:bold;margin:0 0 15px 0;color:#000;font-family:Arial,sans-serif;">THANK YOU FOR YOUR ORDER</h2>
    <div style="font-size:13px;color:#333;margin-bottom:20px;">Customer ID: ${orderNumber}</div>
    <p style="font-size:13px;line-height:1.6;color:#000;margin-bottom:25px;">Hi ${me.full_name || me.email},<br/><br/>Now you've bought your tickets please make sure you read this email as it contains <u>important information</u> about how to access your tickets and tips to ensure you have a great event day.</p>
    <div style="border-bottom:2px solid #000;font-weight:bold;font-size:15px;padding-bottom:5px;margin-bottom:15px;color:#000;">YOUR TICKETS</div>
    <div style="font-size:14px;margin-bottom:10px;line-height:1.4;">
      <strong>${ticket.event_name}</strong><br/>
      ${ticket.event_date}<br/>
      ${ticket.venue_name}
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size:13px;font-family:Arial,sans-serif;border-top:1px solid #ddd;padding-top:10px;margin-top:15px;">
      <tr><td style="padding:5px 0;color:#000;">Section:</td><td align="right" style="padding:5px 0;color:#000;">${ticket.section_bay || "-"}</td></tr>
      <tr><td style="padding:5px 0;color:#000;">Seat:</td><td align="right" style="padding:5px 0;color:#000;">${ticket.seat_number} Admit: 1</td></tr>
    </table>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size:13px;font-family:Arial,sans-serif;margin-top:15px;">
      <tr><td style="padding:5px 0;border-top:1px solid #ddd;">Order No.</td><td align="right" style="padding:5px 0;border-top:1px solid #ddd;">${orderNumber}</td></tr>
      <tr><td style="padding:5px 0;">Ticket/item price</td><td align="right" style="padding:5px 0;">${emailPricing.ticket_item_price}</td></tr>
      <tr><td style="padding:5px 0;">Sub-total</td><td align="right" style="padding:5px 0;">${emailPricing.sub_total}</td></tr>
      <tr><td style="padding:5px 0;">Refundable Ticket Fee</td><td align="right" style="padding:5px 0;">${emailPricing.refundable_fee}</td></tr>
      <tr><td style="padding:5px 0;">Service and Handling Fee</td><td align="right" style="padding:5px 0;">${emailPricing.service_fee}</td></tr>
      <tr><td style="padding:15px 0;font-size:16px;font-weight:bold;border-top:2px solid #000;">TOTAL</td><td align="right" style="padding:15px 0;font-size:16px;font-weight:bold;border-top:2px solid #000;">${emailPricing.total}</td></tr>
    </table>
    <div style="font-size:11px;color:#555;margin-top:5px;">*All ticket prices include GST and are quoted in $AUD.</div>
    <div style="border-bottom:2px solid #000;font-weight:bold;font-size:15px;padding-bottom:5px;margin:35px 0 15px 0;color:#000;">IMPORTANT TICKET ACCESS INFORMATION</div>
    <div style="font-size:13px;line-height:1.6;color:#000;">
      <p>The following Mobile Ticket for ${ticket.event_name} has been delivered:</p>
      <ul style="padding-left:15px;"><li>${me.full_name || me.email}: <a href="#" style="color:#007bff;text-decoration:none;">https://ticketek.mobi/?id=${orderNumber}</a></li></ul>
      <p><strong>FOR EASY ENTRY TO THE VENUE:</strong></p>
      <ul style="padding-left:15px;">
        <li>OPEN THE SMS AND DOWNLOAD YOUR TICKET NOW</li>
        <li>Have the ticket ready for scanning before you reach the entrance.</li>
        <li>Turn the brightness up on your phone, this helps scanning.</li>
      </ul>
    </div>
  </td></tr>
  <tr><td bgcolor="#001226" style="padding:15px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
      <td align="left" style="color:#fff;font-size:13px;font-weight:bold;font-family:Arial,sans-serif;">FOLLOW US ON <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png" width="18" height="18" style="display:inline-block;vertical-align:middle;margin-left:4px;" /></td>
      <td align="right" style="color:#fff;font-size:13px;font-weight:bold;font-family:Arial,sans-serif;">DOWNLOAD OUR APP <img src="https://img.icons8.com/ios-filled/50/ffffff/apple-logo.png" width="20" height="20" style="display:inline-block;vertical-align:middle;margin-left:6px;" /></td>
    </tr></table>
  </td></tr>
  <tr><td bgcolor="#f8f8f8" style="padding:20px;text-align:left;">
    <div style="font-size:12px;color:#007bff;margin-bottom:15px;"><a href="#" style="color:#007bff;text-decoration:none;">Update your details</a> | <a href="#" style="color:#007bff;text-decoration:none;">FAQs</a> | <a href="#" style="color:#007bff;text-decoration:none;">Privacy policy</a></div>
    <div style="font-size:11px;color:#999;line-height:1.4;">You have received this email because our records show that you have opted in.</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    await base44.integrations.Core.SendEmail({
      to: recipientEmail.trim() || me.email,
      subject: "Ticketek Purchases Confirmation",
      body: emailHtml,
    });
  };

  const handleCreate = async () => {
    setCreating(true);
    let imageUrl = "";
    if (imageFile) {
      const result = await base44.integrations.Core.UploadFile({ file: imageFile });
      imageUrl = result.file_url;
    }

    const sharedOrderNumber = generateOrderNumber();

    for (const seat of seats) {
      const ticketData = {
        ...form,
        row: seat.row,
        seat_number: seat.seat_number,
        event_image: imageUrl,
        serial_number: generateSerialNumber(),
        pax_number: generatePaxNumber(),
        purchase_date: generatePurchaseDate(),
        seller_id: generateSellerId(),
        transaction_number: generateTransactionNumber(),
        event_code: generateEventCode(form.venue_name, form.event_date, form.event_name),
        order_number: sharedOrderNumber,
        owner_email: user.email,
        barcode_locked: barcodeLocked,
        auth_message: barcodeLocked ? authMessage : "",
        marketplace_notice: marketplaceNotice,
      };
      await base44.entities.Ticket.create(ticketData);
    }

    // Send email confirmation only if enabled
    if (sendEmailNotification) {
      const firstTicket = { ...form, order_number: sharedOrderNumber };
      await sendConfirmationEmail(firstTicket, user, sharedOrderNumber).catch(() => {});
    }

    setCreating(false);
    navigate("/tickets");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <svg viewBox="0 0 24 24" className="w-16 h-16 fill-gray-300 mb-4" style={{ transform: "rotate(-45deg)" }}>
          <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" />
        </svg>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Subscription Required</h2>
        <p className="text-gray-500 mb-6">You need an active subscription to create tickets.</p>
        <button
          onClick={() => navigate("/subscriptions")}
          className="px-6 py-3 rounded-lg text-white font-semibold border-none cursor-pointer"
          style={{ backgroundColor: "#003057" }}
        >
          View Subscriptions
        </button>
      </div>
    );
  }

  const eventFields = [
    { key: "venue_name", label: "Venue Name", placeholder: "e.g., Qudos Bank Arena" },
    { key: "presenter", label: "Presenter/Promoter", placeholder: "e.g., Live Nation Presents" },
    { key: "event_name", label: "Event/Artist Name", placeholder: "e.g., Deftones" },
    { key: "event_date", label: "Event Date and Time", placeholder: "e.g., Sun 3 May 2026 7:00PM" },
  ];
  const seatingFields = [
    { key: "entry_gate", label: "Entry Gate", placeholder: "e.g., Entry A" },
    { key: "level_stand", label: "Level/Stand", placeholder: "e.g., Level 3" },
    { key: "door_area", label: "Door/Area", placeholder: "e.g., 66" },
    { key: "section_bay", label: "Section/Bay", placeholder: "e.g., 65" },
  ];
  const financialFields = [
    { key: "holder_name", label: "Ticket Holder Name", placeholder: "e.g., Mr Luke Griffiths" },
    { key: "ticket_type", label: "Ticket Type", placeholder: "e.g., Mastercard Presale Admit" },
    { key: "price", label: "Price", placeholder: "e.g., $178.39 Inc GST" },
  ];

  return (
    <div className="bg-white min-h-screen max-w-[500px] mx-auto">
      <header className="sticky top-0 bg-white text-center py-4 border-b border-gray-200 z-50">
        <div className="flex items-center px-4">
          <button onClick={() => navigate(-1)} className="text-2xl text-gray-800 font-light">‹</button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Create Ticket</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-5 py-6">
        {/* Image upload */}
        <div className="flex flex-col items-center mb-8">
          <label className="cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Event" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs text-center px-2">Upload Event Image</span>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <p className="text-xs text-gray-400 mt-2">Tap to upload event image</p>
        </div>

        {/* Section 1: Event Info */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">1. Event Information</h3>
        {eventFields.map((f) => (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input type="text" value={form[f.key]} onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
          </div>
        ))}

        {/* Section 2: Seating */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-8">2. Seating & Entry Details</h3>
        {seatingFields.map((f) => (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input type="text" value={form[f.key]} onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
          </div>
        ))}

        {/* Barcode lock toggle */}
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-gray-700">Lock Barcode</div>
              <div className="text-xs text-gray-400 mt-0.5">Barcode hidden until event day</div>
            </div>
            <button onClick={() => setBarcodeLocked(!barcodeLocked)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer ${barcodeLocked ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${barcodeLocked ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          {barcodeLocked && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Authentication Message</label>
              <input type="text" value={authMessage} onChange={e => setAuthMessage(e.target.value)}
                placeholder="e.g. The barcode will be updated at least 48hrs prior to the event."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
            </div>
          )}
        </div>

        {/* Marketplace toggle */}
        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          <div>
            <div className="text-sm font-semibold text-gray-700">Purchased on Marketplace</div>
            <div className="text-xs text-gray-400 mt-0.5">Show marketplace notice on ticket</div>
          </div>
          <button onClick={() => setMarketplaceNotice(!marketplaceNotice)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer ${marketplaceNotice ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${marketplaceNotice ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Row & Seat entries */}
        {seats.map((seat, idx) => (
          <div key={idx} className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Row {seats.length > 1 ? `(Seat ${idx + 1})` : ""}</label>
              <input type="text" value={seat.row}
                onChange={(e) => { const u = [...seats]; u[idx].row = e.target.value; setSeats(u); }}
                placeholder="e.g. D"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Seat Number {seats.length > 1 ? `(${idx + 1})` : ""}</label>
              <input type="text" value={seat.seat_number}
                onChange={(e) => { const u = [...seats]; u[idx].seat_number = e.target.value; setSeats(u); }}
                placeholder="e.g. 14"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
            </div>
            {seats.length > 1 && (
              <button type="button" onClick={() => setSeats(seats.filter((_, i) => i !== idx))}
                className="self-end mb-0.5 px-3 py-3 text-red-400 text-lg font-bold border-none bg-transparent cursor-pointer">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setSeats([...seats, { row: "", seat_number: "" }])}
          className="w-full py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium mb-4 bg-white cursor-pointer">
          + Add Another Seat
        </button>

        {/* Section 3: Financial */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-8">3. Ticket & Holder Details</h3>
        {financialFields.map((f) => (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input type="text" value={form[f.key]} onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
          </div>
        ))}

        {/* Section 4: Confirmation Email */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-8">4. Confirmation Email</h3>

        {/* Email notification toggle */}
        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          <div>
            <div className="text-sm font-semibold text-gray-700">Send Email Notification</div>
            <div className="text-xs text-gray-400 mt-0.5">Send confirmation email when ticket is created</div>
          </div>
          <button onClick={() => setSendEmailNotification(!sendEmailNotification)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer ${sendEmailNotification ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${sendEmailNotification ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="mb-4" style={{ display: sendEmailNotification ? "block" : "none" }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Send Confirmation Email To</label>
          <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)}
            placeholder="Enter recipient email address"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
          <p className="text-xs text-gray-400 mt-1">Leave blank to send to your own account email.</p>
        </div>

        {/* Section 5: Email pricing - only shown when email notification is ON */}
        {sendEmailNotification && (
          <>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-6">5. Email Pricing Details</h3>
            <p className="text-xs text-gray-400 mb-4">These values appear in the confirmation email sent to the customer.</p>
            {[
              { key: "ticket_item_price", label: "Ticket/Item Price", placeholder: "e.g. £550.00" },
              { key: "sub_total", label: "Sub Total", placeholder: "e.g. £550.00" },
              { key: "refundable_fee", label: "Refundable Tickets Fee", placeholder: "e.g. £4.30" },
              { key: "service_fee", label: "Service and Handling Fee", placeholder: "e.g. £6.90" },
              { key: "total", label: "Total", placeholder: "e.g. £561.02" },
            ].map(f => (
              <div key={f.key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input type="text" value={emailPricing[f.key]} onChange={e => handlePricingChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
              </div>
            ))}
          </>
        )}

        <button
          onClick={handleCreate}
          disabled={creating}
          className="w-full py-4 rounded-lg text-white font-bold text-base border-none cursor-pointer mt-6 mb-20 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#003057" }}>
          {creating ? (sendEmailNotification ? "Creating & Sending Email..." : "Creating Ticket...") : "Create Ticket"}
        </button>
      </div>
    </div>
  );
}