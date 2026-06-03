import { useState, useEffect } from "react";

export default function MaintenanceReminderBanner({ userEmail }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysLeft = daysInMonth - now.getDate();

    // Show banner in last 3 days of month
    if (daysLeft <= 3) {
      const nextMonthDate = new Date(year, month + 1, 1);
      const nextMonthName = nextMonthDate.toLocaleDateString("en-AU", { month: "long", year: "numeric" });
      const dueDate = nextMonthDate.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
      
      const dismissKey = `maintenance_reminder_${year}_${month + 1}`;
      if (!localStorage.getItem(dismissKey)) {
        setMessage(`Reminder: Your maintenance fee for ${nextMonthName} is due by ${dueDate}. Please ensure payment is made promptly to avoid any service disruptions.`);
        setShow(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    const now = new Date();
    const dismissKey = `maintenance_reminder_${now.getFullYear()}_${now.getMonth() + 1}`;
    localStorage.setItem(dismissKey, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{ backgroundColor: "#fff9db", borderBottom: "2px solid #fcc419", padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12, zIndex: 900, position: "relative" }}>
      <div style={{ fontSize: 20, flexShrink: 0 }}>💛</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, color: "#925400", margin: "0 0 10px 0", lineHeight: 1.5 }}>{message}</p>
        <button onClick={handleDismiss}
          style={{ backgroundColor: "#fcc419", color: "#333", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          Okay 👍
        </button>
      </div>
    </div>
  );
}