export default function NotificationPermissionModal({ onAllow, onSkip }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-t-3xl w-full max-w-sm pb-10 px-7 pt-7 shadow-xl">
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">🔔</div>
          <h2 className="text-xl font-bold text-gray-900">Enable Notifications</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Allow Ticketek to send you important updates, ticket alerts, and messages from the admin.
          </p>
        </div>

        <button
          onClick={onAllow}
          className="w-full py-4 rounded-xl text-white font-bold text-base border-none cursor-pointer mb-3"
          style={{ backgroundColor: "#003057" }}
        >
          Allow Notifications
        </button>
        <button
          onClick={onSkip}
          className="w-full py-4 rounded-xl font-semibold text-base border-none bg-gray-100 text-gray-600 cursor-pointer"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}