import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function UserTicketManager({ userEmail }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hidden_tickets") || "[]"); } catch { return []; }
  });

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.Ticket.filter({ owner_email: userEmail });
    setTickets(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, [userEmail]);

  const handleDelete = async (id) => {
    const snapshot = tickets;
    setTickets(prev => prev.filter(t => t.id !== id));
    try {
      await base44.entities.Ticket.delete(id);
    } catch (e) {
      setTickets(snapshot);
    }
  };

  const handleHide = (id) => {
    const updated = hidden.includes(id) ? hidden.filter(h => h !== id) : [...hidden, id];
    setHidden(updated);
    localStorage.setItem("hidden_tickets", JSON.stringify(updated));
  };

  const handleUpdate = async (id, data) => {
    const snapshot = tickets;
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    try {
      await base44.entities.Ticket.update(id, data);
    } catch (e) {
      setTickets(snapshot);
      throw e;
    }
  };

  if (loading) return <div className="text-center py-6 text-gray-400 text-sm">Loading tickets...</div>;

  const visible = tickets.filter(t => !hidden.includes(t.id));
  const hiddenTickets = tickets.filter(t => hidden.includes(t.id));

  return (
    <div className="mt-2">
      {tickets.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No tickets found.</p>
      ) : (
        <>
          {visible.length === 0 && <p className="text-sm text-gray-400 text-center py-2">All tickets are hidden.</p>}
          <div className="space-y-3">
            {visible.map(ticket => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                isHidden={false}
                onDelete={handleDelete}
                onHide={handleHide}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
          {hiddenTickets.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Hidden Tickets</div>
              <div className="space-y-3">
                {hiddenTickets.map(ticket => (
                  <TicketRow
                    key={ticket.id}
                    ticket={ticket}
                    isHidden={true}
                    onDelete={handleDelete}
                    onHide={handleHide}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TicketRow({ ticket, isHidden, onDelete, onHide, onUpdate }) {
  const [confirming, setConfirming] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    event_name: ticket.event_name || "",
    event_date: ticket.event_date || "",
    venue_name: ticket.venue_name || "",
    seat_number: ticket.seat_number || "",
    row: ticket.row || "",
    section_bay: ticket.section_bay || "",
    holder_name: ticket.holder_name || "",
    ticket_type: ticket.ticket_type || "",
    price: ticket.price || "",
    purchase_date: ticket.purchase_date || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(ticket.id, editData);
      setEditing(false);
    } catch (e) {
      // Rollback handled in parent; stay in edit mode
    }
    setSaving(false);
  };

  if (editing) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="text-sm font-bold text-gray-800 mb-3">Edit Ticket</div>
        <div className="space-y-2">
          {[
            { key: "event_name", label: "Event Name" },
            { key: "event_date", label: "Event Date" },
            { key: "venue_name", label: "Venue" },
            { key: "holder_name", label: "Holder Name" },
            { key: "ticket_type", label: "Ticket Type" },
            { key: "section_bay", label: "Section/Bay" },
            { key: "row", label: "Row" },
            { key: "seat_number", label: "Seat Number" },
            { key: "price", label: "Price" },
            { key: "purchase_date", label: "Purchase Date" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-0.5">{f.label}</label>
              <input
                type="text"
                value={editData[f.key]}
                onChange={e => setEditData(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-400"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-lg text-white text-sm font-bold border-none cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#003057" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white cursor-pointer text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-3 flex items-start gap-3 ${isHidden ? "bg-gray-50 border-gray-100 opacity-60" : "bg-white border-gray-200"}`}>
      <img
        src={ticket.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop"}
        alt={ticket.event_name}
        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 text-sm truncate">{ticket.event_name}</div>
        <div className="text-xs text-gray-400 truncate">{ticket.event_date} · Seat {ticket.seat_number}</div>
        <div className="text-xs text-gray-400 truncate">{ticket.venue_name}</div>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer"
          style={{ color: "#003057", borderColor: "#003057", background: "transparent" }}
        >
          Edit
        </button>
        <button
          onClick={() => onHide(ticket.id)}
          className="px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer"
          style={{ color: "#555", borderColor: "#ccc", background: "transparent" }}
        >
          {isHidden ? "Unhide" : "Hide"}
        </button>
        {confirming ? (
          <div className="flex gap-1">
            <button
              onClick={() => onDelete(ticket.id)}
              className="px-2 py-1 rounded-lg text-xs font-bold border-none cursor-pointer text-white"
              style={{ backgroundColor: "#dc2626" }}
            >
              Yes
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="px-2 py-1 rounded-lg text-xs font-bold border border-gray-200 cursor-pointer bg-white text-gray-600"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="px-2 py-1 rounded-lg text-xs font-semibold border-none cursor-pointer text-white"
            style={{ backgroundColor: "#dc2626" }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}