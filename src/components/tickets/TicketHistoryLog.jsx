import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const ACTION_LABELS = {
  created: "Ticket created",
  transferred: "Transferred",
  sent: "Sent via email",
  accepted: "Accepted",
  rejected: "Declined",
};

const ACTION_COLORS = {
  created: "#003057",
  transferred: "#418029",
  sent: "#003057",
  accepted: "#22c55e",
  rejected: "#ef4444",
};

export default function TicketHistoryLog({ userEmail }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!userEmail) return;
    async function load() {
      try {
        const records = await base44.entities.TicketHistory.list("-created_date", 50);
        // Filter to records relevant to this user
        const mine = records.filter(r =>
          r.owner_email === userEmail ||
          r.actor_email === userEmail ||
          r.recipient_email === userEmail
        );
        setHistory(mine);
      } catch (e) {
        // ignore
      }
      setLoading(false);
    }
    load();
  }, [userEmail]);

  const handleDelete = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await base44.entities.TicketHistory.delete(id);
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (e) {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 p-4 mb-4">
        <h3 className="text-base font-bold text-gray-800 mb-2">Ticket History</h3>
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 p-4 mb-4">
        <h3 className="text-base font-bold text-gray-800 mb-1">Ticket History</h3>
        <p className="text-xs text-gray-400">No transfer or acceptance activity yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 p-4 mb-4">
      <h3 className="text-base font-bold text-gray-800 mb-3">Ticket History</h3>
      <div className="space-y-3">
        {history.map(h => {
          const date = h.created_date ? new Date(h.created_date) : null;
          const dateStr = date ? date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : "";
          const timeStr = date ? date.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }) : "";
          return (
            <div key={h.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex-shrink-0 mt-0.5">
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: ACTION_COLORS[h.action] || "#999" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{ACTION_LABELS[h.action] || h.action}</p>
                <p className="text-xs text-gray-500 truncate">{h.ticket_name}</p>
                {h.details && <p className="text-xs text-gray-400 mt-0.5">{h.details}</p>}
                <p className="text-xs text-gray-400 mt-0.5">{dateStr} · {timeStr}</p>
              </div>
              <button
                onClick={() => handleDelete(h.id)}
                disabled={deletingId === h.id}
                className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                title="Delete from history"
              >
                {deletingId === h.id ? (
                  <div className="w-3.5 h-3.5 border border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}