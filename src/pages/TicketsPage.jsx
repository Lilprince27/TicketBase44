import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import TicketCard from "../components/tickets/TicketCard";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me();
      setUser(me);
      const allTickets = await base44.entities.Ticket.filter({ owner_email: me.email });
      setTickets(allTickets);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <header className="sticky top-0 bg-white text-center py-4 border-b border-gray-200 z-50">
        <h1 className="text-lg font-bold text-gray-900">Ticket wallet</h1>
        <div className="text-sm text-gray-500 mt-1">
          Customer ID: {user?.id ? String(user.id).slice(0, 7) : "..."}
        </div>
      </header>

      <div className="max-w-[480px] mx-auto p-4">
        {tickets.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4 fill-gray-300" style={{ transform: "rotate(-45deg)" }}>
              <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" />
            </svg>
            <p className="text-lg font-medium">No tickets yet</p>
            <p className="text-sm mt-1">Your tickets will appear here once created.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        )}
      </div>
    </div>
  );
}