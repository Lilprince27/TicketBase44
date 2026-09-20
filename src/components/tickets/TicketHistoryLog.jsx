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
            </div>
          );
        })}
      </div>
    </div>
  );
}