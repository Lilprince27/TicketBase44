import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trash2 } from "lucide-react";

export default function AdminTicketDeletePanel() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.Ticket.list("-created_date", 500);
    setTickets(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDelete = async () => {
    if (!selected.length) return;
    setDeleting(true);
    for (const id of selected) {
      await base44.entities.Ticket.delete(id);
    }
    setSelected([]);
    await load();
    setDeleting(false);
  };

  const filtered = tickets.filter(t =>
    !emailFilter || t.owner_email?.toLowerCase().includes(emailFilter.toLowerCase()) ||
    t.event_name?.toLowerCase().includes(emailFilter.toLowerCase())
  );

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-4">Manage Tickets</h3>

      <input
        type="text"
        placeholder="Filter by email or event..."
        value={emailFilter}
        onChange={e => setEmailFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none mb-3"
      />

      {selected.length > 0 && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer mb-3 disabled:opacity-50"
          style={{ backgroundColor: "#dc2626" }}
        >
          {deleting ? "Deleting..." : `Delete ${selected.length} ticket${selected.length > 1 ? "s" : ""}`}
        </button>
      )}

      {loading ? (
        <div className="text-center py-4 text-gray-400 text-sm">Loading tickets...</div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No tickets found.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filtered.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => toggle(ticket.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer border transition-colors ${
                selected.includes(ticket.id) ? "border-red-400 bg-red-50" : "border-gray-100 bg-gray-50"
              }`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${selected.includes(ticket.id) ? "border-red-500 bg-red-500" : "border-gray-300"}`}>
                {selected.includes(ticket.id) && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 text-sm truncate">{ticket.event_name}</div>
                <div className="text-xs text-gray-400 truncate">{ticket.owner_email} · Seat {ticket.seat_number}</div>
              </div>
              <Trash2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}