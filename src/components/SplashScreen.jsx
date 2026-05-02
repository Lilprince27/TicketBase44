import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 4000);
    return () => clearTimeout(t);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "#001a35" }}
    >
      <div
        className="flex flex-col items-center"
        style={{ animation: "fadeIn 0.6s ease-in" }}
      >
        <div style={{ width: "70%", maxWidth: 280, marginBottom: 80 }}>
          <img
            src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/4f3732a50_IMG_7107.jpeg"
            alt="Ticketek"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.1)",
            borderTop: "3px solid #4690e8",
            borderRight: "3px solid #4690e8",
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}