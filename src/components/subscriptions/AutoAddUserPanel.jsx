import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function AutoAddUserPanel() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [result, setResult] = useState(null); // "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdd = async () => {
    if (!email.trim()) return;
    setAdding(true);
    setResult(null);
    setErrorMsg("");
    try {
      await base44.users.inviteUser(email.trim().toLowerCase(), "user");
      setResult("success");
      setEmail("");
    } catch (e) {
      setResult("error");
      setErrorMsg(e?.message || "Failed to add user. They may already exist.");
    }
    setAdding(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">Automatically Add User</h3>
      </div>

      <button
        onClick={() => { setOpen(!open); setResult(null); setErrorMsg(""); setEmail(""); }}
        className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer"
        style={{ backgroundColor: "#003057" }}
      >
        {open ? "Cancel" : "Automatically Add User"}
      </button>

      {open && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="Enter email to add..."
            value={email}
            onChange={e => { setEmail(e.target.value); setResult(null); }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-white text-gray-800 mb-3"
          />

          {result === "success" && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-3 text-center font-medium">
              ✓ User added successfully! They can now log in and receive tickets.
            </div>
          )}
          {result === "error" && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-3 text-center">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!email.trim() || adding}
            className="w-full py-3 rounded-lg text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#418029" }}
          >
            {adding ? "Adding..." : "Done"}
          </button>
        </div>
      )}
    </div>
  );
}