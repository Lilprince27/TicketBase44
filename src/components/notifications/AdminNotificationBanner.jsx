import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNotificationBanner({ userEmail }) {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!userEmail) return;
    async function check() {
      const all = await base44.entities.AdminNotification.list("-created_date", 1).catch(() => []);
      if (!all.length) return;
      const latest = all[0];
      const dismissed = JSON.parse(localStorage.getItem("dismissed_notifs") || "[]");
      if (!dismissed.includes(latest.id)) {
        setNotification(latest);
      }
    }
    check();
  }, [userEmail]);

  const dismiss = () => {
    if (!notification) return;
    const dismissed = JSON.parse(localStorage.getItem("dismissed_notifs") || "[]");
    dismissed.push(notification.id);
    localStorage.setItem("dismissed_notifs", JSON.stringify(dismissed));
    setNotification(null);
  };

  return (
    <AnimatePresence>
      {notification && (
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
            <div className="px-5 pt-5 pb-2" style={{ backgroundColor: "#001a2c" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🔔</span>
                <span className="text-white text-xs font-bold uppercase tracking-wide">Information from Admin</span>
              </div>
              <h3 className="text-white font-bold text-base leading-snug">{notification.title}</h3>
            </div>
            <div className="px-5 py-4">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{notification.body}</p>
              <div className="flex gap-3">
                <button
                  onClick={dismiss}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm border-none cursor-pointer"
                >
                  Ignore
                </button>
                <button
                  onClick={dismiss}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer"
                  style={{ backgroundColor: "#003057" }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}