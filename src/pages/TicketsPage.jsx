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
      <header className="bg-white text-center border-b border-gray-200 z-50" style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)", paddingBottom: 16 }}>
        <h1 className="text-lg font-bold text-gray-900">Ticket wallet</h1>
        <div className="text-sm text-gray-500 mt-1">
          Customer ID: {user?.id ? String(user.id).slice(0, 7) : "..."}
        </div>
      </header>

      <div className="max-w-[480px] mx-auto p-4">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-green-600 flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="#16a34a" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">You don't have any upcoming events</h2>
            <p className="text-gray-500 text-base mb-8">Start browsing now to find tickets to hundreds of amazing experiences</p>
            <button className="w-full py-4 rounded-lg text-white font-semibold text-base mb-4 border-none cursor-pointer" style={{ backgroundColor: "#1d4e89" }}>Order History</button>
            <button onClick={() => window.location.href = '/'} className="w-full py-4 rounded-lg font-semibold text-base border-2 bg-white cursor-pointer" style={{ color: "#1d4e89", borderColor: "#1d4e89" }}>Browse events</button>
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