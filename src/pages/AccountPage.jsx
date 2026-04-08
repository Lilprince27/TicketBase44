import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Ticket, MessageSquare, FileText, Lock, Settings, Ban, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const menuItems = [
  { icon: User, label: "Your Profile", path: "#" },
  { icon: Ticket, label: "Your Tickets", path: "/tickets" },
  { icon: MessageSquare, label: "Your Subscriptions", path: "/subscriptions" },
  { icon: FileText, label: "Terms & Conditions", path: "#" },
  { icon: Lock, label: "Privacy Policy", path: "#" },
  { icon: Settings, label: "Help", path: "#" },
  { icon: Ban, label: "Delete account", path: "#" },
];

export default function AccountPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const handleSignOut = () => {
    base44.auth.logout();
  };

  return (
    <div className="bg-white min-h-screen max-w-[500px] mx-auto">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-white text-center py-4 border-b border-gray-200 z-50">
        <h1 className="text-lg font-bold text-gray-900">Your Account</h1>
        <div className="text-sm text-gray-500 mt-1">
          Customer ID: {user?.id ? String(user.id).slice(0, 7) : "..."}
        </div>
      </header>

      {/* Welcome */}
      <div className="px-6 pt-8 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Hi {user?.full_name || "there"}
        </h2>
        <p className="text-gray-500 mt-1 text-base">Welcome.</p>
      </div>

      {/* Menu List */}
      <div>
        {menuItems.map((item, i) => (
          <div key={i}>
            <Link
              to={item.path}
              className="flex items-center px-6 py-5 no-underline transition-colors active:bg-gray-50"
              style={{ color: "#325883" }}
            >
              <div className="w-6 h-6 mr-5 text-gray-500 flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="flex-1 text-base">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </Link>
            {i < menuItems.length - 1 && (
              <div className="h-px bg-gray-200 mx-6" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 pt-10 pb-16">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleSignOut}
            className="font-semibold text-base"
            style={{ color: "#325883" }}
          >
            Sign out
          </button>
          <span className="text-sm text-gray-400">Version 3.2.7</span>
        </div>
        <a href="#" className="block text-center text-sm font-medium" style={{ color: "#325883" }}>
          Cookie & Performance Monitoring Consent
        </a>
      </div>
    </div>
  );
}