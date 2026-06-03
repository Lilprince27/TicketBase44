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
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      backgroundColor: "#011d33",
      display: "flex", justifyContent: "center", alignItems: "center",
      margin: 0, padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      overflow: "hidden",
    }}>
      <div style={{ position: "relative", width: 300, height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Loading ring */}
        <div style={{
          position: "absolute", width: 150, height: 150, borderRadius: "50%",
          background: "conic-gradient(from 0deg, transparent 20%, #00a0e9)",
          WebkitMask: "radial-gradient(farthest-side, transparent 93%, #000 95%)",
          mask: "radial-gradient(farthest-side, transparent 93%, #000 95%)",
          opacity: 0, zIndex: 1,
          animation: "splashFadeInRing 0.4s ease forwards, splashSpin 1.2s linear infinite",
          animationDelay: "3s",
        }} />
        {/* Logo */}
        <div style={{
          width: 180, zIndex: 2, display: "flex", justifyContent: "center", alignItems: "center",
          animation: "splashShrinkLogo 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards",
          animationDelay: "3s",
        }}>
          <img
            src="https://www.image2url.com/r2/default/images/1779883016835-c32c615e-e571-4378-bb0c-79d92edca331.png"
            alt="Ticketek Logo"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes splashShrinkLogo {
          0% { transform: scale(1); }
          100% { transform: scale(0.45); }
        }
        @keyframes splashFadeInRing {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes splashSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}