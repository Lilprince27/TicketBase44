import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Listens for incoming ticket-transfer notifications in real time.
 * When a new notification arrives:
 *  - Shows a system-level notification (Web Notifications API) so it pings
 *    the user's phone even if the app is in the background (PWA installed).
 *  - Shows an in-app banner with a "View Tickets" action.
 */
export default function TicketNotificationBanner({ userEmail }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const shownRef = useRef(new Set());

  useEffect(() => {
    if (!userEmail) return;
    let cancelled = false;

    async function load() {
      const unread = await base44.entities.TicketNotification
        .filter({ recipient_email: userEmail, read: false })
        .catch(() => []);
      if (cancelled || !unread?.length) return;
      // Only show notifications we haven't already displayed
      const fresh = unread.filter((n) => !shownRef.current.has(n.id));
      if (fresh.length) {
        fresh.forEach((n) => {
          shownRef.current.add(n.id);
          fireSystemNotification(n);
        });
        setNotifications((prev) => [...fresh, ...prev]);
      }
    }
    load();

    const unsubscribe = base44.entities.TicketNotification.subscribe((event) => {
      const n = event.data;
      if (!n || n.recipient_email !== userEmail) return;
      if (event.type === "create") {
        if (shownRef.current.has(n.id)) return;
        shownRef.current.add(n.id);
        fireSystemNotification(n);
        setNotifications((prev) => [n, ...prev]);
      } else if (event.type === "delete") {
        setNotifications((prev) => prev.filter((x) => x.id !== n.id));
      } else if (event.type === "update") {
        if (n.read) setNotifications((prev) => prev.filter((x) => x.id !== n.id));
      }
    });

    return () => { cancelled = true; unsubscribe(); };
  }, [userEmail]);

  function fireSystemNotification(n) {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    const count = n.ticket_count > 1 ? `${n.ticket_count} tickets` : "a ticket";
    const sender = n.sender_name || "Someone";
    try {
      const notif = new Notification("🎫 Ticket transferred to you!", {
        body: `${sender} sent you ${count} for ${n.event_name}. Open the Ticketek app to accept.`,
        icon: "/icon-192.png",
        tag: n.id,
        requireInteraction: false,
      });
      notif.onclick = () => {
        window.focus();
        navigate("/tickets");
        notif.close();
      };
    } catch (e) {}
  }

  const dismiss = async (notif) => {
    try {
      await base44.entities.TicketNotification.update(notif.id, { read: true });
    } catch (e) {}
    setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
  };

  const viewTickets = async (notif) => {
    await dismiss(notif);
    navigate("/tickets");
  };

  return (
    <AnimatePresence>
      {notifications.length > 0 && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[9998] flex justify-center px-4 pb-6"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            style={{ pointerEvents: "auto" }}
          >
            {notifications.slice(0, 1).map((n) => (
              <div key={n.id}>
                <div className="px-5 pt-5 pb-2" style={{ backgroundColor: "#001a2c" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🎫</span>
                    <span className="text-white text-xs font-bold uppercase tracking-wide">
                      {n.ticket_count > 1 ? `${n.ticket_count} Tickets Received` : "Ticket Received"}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-base leading-snug">
                    {n.sender_name || "Someone"} sent you {n.ticket_count > 1 ? `${n.ticket_count} tickets` : "a ticket"}
                  </h3>
                  <p className="text-white/70 text-sm mt-0.5">{n.event_name}</p>
                </div>
                <div className="px-5 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => dismiss(n)}
                      className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm border-none cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => viewTickets(n)}
                      className="flex-1 py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer"
                      style={{ backgroundColor: "#003057" }}
                    >
                      View Tickets
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}