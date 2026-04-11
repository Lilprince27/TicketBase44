export default function LockedBarcode({ holderName, ticketType, authMessage }) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Barcode area with lock */}
      <div className="flex justify-between items-center w-full px-6 mb-2">
        <div className="text-xs text-gray-500 w-20 text-left leading-tight">
          {ticketType || "Adult"}
        </div>

        {/* Locked QR placeholder */}
        <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
          {/* Blurred QR background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Crect width='140' height='140' fill='white'/%3E%3C!-- QR pattern simulation --%3E%3Crect x='10' y='10' width='35' height='35' fill='none' stroke='black' stroke-width='4'/%3E%3Crect x='18' y='18' width='19' height='19' fill='black'/%3E%3Crect x='95' y='10' width='35' height='35' fill='none' stroke='black' stroke-width='4'/%3E%3Crect x='103' y='18' width='19' height='19' fill='black'/%3E%3Crect x='10' y='95' width='35' height='35' fill='none' stroke='black' stroke-width='4'/%3E%3Crect x='18' y='103' width='19' height='19' fill='black'/%3E%3C/svg>")`,
              backgroundSize: "cover",
              filter: "blur(3px)",
              opacity: 0.3,
            }}
          />
          {/* White fade overlay */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.85) 100%)" }} />
          {/* Lock icon */}
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#1a2e44" style={{ position: "relative", zIndex: 2 }}>
            <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v3H9V6a3 3 0 0 1 3-3zm0 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
          </svg>
        </div>

        <div className="text-xs w-20 text-right leading-tight">
          <span className="block text-gray-500 font-normal mb-0.5">Held by</span>
          <strong className="text-gray-800 text-xs uppercase">{holderName}</strong>
        </div>
      </div>

      {/* Auth message */}
      {authMessage && (
        <div className="text-center text-xs text-gray-500 italic mt-1 px-6">{authMessage}</div>
      )}
    </div>
  );
}