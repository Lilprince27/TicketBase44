import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Upload, Loader2, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

export default function ImportTicketPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    event_name: "",
    venue_name: "",
    event_date: "",
    holder_name: "",
    seat_number: "",
    row: "",
    section_bay: "",
    entry_gate: "",
    level_stand: "",
    ticket_type: "",
    price: "",
  });

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));
    try {
      // 1. Upload the screenshot
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploading(false);
      setExtracting(true);
      // 2. OCR extract event details
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
            ticket_type: { type: "string" },
            price: { type: "string" },
          },
        },
      });
      setExtracting(false);
      if (result?.status === "success" && result.output) {
        const data = typeof result.output === "string" ? JSON.parse(result.output) : result.output;
        setForm(f => ({
          ...f,
          event_name: data.event_name || "",
          venue_name: data.venue_name || "",
          event_date: data.event_date || "",
          holder_name: data.holder_name || "",
          seat_number: data.seat_number || "",
          row: data.row || "",
          section_bay: data.section_bay || "",
          entry_gate: data.entry_gate || "",
          level_stand: data.level_stand || "",
          ticket_type: data.ticket_type || "",
          price: data.price || "",
        }));
      } else {
        setError("Could not read ticket details from the image. Please fill in the fields manually.");
      }
    } catch (e) {
      setUploading(false);
      setExtracting(false);
      setError("Something went wrong processing the image. Please try again or fill in manually.");
    }
  };

  const handleSave = async () => {
    if (!form.event_name || !form.venue_name || !form.event_date || !form.holder_name || !form.seat_number) {
      setError("Please fill in at least: event name, venue, date, holder name, and seat number.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const me = await base44.auth.me();
      await base44.entities.Ticket.create({
        ...form,
        owner_email: me.email,
        purchase_date: new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "2-digit" }),
      });
      navigate("/tickets");
    } catch (e) {
      setError("Failed to save ticket. Please try again.");
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ minHeight: "100vh", background: "white", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: "#001a2c", paddingTop: "calc(env(safe-area-inset-top) + 16px)", paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/tickets")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <ArrowLeft color="white" size={24} />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>Import Ticket</h1>
        </div>
      </header>

      <div style={{ padding: "20px 16px calc(140px + env(safe-area-inset-bottom))" }}>
        {/* Upload zone */}
        {!previewUrl && (
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: 16,
              padding: "48px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: "#f8fafc",
            }}
          >
            <Upload size={40} color="#64748b" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: "#334155", margin: "0 0 6px" }}>Upload Ticketek Screenshot</p>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Tap to choose a photo of your ticket. We'll read the details automatically.</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </div>
        )}

        {/* Preview + extracting */}
        {previewUrl && (
          <div style={{ marginBottom: 20 }}>
            <img src={previewUrl} alt="Ticket preview" style={{ width: "100%", borderRadius: 12, maxHeight: 260, objectFit: "cover" }} />
            {extracting && (
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-sm">
                <Loader2 size={18} className="animate-spin" />
                Reading ticket details...
              </div>
            )}
            {!extracting && !uploading && (
              <button
                onClick={() => { setPreviewUrl(null); fileRef.current?.click(); }}
                style={{ marginTop: 12, width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", color: "#334155", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                Use a different image
              </button>
            )}
          </div>
        )}

        {uploading && (
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-8">
            <Loader2 size={18} className="animate-spin" />
            Uploading image...
          </div>
        )}

        {/* Extracted form */}
        {previewUrl && !uploading && !extracting && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} color="#2E72E7" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Ticket Details</h2>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>(edit if needed)</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Event / Artist Name *" value={form.event_name} onChange={set("event_name")} />
              <Field label="Venue Name *" value={form.venue_name} onChange={set("venue_name")} />
              <Field label="Event Date & Time *" value={form.event_date} onChange={set("event_date")} />
              <Field label="Ticket Holder Name *" value={form.holder_name} onChange={set("holder_name")} />
              <div style={{ display: "flex", gap: 12 }}>
                <Field label="Seat Number *" value={form.seat_number} onChange={set("seat_number")} style={{ flex: 1 }} />
                <Field label="Row" value={form.row} onChange={set("row")} style={{ flex: 1 }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Field label="Section / Bay" value={form.section_bay} onChange={set("section_bay")} style={{ flex: 1 }} />
                <Field label="Entry Gate" value={form.entry_gate} onChange={set("entry_gate")} style={{ flex: 1 }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Field label="Level / Stand" value={form.level_stand} onChange={set("level_stand")} style={{ flex: 1 }} />
                <Field label="Ticket Type" value={form.ticket_type} onChange={set("ticket_type")} style={{ flex: 1 }} />
              </div>
              <Field label="Price" value={form.price} onChange={set("price")} />
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 14 }}>{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                marginTop: 24, width: "100%", padding: "16px", borderRadius: 8, border: "none",
                background: saving ? "#94a3b8" : "#427926", color: "white", fontWeight: 700, fontSize: 16, cursor: saving ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><CheckCircle2 size={18} /> Save Ticket</>}
            </button>
          </>
        )}

        {!previewUrl && error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 14 }}>{error}</p>}

        {/* Manual import note */}
        {!previewUrl && (
          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: "#f1f5f9" }}>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: "#334155" }}>Ticketek tickets</strong> can be imported manually via screenshot OCR here, or created from scratch. Event discovery also supports public APIs from Ticketmaster and other providers on the Events page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, style }) {
  return (
    <div style={style}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
          fontSize: 15, color: "#1e293b", outline: "none", background: "white",
        }}
      />
    </div>
  );
}