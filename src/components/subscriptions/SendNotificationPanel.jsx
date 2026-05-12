import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function SendNotificationPanel() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    const me = await base44.auth.me();
    await base44.entities.AdminNotification.create({
      title: title.trim(),
      body: body.trim(),
      sent_at: new Date().toISOString(),
      sent_by: me.email,
    });
    setSent(true);
    setTitle("");
    setBody("");
    setSending(false);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-base font-bold text-gray-800 mb-1">SEND NOTIFICATIONS 📢</h3>
      <p className="text-xs text-gray-400 mb-4">Send a notification to all users. They will see it when they open the app.</p>

      <div className="mb-3">
        <label className="block text-sm font-bold text-gray-700 mb-1">Notification Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Important Update"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Write your message here..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400 resize-none"
        />
      </div>

      {sent && (
        <div className="bg-green-50 text-green-700 text-sm font-semibold text-center py-2 rounded-lg mb-3">
          ✓ Notification sent to all users!
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={!title.trim() || !body.trim() || sending}
        className="w-full py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: "#003057" }}
      >
        {sending ? "Sending..." : "Send Notification"}
      </button>
    </div>
  );
}