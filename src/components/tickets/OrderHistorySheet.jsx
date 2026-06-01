import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function OrderHistorySheet({ user, onClose }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) return;
    base44.entities.Ticket.filter({ owner_email: user.email }).then(t => {
      setTickets(t);
      setLoading(false);
    });
  }, [user?.email]);

  const grouped = tickets.reduce((acc, t) => {
    const key = t.order_number || t.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const groups = Object.values(grouped);

  const toggleGroup = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ backgroundColor: "#fff" }}>
      {/* Header */}
      <div className="flex items-center justify-center relative px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={onClose} className="absolute left-4 bg-none border-none cursor-pointer p-1">
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M10 2L2 10L10 18" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-base font-medium text-gray-800">Order History</h1>
      </div>

      {/* Profile */}
      <div className="px-5 py-5">
        <h2 className="text-lg font-medium text-gray-900">{user?.full_name || user?.email}</h2>
        <p className="text-sm text-gray-500">Customer ID: <span className="font-medium text-gray-900">{user?.id ? String(user.id).slice(0, 7) : "—"}</span></p>
      </div>

      <div className="overflow-y-auto flex-1 pb-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No tickets found</div>
        ) : groups.map((group, gi) => {
          const first = group[0];
          const key = first.order_number || first.id;
          const isOpen = expanded[key] !== false; // default open
          return (
            <div key={key} className="border-b border-gray-100">
              {/* Toggle row */}
              <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => toggleGroup(key)}>
                <div className="flex items-center gap-3">
                  <svg width="18" height="14" viewBox="0 0 20 16" fill="none">
                    <path d="M1 4C1 2.89543 1.89543 2 3 2H17C18.1046 2 19 2.89543 19 4V6.5C18.1716 6.5 17.5 7.17157 17.5 8C17.5 8.82843 18.1716 9.5 19 9.5V12C19 13.1046 18.1046 14 17 14H3C1.89543 14 1 13.1046 1 12V9.5C1.82843 9.5 2.5 8.82843 2.5 8C2.5 7.17157 1.82843 6.5 1 6.5V4Z" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
                    <line x1="7" y1="5" x2="7" y2="11" stroke="#000" strokeWidth="1.2" strokeDasharray="2 2"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Order #{key?.slice(-6) || key}</span>
                </div>
                <svg className={`transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`} width="12" height="8" viewBox="0 0 14 8" fill="none">
                  <path d="M1 1L7 7L13 1" stroke="#102A43" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {isOpen && (
                <div className="px-5 pb-5">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{first.event_name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{first.event_date} · {first.venue_name}</p>

                  {/* Meta */}
                  <div className="grid grid-cols-2 bg-gray-50 rounded-md py-3 text-center mb-4">
                    <div className="border-r border-gray-200">
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Order Placed</div>
                      <div className="text-base font-normal text-gray-900">{first.purchase_date || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Order Number</div>
                      <div className="text-base font-normal text-gray-900">{first.order_number?.slice(-6) || "—"}</div>
                    </div>
                  </div>

                  {/* Seating dark panel */}
                  <div className="rounded-md p-4 mb-4" style={{ backgroundColor: "#001524" }}>
                    <table className="w-full text-white text-sm mb-4">
                      <thead>
                        <tr className="text-gray-400 text-xs uppercase border-b border-white/10">
                          <th className="text-left pb-2 font-medium">Section</th>
                          <th className="text-center pb-2 font-medium">Row</th>
                          <th className="text-center pb-2 font-medium">Seat</th>
                          <th className="text-right pb-2 font-medium">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.map(t => (
                          <tr key={t.id} className="font-medium">
                            <td className="pt-3">{t.section_bay || "—"}</td>
                            <td className="pt-3 text-center">{t.row || "—"}</td>
                            <td className="pt-3 text-center">{t.seat_number || "—"}</td>
                            <td className="pt-3 text-right text-xs">{t.ticket_type || "General"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 uppercase mb-1">Delivery Method</div>
                      <div className="text-sm font-medium text-white">Mobile Ticket (via SMS)</div>
                    </div>
                  </div>

                  <button className="w-full py-3 border border-gray-200 rounded-md text-blue-700 text-sm font-medium bg-white mb-2 cursor-pointer">View Venue Map</button>
                  <button className="w-full py-3 border border-gray-200 rounded-md text-blue-700 text-sm font-medium bg-white mb-4 cursor-pointer">View Event Details</button>

                  <p className="text-sm font-medium text-gray-800 text-center mb-3">Download Your Tickets</p>
                  <button onClick={() => { onClose(); navigate(`/ticket-detail/${first.id}`); }} className="w-full py-3 rounded-md text-white text-sm font-medium mb-2 border-none cursor-pointer" style={{ backgroundColor: "#38761d" }}>Mobile Ticket</button>
                  <button className="w-full py-3 rounded-md text-white text-sm font-medium border-none cursor-pointer" style={{ backgroundColor: "#38761d" }}>Print-At-Home (PDF)</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}