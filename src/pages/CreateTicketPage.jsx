import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ChevronDown, Upload, Loader2 } from "lucide-react";
import {
  generateSerialNumber, generatePaxNumber, generateTransactionNumber,
  generateSellerId, generatePurchaseDate, generateEventCode, generateOrderNumber,
} from "../lib/ticketUtils";

const PRESENTERS = [
  { group: "TEG's Internal Promotion Network", items: ["TEG Dainty", "TEG Live", "TEG Van Egmond", "MJR Presents"] },
  { group: "Major Independent Festivals & Promoters", items: ["Frontier Touring", "Laneway Festival", "Handsome Tours", "Metropolis Touring", "Teamwrk Touring"] },
  { group: "Special Event Promoters", items: ["TEG Sport", "TEG Theatrical"] },
];
const ALL_PRESENTERS = PRESENTERS.flatMap(g => g.items);

const TICKET_TYPES = [
  "Premium Reserve","A Reserve","B Reserved","C Reserve","D Reserve",
  "General Admission (GA)","GA Standing","Aisle Seating","Restricted / Obstructed View",
  "Admit / Adult","Concession","Junior / Child","Family","Group Bookings / Ticketek Groupie",
  "Artist Presale","Live Nation Presale","Frontier Presale","Mastercard Presale Admit",
  "CommBank Presale Admit","Vodafone Presale Admit","Telstra Presale Admit",
  "Early Bird","Early Entry VIP","Collector Admit","Verified Fan-to-Fan",
  "Wheelchair Accessible Space","Companion Card","Enhanced Amenity / Easy Access","Bariatric Seating",
  "Customise…"
];

const LEVEL_OPTIONS = [
  "Floor Level",
  "Level 1",
  "Level 2",
  "Level 3",
  "Grandstand","Main Stand",
  "Compass Stand…",
  "Concourse Level",
];
const LEVEL_MAP = {
  "Level 1": "Level 1 (Lower Bowl / Promenade)",
  "Level 2": "Level 2 (Club / Suite / Mid-Tier Level)",
  "Level 3": "Level 3 (Upper Bowl / Balcony)",
};
const COMPASS_STANDS = ["West Stand", "East Stand", "South Stand", "North Stand"];

const ADDONS = [
  { group: "Venue & Entry Perks", items: ["Parking Passes","Fast Pass / Fast Lane / Quick Entry","Early Entry"] },
  { group: "Food & Merchandise", items: ["Pre-Paid Concessions","Commemorative Tickets","Pre-Ordered Merchandise"] },
  { group: "Upgraded Experiences & Comfort", items: ["VIP Lounge Access","Club Seats / Premium Area Access","Ticket Insurance","Hotel Packages"] },
  { group: "Shuttle Bus Passes", items: ["Park and Ride Shuttles","Subway Vouchers"] },
];

