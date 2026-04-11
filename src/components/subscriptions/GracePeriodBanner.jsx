import { X } from "lucide-react";

export default function GracePeriodBanner({ onDismiss }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-4"
      style={{ backgroundColor: "#f59e0b", paddingTop: "calc(env(safe-area-inset-top) + 10px)", paddingBottom: 10 }}
    >
      <div>
        <div className="text-white font-bold text-sm">Grace Period Active</div>
        <div className="text-white/90 text-xs">Renew your subscription within 2 days or access ends</div>
      </div>
      <button onClick={onDismiss} className="text-white bg-transparent border-none cursor-pointer p-1 ml-3">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}