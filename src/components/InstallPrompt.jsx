import { useState, useEffect } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [iosInstructions, setIosInstructions] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone;
    setIsIOS(ios);

    const dismissed = localStorage.getItem("pwa_dismissed");
    if (dismissed) return;

    if (ios) {
      setShow(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setIosInstructions(true);
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("pwa_dismissed", "1");
  };

  if (!show) return null;

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-[99999] flex justify-center"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)" }}
      >
        <div
          className="mx-4 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-2xl"
          style={{ background: "#05162a", border: "1px solid rgba(255,255,255,0.12)", maxWidth: 400, width: "100%" }}
        >
          <img
            src="https://media.base44.com/images/public/69d672ffd7bc803edb6bc612/4f3732a50_IMG_7107.jpeg"
            className="w-12 h-12 rounded-xl flex-shrink-0 object-cover"
            alt="Ticketek"
          />
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm">Install Ticketek</div>
            <div className="text-gray-400 text-xs mt-0.5">Add to your home screen for a native experience</div>
          </div>
          <button
            onClick={handleInstall}
            className="px-4 py-2 rounded-xl text-white font-bold text-sm border-none cursor-pointer flex-shrink-0"
            style={{ backgroundColor: "#003057" }}
          >
            Install
          </button>
          <button onClick={dismiss} className="text-gray-500 text-lg bg-transparent border-none cursor-pointer flex-shrink-0 leading-none">×</button>
        </div>
      </div>

      {/* iOS step-by-step instructions */}
      {iosInstructions && (
        <div
          className="fixed inset-0 z-[999999] flex items-end justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setIosInstructions(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl px-6 pt-6 pb-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Add to Home Screen</h3>
            <p className="text-sm text-gray-500 mb-5">Follow these steps in Safari to install Ticketek:</p>
            {[
              { step: "1", text: 'Tap the Share button at the bottom of Safari (the box with an arrow pointing up)' },
              { step: "2", text: 'Scroll down and tap "Add to Home Screen"' },
              { step: "3", text: 'Tap "Add" in the top right corner' },
            ].map(item => (
              <div key={item.step} className="flex gap-3 mb-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#003057" }}>
                  {item.step}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
            <button
              onClick={() => { setIosInstructions(false); dismiss(); }}
              className="w-full py-4 rounded-xl text-white font-bold mt-2 border-none cursor-pointer"
              style={{ backgroundColor: "#003057" }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}