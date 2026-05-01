import { useState, useEffect } from "react";
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
    await base44.entities.Ticket.delete(id);
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const handleHide = (id) => {
    const updated = hidden.includes(id) ? hidden.filter(h => h !== id) : [...hidden, id];
    setHidden(updated);
    localStorage.setItem("hidden_tickets", JSON.stringify(updated));
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

function TicketRow({ ticket, isHidden, onDelete, onHide }) {
  const [confirming, setConfirming] = useState(false);

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
          onClick={() => onHide(ticket.id)}
          className="px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer"
          style={{ color: "#003057", borderColor: "#003057", background: "transparent" }}
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