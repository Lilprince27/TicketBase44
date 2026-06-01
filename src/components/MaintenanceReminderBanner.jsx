import { useState, useEffect } from "react";

export default function MaintenanceReminderBanner() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const now = new Date();
    const day = now.getDate();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeft = totalDays - day;

    // Show reminder in last 3 days of month
    if (daysLeft <= 3 && daysLeft >= 0) {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const nextMonthName = nextMonth.toLocaleString("default", { month: "long" });
      const dueDate = `${totalDays} ${now.toLocaleString("default", { month: "long" })}`;
      const key = `maintenance_reminder_dismissed_${now.getFullYear()}_${now.getMonth()}`;
      if (!localStorage.getItem(key)) {
        setMessage(`Reminder: Your maintenance fee for ${nextMonthName} is due by ${dueDate}. Please ensure payment is made promptly to avoid any service disruptions.`);
        setShow(true);
      }
    }
  }, []);

  function dismiss() {
    const now = new Date();
    const key = `maintenance_reminder_dismissed_${now.getFullYear()}_${now.getMonth()}`;
    localStorage.setItem(key, "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="mx-4 mt-3 bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex items-start gap-3">
      <span className="text-yellow-500 text-lg flex-shrink-0">⚠️</span>
      <div className="flex-1">
        <p className="text-sm text-yellow-800 leading-relaxed">{message}</p>
        <button onClick={dismiss} className="mt-2 px-4 py-1.5 bg-yellow-400 text-white text-xs font-bold rounded-lg border-none cursor-pointer">
          Okay 👍
        </button>
      </div>
    </div>
  );
}