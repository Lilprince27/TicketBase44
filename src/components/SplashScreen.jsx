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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#05162a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 250,
          height: 250,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Spinning blue ring */}
        <div
          style={{
            position: "absolute",
            width: 190,
            height: 190,
            borderRadius: "50%",
            opacity: 0,
            background:
              "conic-gradient(from 180deg, transparent 0%, transparent 55%, #133e6b 80%, #4ea1ff 100%)",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 2.5px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 2.5px))",
            animation: "tkFadeIn 0.3s ease-in 1.5s forwards, tkSpin 1.1s linear 1.5s infinite",
          }}
        />

        {/* TICKETEK text */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: "-1.5px",
            color: "white",
            fontFamily: "'Arial Black', Gadget, sans-serif",
            transform: "scaleY(1.05)",
            zIndex: 10,
            animation: "tkShrink 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1s forwards",
          }}
        >
          TICKETEK
        </div>
      </div>

      <style>{`
        @keyframes tkSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes tkFadeIn {
          to { opacity: 1; }
        }
        @keyframes tkShrink {
          0% { transform: scale(1) scaleY(1.05); }
          100% { transform: scale(0.78) scaleY(1.05); }
        }
      `}</style>
    </div>
  );
}