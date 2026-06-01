import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import EventTicketGroup from "../components/tickets/EventTicketGroup";

export default function TicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me().catch(() => null);
      if (!me) return;
      setUser(me);
      const all = await base44.entities.Ticket.filter({ owner_email: me.email }).catch(() => []);
      // Sort by created_date descending
      all.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setTickets(all);
      setLoading(false);
    }
    load();
  }, []);

  // Group tickets by order_number
  const grouped = tickets.reduce((acc, ticket) => {
    const key = ticket.order_number || ticket.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ticket);
    return acc;
  }, {});

  const groups = Object.values(grouped);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[500px] mx-auto" style={{ backgroundColor: "#f2f2f2" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50 px-4 py-4 text-white flex items-center justify-between"
        style={{ backgroundColor: "#051c2c" }}
      >
        <div className="flex items-center gap-3">
          <img
            src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/4f3732a50_IMG_7107.jpeg"
            alt="Ticketek"
            className="w-8 h-8 object-contain rounded"
          />
          <span className="text-lg font-bold tracking-tight">My Tickets</span>
        </div>
        <button
          onClick={() => navigate("/create-ticket")}
          className="px-4 py-2 rounded-lg text-white text-sm font-semibold border-none cursor-pointer"
          style={{ backgroundColor: "#3a7d2c" }}
        >
          + New
        </button>
      </div>

      <div className="p-4 pb-28">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🎟</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Tickets Yet</h3>
            <p className="text-sm text-gray-400 mb-6">Create your first ticket to get started.</p>
            <button
              onClick={() => navigate("/create-ticket")}
              className="px-6 py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer"
              style={{ backgroundColor: "#003057" }}
            >
              Create Ticket
            </button>
          </div>
        ) : (
          groups.map((group, idx) => (
            <EventTicketGroup key={idx} tickets={group} />
          ))
        )}
      </div>
    </div>
  );
}