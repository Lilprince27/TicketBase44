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

  const [seats, setSeats] = useState([{ row: "", seat_number: "" }]);

  const [form, setForm] = useState({
    venue_name: "",
    presenter: "",
    event_name: "",
    event_date: "",
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
      // Check active subscription
      const subs = await base44.entities.Subscription.filter({ user_email: me.email, status: "active" });
      const activeSub = subs.find((s) => new Date(s.end_date) > new Date());
      setSubscription(activeSub || null);
      // Admins bypass subscription check
      if (me.role === "admin") setSubscription({ bypass: true });
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    let imageUrl = "";
    if (imageFile) {
      const result = await base44.integrations.Core.UploadFile({ file: imageFile });
      imageUrl = result.file_url;
    }

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
        order_number: generateOrderNumber(),
        owner_email: user.email,
      };
      await base44.entities.Ticket.create(ticketData);
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

  const fields = [
    { key: "venue_name", label: "Venue Name", placeholder: "e.g., Qudos Bank Arena" },
    { key: "presenter", label: "Presenter/Promoter", placeholder: "e.g., Live Nation Presents" },
    { key: "event_name", label: "Event/Artist Name", placeholder: "e.g., Deftones" },
    { key: "event_date", label: "Event Date and Time", placeholder: "e.g., Sun 3 May 2026 7:00PM" },
    { key: "entry_gate", label: "Entry Gate", placeholder: "e.g., Entry A" },
    { key: "level_stand", label: "Level/Stand", placeholder: "e.g., Level 3" },
    { key: "door_area", label: "Door/Area", placeholder: "e.g., 66" },
    { key: "section_bay", label: "Section/Bay", placeholder: "e.g., 65" },

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

        {/* Section: Event Information */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">1. Event Information</h3>
        {fields.slice(0, 4).map((f) => (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type="text"
              value={form[f.key]}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400"
            />
          </div>
        ))}

        {/* Section: Seating */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-8">2. Seating & Entry Details</h3>
        {fields.slice(4, 8).map((f) => (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type="text"
              value={form[f.key]}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400"
            />
          </div>
        ))}

        {/* Dynamic Row & Seat entries */}
        {seats.map((seat, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600">Seat {idx + 1}</span>
              {seats.length > 1 && (
                <button
                  onClick={() => setSeats(seats.filter((_, i) => i !== idx))}
                  className="text-red-400 text-xs font-medium"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Row</label>
              <input
                type="text"
                value={seat.row}
                onChange={(e) => setSeats(seats.map((s, i) => i === idx ? { ...s, row: e.target.value } : s))}
                placeholder="e.g., B"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seat Number</label>
              <input
                type="text"
                value={seat.seat_number}
                onChange={(e) => setSeats(seats.map((s, i) => i === idx ? { ...s, seat_number: e.target.value } : s))}
                placeholder="e.g., 289"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400"
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => setSeats([...seats, { row: "", seat_number: "" }])}
          className="w-full py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium mb-4 bg-white cursor-pointer"
        >
          + Add Another Seat
        </button>

        {/* Section: Financial */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-8">3. Financial & Legal Details</h3>
        {fields.slice(8).map((f) => (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type="text"
              value={form[f.key]}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400"
            />
          </div>
        ))}

        <button
          onClick={handleCreate}
          disabled={creating || !form.venue_name || !form.event_name || !form.event_date || !form.holder_name || seats.every(s => !s.seat_number)}
          className="w-full py-4 rounded-lg text-white font-bold text-base border-none cursor-pointer mt-6 mb-20 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#003057" }}
        >
          {creating ? "Creating..." : "Create Ticket"}
        </button>
      </div>
    </div>
  );
}