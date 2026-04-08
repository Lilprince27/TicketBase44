import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState(1); // 1 = first image, 2 = second image, 3 = done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 1000);
    const t2 = setTimeout(() => {
      setPhase(3);
      onFinish();
    }, 3000); // 1s + 2s

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  if (phase === 3) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: "#021a30" }}>
      {phase === 1 && (
        <img
          src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/aee759d6c_IMG_7107.jpg"
          alt="Ticketek"
          className="w-full h-full object-cover"
        />
      )}
      {phase === 2 && (
        <img
          src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/fbb88c8c3_IMG_7108.png"
          alt="Ticketek Loading"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}