function parseAmount(str) {
  if (!str) return 0;
  const num = parseFloat(str.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}
function formatAmt(prefix, num) {
  if (!num) return "";
  return `${prefix}${num.toFixed(2)}`;
}
function getCurrencyPrefix(str) {
  const m = str && str.match(/^[£$€A-Z]+/);
  return m ? m[0] : "£";
}

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
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [customTicketType, setCustomTicketType] = useState("");
  const [showTicketTypeSheet, setShowTicketTypeSheet] = useState(false);
  const [showLevelSheet, setShowLevelSheet] = useState(false);
  const [showPresenterSheet, setShowPresenterSheet] = useState(false);
  const [showCompassSheet, setShowCompassSheet] = useState(false);
  const [emailPricing, setEmailPricing] = useState({ ticket_item_price: "", sub_total: "", refundable_fee: "", service_fee: "", total: "" });
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState("");
  const importFileRef = useRef(null);

  const urlParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const imgUrl = urlParams.get("event_image_url");
    if (imgUrl) { setPrefilledImageUrl(imgUrl); setImagePreview(imgUrl); }
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
    purchase_date: "",
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

  // Auto-calculate total
  useEffect(() => {
    const { ticket_item_price, refundable_fee, service_fee } = emailPricing;
    const item = parseAmount(ticket_item_price);
    const fee1 = parseAmount(refundable_fee);
    const fee2 = parseAmount(service_fee);
    if (item > 0) {
      const prefix = getCurrencyPrefix(ticket_item_price);
      const sub = item;
      const total = item + fee1 + fee2;
      setEmailPricing(prev => ({
        ...prev,
        sub_total: formatAmt(prefix, sub),
        total: formatAmt(prefix, total),
      }));
    }
  }, [emailPricing.ticket_item_price, emailPricing.refundable_fee, emailPricing.service_fee]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handlePricingChange = (field, value) => setEmailPricing(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleImportScreenshot = async (file) => {
    if (!file) return;
    setImporting(true);
    setImportStatus("Uploading screenshot...");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      // Use the uploaded Ticketek screenshot as the event image
      setPrefilledImageUrl(file_url);
      setImagePreview(file_url);
      setImageFile(null);
      setImportStatus("Reading ticket details...");
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            event_name: { type: "string", description: "Event or artist name" },
            venue_name: { type: "string", description: "Venue name" },
            event_date: { type: "string", description: "Event date and time" },
            holder_name: { type: "string", description: "Ticket holder name" },
            seat_number: { type: "string" },
            row: { type: "string" },
            section_bay: { type: "string", description: "Section or bay" },
            entry_gate: { type: "string", description: "Entry gate" },
            level_stand: { type: "string", description: "Level or stand" },
            door_area: { type: "string", description: "Door or area" },
            ticket_type: { type: "string" },
            price: { type: "string" },
          },
        },
      });
      if (result?.status === "success" && result.output) {
        const data = typeof result.output === "string" ? JSON.parse(result.output) : result.output;
        setForm(prev => ({
          ...prev,
          event_name: data.event_name || prev.event_name,
          venue_name: data.venue_name || prev.venue_name,
          event_date: data.event_date || prev.event_date,
          holder_name: data.holder_name || prev.holder_name,
          section_bay: data.section_bay || prev.section_bay,
          entry_gate: data.entry_gate || prev.entry_gate,
          level_stand: data.level_stand || prev.level_stand,
          door_area: data.door_area || prev.door_area,
          ticket_type: data.ticket_type || prev.ticket_type,
          price: data.price || prev.price,
          row: data.row || prev.row,
          seat_number: data.seat_number || prev.seat_number,
        }));
        if (data.row || data.seat_number) {
          setSeats([{ row: data.row || "", seat_number: data.seat_number || "" }]);
        }
        setImportStatus("Ticket details imported — review and edit if needed.");
      } else {
        setImportStatus("Could not read all details. Please fill in manually.");
      }
    } catch (e) {
      setImportStatus("Import failed. Please fill in manually.");
    }
    setImporting(false);
    setTimeout(() => setImportStatus(""), 5000);
  };

  const toggleAddon = (item) => {
    setSelectedAddons(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
  };

  const sendConfirmationEmail = async (ticket, me, orderNumber, seatsList) => {
    const displayName = me.display_name || me.full_name || me.email || "";
    const firstName = displayName.split(" ")[0].toUpperCase();
    // Build seat display based on actual seat numbers
    const seatNumbers = (seatsList || []).map(s => s.seat_number).filter(Boolean);
    let seatLabel, seatValue;
    if (seatNumbers.length === 0) {
      seatLabel = "Admission:";
      seatValue = seatsList && seatsList.length > 1 ? `General Admission × ${seatsList.length}` : "General Admission";
    } else if (seatNumbers.length === 1) {
      seatLabel = "Seat:";
      seatValue = seatNumbers[0];
    } else {
      seatLabel = "Seats:";
      const nums = seatNumbers.map(n => parseInt(n, 10));
      const allNumeric = nums.every(n => !isNaN(n));
      if (allNumeric) {
        const sorted = [...nums].sort((a, b) => a - b);
        let isConsecutive = true;
        for (let i = 1; i < sorted.length; i++) { if (sorted[i] - sorted[i - 1] !== 1) { isConsecutive = false; break; } }
        seatValue = isConsecutive ? `${sorted[0]}–${sorted[sorted.length - 1]}` : seatNumbers.join(", ");
      } else { seatValue = seatNumbers.join(", "); }
    }
    const emailHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Ticketek Purchase Confirmation</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background-color:#f4f4f4;margin:0;padding:0;color:#333}.email-container{max-width:600px;margin:0 auto;background:#fff;border-top:4px solid #001c3d}.pre-header{background:#333;color:#fff;padding:10px 20px;font-size:11px}.header{background:#001c3d;padding:15px 20px;display:flex;justify-content:space-between;align-items:center}.header-title{color:#fff;font-size:20px;font-weight:bold}.content{padding:30px 20px}h1{font-size:22px;font-weight:800;margin:0 0 5px;color:#000}.customer-id{font-size:14px;color:#333;margin-bottom:25px}.section-title{font-size:16px;font-weight:bold;text-transform:uppercase;border-bottom:2px solid #000;padding-bottom:5px;margin-bottom:15px;letter-spacing:.5px}.event-name{font-size:16px;font-weight:bold;margin-bottom:4px}.ticket-info-table{width:100%;border-collapse:collapse;margin-top:15px;font-size:14px}.ticket-info-table td{padding:6px 0}.text-right{text-align:right}.total-row{font-size:18px;font-weight:bold}.currency-note{font-size:11px;color:#666;margin-top:15px;margin-bottom:35px;font-style:italic}.ticket-link{color:#333333;text-decoration:none}.footer-banner{background:#001c3d;color:#fff;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:bold}.footer-links{padding:20px;font-size:12px}.footer-links a{color:#333333;text-decoration:none;margin-right:10px}.footer-opt-out{padding:0 20px 30px;font-size:11px;color:#777;line-height:1.4}</style></head><body><div class="email-container"><div class="pre-header">Ticketek purchase confirmation | <a href="#" style="color:#fff">Add to safe list</a></div><div class="header"><img src="https://www.image2url.com/r2/default/images/1779673478892-f839a7fa-bba5-43ed-af37-b6b897c99090.png" alt="Ticketek Logo" height="35"/><div class="header-title">Purchase Confirmation</div></div><div class="content"><h1>THANK YOU FOR YOUR ORDER</h1><div class="customer-id">Customer ID: ${orderNumber}</div><div style="font-size:15px;font-weight:bold;margin-bottom:15px;">Hi ${firstName},</div><div style="font-size:14px;line-height:1.5;margin-bottom:30px;">Now you've bought your tickets please make sure you read this email as it contains important information about how to access your tickets.</div><div class="section-title">Your Tickets</div><div style="margin-bottom:20px;"><div class="event-name">${ticket.event_name}</div><div style="font-size:14px;margin-bottom:4px;">${ticket.event_date}</div><div style="font-size:14px;color:#333;">${ticket.venue_name}</div></div><table class="ticket-info-table"><tr><td>Section:</td><td class="text-right">${ticket.section_bay || "-"}</td></tr><tr style="border-bottom:1px solid #e0e0e0;"><td style="padding-bottom:12px;">${seatLabel}</td><td class="text-right" style="padding-bottom:12px;">${seatValue}</td></tr><tr><td>Order No.</td><td class="text-right">${orderNumber}</td></tr><tr><td>Ticket/item price</td><td class="text-right">${emailPricing.ticket_item_price}</td></tr><tr><td>Sub-total</td><td class="text-right">${emailPricing.sub_total}</td></tr><tr><td>Refundable Ticket Fee</td><td class="text-right">${emailPricing.refundable_fee}</td></tr><tr><td>Service and Handling Fee</td><td class="text-right">${emailPricing.service_fee}</td></tr><tr class="total-row" style="border-top:2px solid #000;"><td style="padding-top:12px;">TOTAL</td><td class="text-right" style="padding-top:12px;">${emailPricing.total}</td></tr></table><div class="currency-note">*All ticket prices include GST and are quoted in $AUD.</div><div class="section-title">Important Ticket Access Information</div><ul style="padding-left:20px;margin-bottom:25px;"><li style="font-size:14px;margin-bottom:12px;">${displayName}: <a href="https://ticketek.mobi/?id=${orderNumber}" class="ticket-link">https://ticketek.mobi/?id=${orderNumber}</a></li></ul><ul style="list-style:none;padding-left:0;margin-bottom:30px;"><li style="font-size:13px;color:#666;margin-bottom:10px;">• OPEN THE SMS AND DOWNLOAD YOUR TICKET NOW</li><li style="font-size:13px;color:#666;margin-bottom:10px;">• Have the ticket ready for scanning before you reach the entrance.</li><li style="font-size:13px;color:#666;margin-bottom:10px;">• Turn the brightness up on your phone, this helps scanning.</li></ul></div><div class="footer-banner"><a href="#" style="color:#fff;text-decoration:none;">FOLLOW US ON</a><a href="#" style="color:#fff;text-decoration:none;">DOWNLOAD OUR APP</a></div><div class="footer-links"><a href="#">Update your details</a> | <a href="#">FAQs</a> | <a href="#">Privacy policy</a></div><div class="footer-opt-out">You have received this email because our records show that you have opted in.</div></div></body></html>`;

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
    const createdTickets = [];
    try {
      for (const seat of seats) {
        const ticketData = {
          ...form,
          row: seat.row,
          seat_number: seat.seat_number,
          event_image: imageUrl,
          serial_number: generateSerialNumber(),
          pax_number: generatePaxNumber(),
          purchase_date: form.purchase_date || generatePurchaseDate(),
          seller_id: generateSellerId(),
          transaction_number: generateTransactionNumber(),
          event_code: generateEventCode(form.venue_name, form.event_date, form.event_name),
          order_number: sharedOrderNumber,
          owner_email: user.email,
          barcode_locked: barcodeLocked,
          auth_message: barcodeLocked ? authMessage : "",
          marketplace_notice: marketplaceNotice,
          add_ons: selectedAddons.length > 0 ? selectedAddons : [],
        };
        const created = await base44.entities.Ticket.create(ticketData);
        createdTickets.push(created);
      }
      if (sendEmailNotification) {
        const firstTicket = { ...form, order_number: sharedOrderNumber };
        await sendConfirmationEmail(firstTicket, user, sharedOrderNumber, seats).catch(() => {});
      }
      setCreating(false);
      navigate("/tickets");
    } catch (e) {
      // Rollback: delete any tickets that were created before the failure
      await Promise.all(createdTickets.map(t => base44.entities.Ticket.delete(t.id).catch(() => {})));
      setCreating(false);
      alert("Failed to create ticket. Please try again.");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" /></div>;

  // All users can create tickets

  const displayTicketType = form.ticket_type === "Customise…" ? customTicketType : form.ticket_type;

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <header className="sticky top-0 bg-white text-center py-4 border-b border-gray-200 z-50">
        <div className="flex items-center px-4">
          <button onClick={() => navigate(-1)} className="text-2xl text-gray-800 font-light">‹</button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Create Ticket</h1>
          <button onClick={() => importFileRef.current?.click()} disabled={importing}
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 border-none bg-transparent cursor-pointer disabled:opacity-50">
            {importing ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            Import
          </button>
          <input ref={importFileRef} type="file" accept="image/*" className="hidden" onChange={e => handleImportScreenshot(e.target.files?.[0])} />
        </div>
      </header>

      {importStatus && (
        <div className="mx-5 mt-4 px-4 py-3 rounded-lg text-sm font-medium" style={{ background: importing ? "#eff6ff" : "#f0fdf4", color: importing ? "#1e40af" : "#166534" }}>
          {importStatus}
        </div>
      )}

      <div className="px-5 pt-6" style={{ paddingBottom: "calc(140px + env(safe-area-inset-bottom))" }}>
        {/* Image upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <label className="cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {imagePreview ? <img src={imagePreview} alt="Event" className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs text-center px-2">Upload Event Image</span>}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {imagePreview && (
              <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); setPrefilledImageUrl(null); }}
                className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold border-2 border-white cursor-pointer">✕</button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">Tap to upload event image</p>
        </div>

        {/* Section 1: Event Info */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">1. Event Information</h3>

        {/* Venue Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
          <input type="text" value={form.venue_name} onChange={e => handleChange("venue_name", e.target.value)} placeholder="e.g., Qudos Bank Arena"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
        </div>

        {/* Presenter - dropdown, max 2 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Presenter/Promoter</label>
          <button onClick={() => setShowPresenterSheet(true)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between bg-white cursor-pointer">
            <span className={form.presenter ? "text-gray-800" : "text-gray-400"}>{form.presenter || "Select presenter (max 2)"}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Event Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Event/Artist Name</label>
          <input type="text" value={form.event_name} onChange={e => handleChange("event_name", e.target.value)} placeholder="e.g., Deftones"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
        </div>

        {/* Event Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Date and Time</label>
          <input type="text" value={form.event_date} onChange={e => handleChange("event_date", e.target.value)} placeholder="e.g., Sun 3 May 2026 7:00PM"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
        </div>

        {/* Purchase Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
          <input type="text" value={form.purchase_date} onChange={e => handleChange("purchase_date", e.target.value)} placeholder="e.g., 10 Jun 2026"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
        </div>

        {/* Section 2: Seating */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-8">2. Seating & Entry Details</h3>

        {/* Entry Gate */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Entry Gate</label>
          <input type="text" value={form.entry_gate} onChange={e => handleChange("entry_gate", e.target.value)} placeholder="e.g., Entry A"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
        </div>

        {/* Level/Stand - dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Level/Stand</label>
          <button onClick={() => setShowLevelSheet(true)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between bg-white cursor-pointer">
            <span className={form.level_stand ? "text-gray-800" : "text-gray-400"}>{form.level_stand || "Select level/stand"}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Door Area */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Door/Area</label>
          <input type="text" value={form.door_area} onChange={e => handleChange("door_area", e.target.value)} placeholder="e.g., 66"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
        </div>

        {/* Section Bay */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Section/Bay</label>
          <input type="text" value={form.section_bay} onChange={e => handleChange("section_bay", e.target.value)} placeholder="e.g., 65"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
        </div>

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
                onChange={e => { const u = [...seats]; u[idx].row = e.target.value; setSeats(u); }}
                placeholder="e.g. D"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Seat Number {seats.length > 1 ? `(${idx + 1})` : ""}</label>
              <input type="text" value={seat.seat_number}
                onChange={e => { const u = [...seats]; u[idx].seat_number = e.target.value; setSeats(u); }}
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

        {/* Section 3: Ticket & Holder Details */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-8">3. Ticket & Holder Details</h3>

        {/* Holder Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Holder Name</label>
          <input type="text" value={form.holder_name} onChange={e => handleChange("holder_name", e.target.value)} placeholder="e.g., Mr Luke Griffiths"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
        </div>

        {/* Ticket Type - dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
          <button onClick={() => setShowTicketTypeSheet(true)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between bg-white cursor-pointer">
            <span className={form.ticket_type ? "text-gray-800" : "text-gray-400"}>{form.ticket_type || "Select ticket type"}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {form.ticket_type === "Customise…" && (
            <input type="text" value={customTicketType} onChange={e => setCustomTicketType(e.target.value)}
              placeholder="Type your custom ticket type"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none mt-2 text-gray-800 placeholder-gray-400 focus:border-blue-400" />
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input type="text" value={form.price} onChange={e => handleChange("price", e.target.value)} placeholder="e.g., $178.39 Inc GST"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
        </div>

        {/* Add Ons */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 mt-8">Add On (Optional)</h3>
        <p className="text-xs text-gray-400 mb-4">Select any additional services or experiences to include with this ticket.</p>
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          {ADDONS.map((group, gi) => (
            <div key={gi}>
              <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100">{group.group}</div>
              {group.items.map((item, ii) => (
                <button key={ii} type="button" onClick={() => toggleAddon(item)}
                  className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 text-sm text-left cursor-pointer bg-white">
                  <span className="text-gray-700">{item}</span>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedAddons.includes(item) ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                    {selectedAddons.includes(item) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Section 4: Confirmation Email */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-8">4. Confirmation Email</h3>
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

        {sendEmailNotification && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Send Confirmation Email To</label>
              <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)}
                placeholder="Enter recipient email address"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400" />
              <p className="text-xs text-gray-400 mt-1">Leave blank to send to your own account email.</p>
            </div>

            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-6">5. Email Pricing Details</h3>
            <p className="text-xs text-gray-400 mb-4">Total is auto-calculated from item price + fees.</p>
            {[
              { key: "ticket_item_price", label: "Ticket/Item Price", placeholder: "e.g. £550.00" },
              { key: "refundable_fee", label: "Refundable Tickets Fee", placeholder: "e.g. £4.30" },
              { key: "service_fee", label: "Service and Handling Fee", placeholder: "e.g. £6.90" },
              { key: "sub_total", label: "Sub Total", placeholder: "Auto-calculated" },
              { key: "total", label: "Total", placeholder: "Auto-calculated" },
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

        <button onClick={handleCreate} disabled={creating}
          className="w-full py-4 rounded-lg text-white font-bold text-base border-none cursor-pointer mt-6 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#003057" }}>
          {creating ? (sendEmailNotification ? "Creating & Sending Email..." : "Creating Ticket...") : "Create Ticket"}
        </button>
      </div>

      {/* Presenter Sheet */}
      {showPresenterSheet && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setShowPresenterSheet(false)}>
          <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Select Presenter (max 2)</h3>
              <button onClick={() => setShowPresenterSheet(false)} className="text-gray-400 text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>
            {PRESENTERS.map((group, gi) => (
              <div key={gi}>
                <div className="px-5 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">{group.group}</div>
                {group.items.map((item, ii) => {
                  const selected = form.presenter.split(", ").filter(Boolean).includes(item);
                  const selectedList = form.presenter.split(", ").filter(Boolean);
                  const maxed = selectedList.length >= 2 && !selected;
                  return (
                    <button key={ii} type="button" disabled={maxed}
                      onClick={() => {
                        const list = form.presenter.split(", ").filter(Boolean);
                        if (selected) {
                          handleChange("presenter", list.filter(p => p !== item).join(", "));
                        } else if (list.length < 2) {
                          handleChange("presenter", [...list, item].join(", "));
                        }
                      }}
                      className={`w-full flex items-center justify-between px-5 py-3.5 border-b border-gray-100 text-sm text-left cursor-pointer ${maxed ? "opacity-40" : "bg-white"}`}>
                      <span className="text-gray-700">{item}</span>
                      {selected && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="p-5">
              <button onClick={() => setShowPresenterSheet(false)} className="w-full py-3 rounded-xl text-white font-bold border-none cursor-pointer" style={{ backgroundColor: "#003057" }}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Type Sheet */}
      {showTicketTypeSheet && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setShowTicketTypeSheet(false)}>
          <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Select Ticket Type</h3>
              <button onClick={() => setShowTicketTypeSheet(false)} className="text-gray-400 text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>
            {TICKET_TYPES.map((type, i) => (
              <button key={i} type="button"
                onClick={() => { handleChange("ticket_type", type); setShowTicketTypeSheet(false); }}
                className="w-full flex items-center justify-between px-5 py-3.5 border-b border-gray-100 text-sm text-left cursor-pointer bg-white">
                <span className={type === "Customise…" ? "text-blue-600 font-medium" : "text-gray-700"}>{type}</span>
                {form.ticket_type === type && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Level Sheet */}
      {showLevelSheet && !showCompassSheet && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setShowLevelSheet(false)}>
          <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Select Level/Stand</h3>
              <button onClick={() => setShowLevelSheet(false)} className="text-gray-400 text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>
            {LEVEL_OPTIONS.map((opt, i) => (
              <button key={i} type="button"
                onClick={() => {
                  if (opt === "Compass Stand…") { setShowCompassSheet(true); return; }
                  const display = opt.replace(/ \(.*\)/, "");
                  handleChange("level_stand", display);
                  setShowLevelSheet(false);
                }}
                className="w-full flex items-center justify-between px-5 py-3.5 border-b border-gray-100 text-sm text-left cursor-pointer bg-white">
                <span className="text-gray-700">{LEVEL_MAP[opt] || opt}</span>
                {form.level_stand === opt.replace(/ \(.*\)/, "") && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compass Stand sub-sheet */}
      {showCompassSheet && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setShowCompassSheet(false)}>
          <div className="bg-white w-full rounded-t-2xl max-h-[60vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setShowCompassSheet(false)} className="text-blue-600 text-sm border-none bg-transparent cursor-pointer">← Back</button>
                <h3 className="text-base font-bold text-gray-900">Select Stand Direction</h3>
              </div>
              <button onClick={() => { setShowCompassSheet(false); setShowLevelSheet(false); }} className="text-gray-400 text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>
            {COMPASS_STANDS.map((stand, i) => (
              <button key={i} type="button"
                onClick={() => { handleChange("level_stand", stand); setShowCompassSheet(false); setShowLevelSheet(false); }}
                className="w-full flex items-center px-5 py-4 border-b border-gray-100 text-sm text-left cursor-pointer bg-white">
                <span className="text-gray-700">{stand}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}