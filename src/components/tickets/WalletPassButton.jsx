import { useState } from "react";
import { base44 } from "@/api/base44Client";

/**
 * "Add to Apple Wallet" button that generates a real pass via the
 * generateAppleWalletPass backend function (PassNinja) and opens the
 * install URL. Shows a loading state and inline error while working.
 */
export default function WalletPassButton({ ticket }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await base44.functions.invoke("generateAppleWalletPass", { ticket });
      const url = res?.data?.landingUrl;
      if (url) {
        window.open(url, "_blank", "noopener");
      } else {
        setError(res?.data?.error || "Could not generate wallet pass.");
      }
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Could not generate wallet pass.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAdd}
        disabled={busy}
        style={{
          backgroundColor: "black",
          color: "white",
          width: "100%",
          border: "none",
          padding: "8px",
          fontSize: 16,
          borderRadius: 6,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          cursor: busy ? "default" : "pointer",
          opacity: busy ? 0.7 : 1,
        }}
      >
        {busy ? (
          <span style={{ padding: "6px 0" }}>Generating pass…</span>
        ) : (
          <>
            <img
              src="https://www.image2url.com/r2/default/images/1777758037946-fd4ad460-0bfd-4c21-9c8f-3949e32a0c92.jpeg"
              alt="Wallet Icon"
              style={{ height: 32 }}
            />
            Add to Apple Wallet
          </>
        )}
      </button>
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", textAlign: "center", margin: "8px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}