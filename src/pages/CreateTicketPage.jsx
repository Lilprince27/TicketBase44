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
  const [prefilledImageUrl, setPrefilledImageUrl] = useState(null);

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

  useEffect(() => {
    const imgUrl = urlParams.get("event_image_url");
    if (imgUrl) {
      setPrefilledImageUrl(imgUrl);
      setImagePreview(imgUrl);
    }
  }, []);

  const [form, setForm] = useState({
    venue_name: urlParams.get("venue_name") || "",
    presenter: "",
    event_name: urlParams.get("event_name") || "",
    event_date: urlParams.get("event_date") || "",
    entry_gate: urlParams.get("entry_gate") || "",
    level_stand: urlParams.get("level_stand") || "",
    door_area: "",
    section_bay: urlParams.get("section_bay") || "",
    row: urlParams.get("row") || "",
    seat_number: urlParams.get("seat_number") || "",
    holder_name: "",
    ticket_type: "",
    price: urlParams.get("price") || "",
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
    const firstName = (me.full_name || me.email || "").split(" ")[0].toUpperCase();
    const emailHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Ticketek Purchase Confirmation</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background-color:#f4f4f4;margin:0;padding:0;color:#333}.email-container{max-width:600px;margin:0 auto;background:#fff;border-top:4px solid #001c3d}.pre-header{background:#333;color:#fff;padding:10px 20px;font-size:11px;display:flex;justify-content:space-between;align-items:center}.pre-header a{color:#fff;text-decoration:underline}.header{background:#001c3d;padding:15px 20px;display:flex;justify-content:space-between;align-items:center}.header-title{color:#fff;font-size:20px;font-weight:bold}.content{padding:30px 20px}h1{font-size:22px;font-weight:800;margin:0 0 5px;color:#000}.customer-id{font-size:14px;color:#333;margin-bottom:25px}.section-title{font-size:16px;font-weight:bold;text-transform:uppercase;border-bottom:2px solid #000;padding-bottom:5px;margin-bottom:15px;letter-spacing:.5px}.event-name{font-size:16px;font-weight:bold;margin-bottom:4px}.btn-sync{display:inline-flex;align-items:center;background:#72be44;color:#fff;text-decoration:none;padding:10px 16px;font-size:18px;font-weight:bold;border-radius:2px;margin-bottom:12px}.btn-accommodation{display:block;width:fit-content;border:1px solid #e0e0e0;background:#fff;color:#1a4768;text-decoration:none;padding:12px 16px;font-size:18px;font-weight:bold;border-radius:2px}.ticket-info-table{width:100%;border-collapse:collapse;margin-top:15px;font-size:14px}.ticket-info-table td{padding:6px 0}.text-right{text-align:right}.total-row{font-size:18px;font-weight:bold}.currency-note{font-size:11px;color:#666;margin-top:15px;margin-bottom:35px;font-style:italic}.ticket-link{color:#0066cc;text-decoration:none}.footer-banner{background:#001c3d;color:#fff;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:bold}.footer-links{padding:20px;font-size:12px}.footer-links a{color:#0066cc;text-decoration:none;margin-right:10px}.footer-opt-out{padding:0 20px 30px;font-size:11px;color:#777;line-height:1.4}</style></head><body><div class="email-container"><div class="pre-header"><div>Ticketek purchase confirmation | <a href="#">Add to safe list</a><br><a href="#" style="display:inline-block;margin-top:5px;">Order History</a></div></div><div class="header"><div><img src="https://www.image2url.com/r2/default/images/1779673478892-f839a7fa-bba5-43ed-af37-b6b897c99090.png" alt="Ticketek Logo" height="35"/></div><div class="header-title">Purchase Confirmation</div></div><div class="content"><h1>THANK YOU FOR YOUR ORDER</h1><div class="customer-id">Customer ID: ${orderNumber}</div><div style="font-size:15px;font-weight:bold;margin-bottom:15px;">Hi ${firstName},</div><div style="font-size:14px;line-height:1.5;margin-bottom:30px;">Now you've bought your tickets please make sure you read this email as it contains <a href="#" style="color:#333;text-decoration:underline;">important information</a> about how to access your tickets and tips to ensure you have a great event day.</div><div class="section-title">Your Tickets</div><div style="margin-bottom:20px;"><div class="event-name">${ticket.event_name}</div><div style="font-size:14px;margin-bottom:4px;">${ticket.event_date}</div><div style="font-size:14px;color:#333;">${ticket.venue_name}</div></div><div style="margin:20px 0 35px 0;"><a href="#" class="btn-sync"><svg viewBox="0 0 24 24" width="18" height="18" fill="#fff" style="margin-right:8px;"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>Sync to Calendar</a><br><a href="#" class="btn-accommodation" style="margin-top:12px;">Find accommodation nearby</a></div><table class="ticket-info-table"><tr><td>Section:</td><td class="text-right">${ticket.section_bay || "-"}</td></tr><tr style="border-bottom:1px solid #e0e0e0;"><td style="padding-bottom:12px;">Seat:</td><td class="text-right" style="padding-bottom:12px;">${ticket.seat_number} Admit: 1</td></tr><tr style="height:10px;"><td></td><td></td></tr><tr><td>Order No.</td><td class="text-right">${orderNumber}</td></tr><tr><td>Ticket/item price</td><td class="text-right">${emailPricing.ticket_item_price}</td></tr><tr><td>Sub-total</td><td class="text-right">${emailPricing.sub_total}</td></tr><tr><td>Refundable Ticket Fee</td><td class="text-right">${emailPricing.refundable_fee}</td></tr><tr><td>Service and Handling Fee</td><td class="text-right">${emailPricing.service_fee}</td></tr><tr class="total-row" style="border-top:2px solid #000;"><td style="padding-top:12px;">TOTAL</td><td class="text-right" style="padding-top:12px;">${emailPricing.total}</td></tr></table><div class="currency-note">*All ticket prices include GST and are quoted in $AUD.</div><div class="section-title">Important Ticket Access Information</div><div style="font-size:14px;line-height:1.5;margin-bottom:15px;">The following Mobile Ticket for ${ticket.event_name} has been delivered:</div><ul style="padding-left:20px;margin-bottom:25px;"><li style="font-size:14px;margin-bottom:12px;">${me.full_name || me.email}: <a href="https://ticketek.mobi/?id=${orderNumber}" class="ticket-link">https://ticketek.mobi/?id=${orderNumber}</a></li></ul><div style="font-size:13px;font-weight:bold;color:#555;margin-bottom:15px;">FOR EASY ENTRY TO THE VENUE:</div><ul style="list-style:none;padding-left:0;margin-bottom:30px;"><li style="font-size:13px;color:#666;margin-bottom:10px;padding-left:15px;position:relative;">• OPEN THE SMS AND DOWNLOAD YOUR TICKET NOW</li><li style="font-size:13px;color:#666;margin-bottom:10px;padding-left:15px;position:relative;">• Have the ticket ready for scanning before you reach the entrance.</li><li style="font-size:13px;color:#666;margin-bottom:10px;padding-left:15px;position:relative;">• Turn the brightness up on your phone, this helps scanning.</li></ul></div><div class="footer-banner"><a href="#" style="color:#fff;text-decoration:none;">FOLLOW US ON <span style="margin-left:5px;background:#fff;color:#001c3d;padding:0 6px;border-radius:50%;font-size:11px;">f</span></a><a href="#" style="color:#fff;text-decoration:none;">DOWNLOAD OUR APP <span style="margin-left:5px;border:1px solid #fff;padding:0 4px;font-size:11px;">?</span></a></div><div class="footer-links"><a href="#">Update your details</a> | <a href="#">FAQs</a> | <a href="#">Privacy policy</a></div><div class="footer-opt-out">You have received this email because our records show that you have opted in.</div></div></body></html>`;

    await base44.integrations.Core.SendEmail({
      to: recipientEmail.trim() || me.email,
      subject: "Ticketek Purchases Confirmation",
      body: emailHtml,
    });
  };

  const handleCreate = async () => {
    setCreating(true);
    let imageUrl = prefilledImageUrl || "";
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
          <div className="relative">
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
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImagePreview(null); setImageFile(null); setPrefilledImageUrl(null); }}
                className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold border-2 border-white cursor-pointer"
                style={{ lineHeight: 1 }}
              >✕</button>
            )}
          </div>
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