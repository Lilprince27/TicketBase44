export default function LockedBarcode({ holderName, ticketType }) {
  return (
    <div className="flex justify-between items-center mb-8 px-3">
      <div className="text-sm font-semibold w-20 text-left">{ticketType || "Adult"}</div>

      {/* QR container */}
      <div
        style={{
          position: "relative",
          width: 154,
          height: 154,
          background: "#fff",
          border: "1px solid #000",
          overflow: "hidden",
          lineHeight: 0,
          flexShrink: 0,
        }}
      >
        {/* Raw matrix background */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `
              repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0 / 8px 8px,
              repeating-conic-gradient(#000 0% 25%, transparent 0% 50%) 4px 4px / 12px 12px
            `,
            backgroundColor: "#fff",
          }}
        />
        {/* Corner blocks */}
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0"].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos}`}
            style={{
              width: 36,
              height: 36,
              background: "#fff",
              border: "7px solid #000",
              boxSizing: "border-box",
            }}
          >
            <div style={{ position: "absolute", top: 5, left: 5, width: 12, height: 12, background: "#000" }} />
          </div>
        ))}
        {/* Smoke haze */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(2.2px)",
            WebkitBackdropFilter: "blur(2.2px)",
            background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.98) 100%)",
            zIndex: 5,
          }}
        />
        {/* Lock icon */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 10 }}>
          <svg width="70" height="70" viewBox="0 0 24 24" fill="#0c1c2e">
            <path d="M12 1a5 5 0 0 0-5 5v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2h-1V6a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v3H9V6a3 3 0 0 1 3-3zm0 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
          </svg>
        </div>
      </div>

      <div className="text-xs w-20 text-center">
        <span className="block text-gray-500 font-normal mb-0.5">Held by</span>
        <strong className="text-gray-800 text-xs uppercase">{holderName}</strong>
      </div>
    </div>
  );
}