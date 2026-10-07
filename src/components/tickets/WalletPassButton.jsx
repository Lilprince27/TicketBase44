import { useState } from "react";
import AppleWalletModal from "./AppleWalletModal";

/**
 * "Add to Apple Wallet" button that opens a preview of the wallet pass
 * view (AppleWalletModal). The user views the pass and taps Done; no real
 * pass is generated or added to the wallet.
 */
export default function WalletPassButton({ ticket }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPreview(true)}
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
          cursor: "pointer",
        }}
      >
        <img
          src="https://www.image2url.com/r2/default/images/1777758037946-fd4ad460-0bfd-4c21-9c8f-3949e32a0c92.jpeg"
          alt="Wallet Icon"
          style={{ height: 32 }}
        />
        Add to Apple Wallet
      </button>

      {showPreview && (
        <AppleWalletModal ticket={ticket} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}