import { useEffect, useRef } from "react";

const QR_MATRIX = [
  [1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
  [1,1,1,0,0,1,1,1,0,0,1,0,1,1,0,0,1,1,0,1,1],
  [1,0,0,1,1,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,0],
  [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1],
  [1,1,1,0,1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,1,1],
  [0,0,1,1,1,0,0,0,1,1,1,0,1,0,1,1,1,0,0,0,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,0,0,1,0,1,0,1,0,0],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,0,0,0,1,0],
  [1,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,1,1,1,0,0],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1],
  [1,0,1,1,1,0,1,0,0,1,0,1,0,0,0,1,0,1,0,0,0],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1],
];

export default function LockedBarcode({ holderName, ticketType, authMessage }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width / QR_MATRIX.length;
    for (let r = 0; r < QR_MATRIX.length; r++) {
      for (let c = 0; c < QR_MATRIX[r].length; c++) {
        ctx.fillStyle = QR_MATRIX[r][c] === 1 ? "#000" : "#fff";
        ctx.fillRect(c * size, r * size, size, size);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-between items-center w-full px-6 mb-2">
        {/* Left: ticket type */}
        <div className="text-xs text-gray-500 w-24 text-left leading-tight">
          {ticketType || "Adult"}
        </div>

        {/* QR + padlock */}
        <div className="relative flex items-center justify-center" style={{ width: 150, height: 150 }}>
          <canvas
            ref={canvasRef}
            width={150}
            height={150}
            style={{ filter: "blur(3.5px)", opacity: 0.9, display: "block" }}
          />
          {/* Padlock SVG centered over blurred QR */}
          <svg
            viewBox="0 0 100 120"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 65,
              height: "auto",
              filter: "drop-shadow(0 0 4px white) drop-shadow(0 0 2px white)",
              zIndex: 10,
            }}
          >
            <path fill="#aeb4b7" d="M25,45 V30 a25,25 0 0 1 50,0 V45 h-10 V30 a15,15 0 0 0 -30,0 V45 Z" />
            <rect fill="#0d1621" x="15" y="45" width="70" height="60" rx="10" />
            <circle fill="#fff" cx="50" cy="70" r="5" />
            <path fill="#fff" d="M47,70 h6 l2,15 h-10 Z" />
          </svg>
        </div>

        {/* Right: holder */}
        <div className="text-xs w-24 text-right leading-tight">
          <span className="block text-gray-500 font-normal mb-0.5">Held by</span>
          <strong className="text-gray-800 text-xs uppercase">{holderName}</strong>
        </div>
      </div>

      {authMessage && (
        <div className="text-center text-xs text-gray-500 italic mt-1 px-6">{authMessage}</div>
      )}
    </div>
  );
}