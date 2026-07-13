import { useState } from "react";

const EDIT_FIELDS = [
  { key: "event_name", label: "Event Name" },
  { key: "event_date", label: "Event Date & Time" },
  { key: "venue_name", label: "Venue" },
  { key: "presenter", label: "Presenter" },
  { key: "holder_name", label: "Holder Name" },
  { key: "ticket_type", label: "Ticket Type" },
  { key: "entry_gate", label: "Entry Gate" },
  { key: "level_stand", label: "Level/Stand" },
  { key: "door_area", label: "Door/Area" },
  { key: "section_bay", label: "Section/Bay" },
  { key: "row", label: "Row" },
  { key: "seat_number", label: "Seat Number" },
  { key: "price", label: "Price" },
  { key: "purchase_date", label: "Purchase Date" },
];

export default function TicketEditForm({ ticket, onSave, onCancel }) {
  const [editData, setEditData] = useState(
    EDIT_FIELDS.reduce((acc, f) => {
      acc[f.key] = ticket[f.key] || "";
      return acc;
    }, {})
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(editData);
    setSaving(false);
  };

  return (
    <div style={{ padding: 12 }}>
      <div style={{ background: "white", borderRadius: 8, padding: 20, marginBottom: 8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Edit Ticket</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {EDIT_FIELDS.map(f => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 4 }}>{f.label}</label>
              <input
                type="text"
                value={editData[f.key]}
                onChange={e => setEditData(prev => ({ ...prev, [f.key]: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ flex: 1, padding: "14px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 16, color: "white", cursor: "pointer", opacity: saving ? 0.5 : 1, background: "#003057" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: "14px", borderRadius: 8, border: "1px solid #e0e0e0", fontWeight: 600, fontSize: 16, cursor: "pointer", background: "white", color: "#666" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}