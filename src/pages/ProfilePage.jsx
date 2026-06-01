import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setName(u.display_name || u.full_name || "");
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ display_name: name });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    // Log out the user after deletion request
    await base44.auth.logout();
  };

  return (
    <div className="bg-white min-h-screen max-w-[500px] mx-auto">
      <header className="sticky top-0 bg-white text-center py-4 border-b border-gray-200 z-50">
        <div className="flex items-center px-4">
          <button onClick={() => navigate("/account")} className="text-2xl text-gray-800 font-light">‹</button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Your Profile</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-6 py-8">
        <label className="block text-sm font-medium text-gray-600 mb-2">Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base outline-none text-gray-800 placeholder-gray-400 focus:border-blue-400"
        />
        <p className="text-xs text-gray-400 mt-2">This name will appear on your account greeting.</p>

        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="w-full py-4 rounded-lg text-white font-bold text-base border-none cursor-pointer mt-6 disabled:opacity-50"
          style={{ backgroundColor: "#003057" }}
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save"}
        </button>

        {/* Account Deletion Section */}
        <div className="mt-10 border-t border-gray-100 pt-8">
          <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-xs text-gray-400 mb-4">
            Once you delete your account, there is no going back. All your tickets and data will be lost.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-3 rounded-lg font-bold text-sm border-2 border-red-400 text-red-500 bg-white cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white w-full max-w-[500px] rounded-t-2xl px-6 pt-6 pb-10">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Account</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              This action is permanent. Type <strong>DELETE</strong> below to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none text-gray-800 mb-4 focus:border-red-400"
            />
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || deleting}
              className="w-full py-4 rounded-lg text-white font-bold text-sm border-none cursor-pointer mb-3 disabled:opacity-40"
              style={{ backgroundColor: "#dc2626" }}
            >
              {deleting ? "Deleting..." : "Permanently Delete Account"}
            </button>
            <button
              onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
              className="w-full py-4 rounded-lg font-bold text-sm border border-gray-200 bg-white text-gray-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}