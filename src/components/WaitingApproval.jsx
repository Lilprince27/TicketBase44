import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function WaitingApproval({ user, onRefresh }) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
      return;
    }

    window.location.href = "/login";
  };

  return (
    <div
      className="fixed inset-0 bg-white flex flex-col"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center overflow-y-auto py-8">
        <img
          src="https://image2url.com/r2/default/images/1775680602688-74d1916c-f13e-492b-aaaf-20e00c0a9469.jpeg"
          alt="Ticketek"
          className="w-48 mb-8 object-contain"
        />

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Waiting for Approval
        </h1>

        <div
          className="w-12 h-1 rounded-full mb-5"
          style={{ backgroundColor: "#003057" }}
        />

        <p className="text-sm text-gray-600 mb-2">
          Your Account has been created successfully!
        </p>

        <p className="text-sm text-gray-500 mb-6">
          We're reviewing your registration and will notify you once approved.
        </p>

        <div className="bg-gray-50 rounded-xl p-5 text-left w-full max-w-sm mb-6">
          <p className="font-semibold text-gray-800 mb-3">
            What happens next?
          </p>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Admin will review your account</li>
            <li>• You'll receive a notification when approved</li>
            <li>• The admin will provide your Authentication Code</li>
            <li>• You can check your status by refreshing this page</li>
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {user?.email}
            </p>

            <p>
              <span className="font-semibold">Registered:</span>{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })
                : "Today"}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="w-full max-w-sm py-4 rounded-xl text-white font-bold mb-3 border-none cursor-pointer"
          style={{ backgroundColor: "#003057" }}
        >
          Refresh Status
        </button>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full max-w-sm py-4 rounded-xl font-bold border-2 bg-white cursor-pointer disabled:opacity-50"
          style={{ color: "#003057", borderColor: "#003057" }}
        >
          {loggingOut ? "Logging Out..." : "Log Out"}
        </button>
      </div>
    </div>
  );
}