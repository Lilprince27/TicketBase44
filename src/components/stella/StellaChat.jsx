import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X, Send } from "lucide-react";

const QUICK_ACTIONS = [
  "Recommend me some events",
  "What's happening this month",
  "Popular events this weekend",
  "Get support",
];

export default function StellaChat({ onClose }) {
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(me => {
      const name = me.display_name || me.full_name || me.email || "";
      setUserName(name.split(" ")[0] || "");
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (userName && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Hi ${userName}, I'm Stella 👋 I'm here to help you navigate the world of Ticketek. Whether it's concerts, sports, venues or anything in between, I can help you discover events you'll love. What do you want to explore first?`,
      }]);
    }
  }, [userName]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Stella, a helpful AI assistant for Ticketek Australia (ticketek.com.au), a major ticketing platform for concerts, sports, theatre, comedy, and family events across Australia. Be friendly, concise, and helpful. Keep responses short. Answer the user's question: ${text}`,
        add_context_from_internet: true,
        model: "gemini_3_flash",
      });
      setMessages(prev => [...prev, { role: "assistant", content: typeof response === "string" ? response : "Sorry, I couldn't process that." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble processing that. Please try again." }]);
    }
    setLoading(false);
  };

  if (messages.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "#0A141D" }}>
        <div className="w-8 h-8 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: "#0A141D" }}>
      {/* Header */}
      <div style={{ paddingTop: "env(safe-area-inset-top)", background: "#0A141D" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onClose} className="text-white p-1 cursor-pointer border-none bg-transparent">
            <X size={22} />
          </button>
          <div className="flex items-center gap-2">
            <StellaAvatar size={26} />
            <span className="text-white font-semibold text-base">Ask Stella</span>
          </div>
          <div className="px-3 py-1 rounded-full text-[10px] font-semibold" style={{ border: "1px solid #a855f7", color: "rgba(255,255,255,0.5)" }}>
            Beta mode
          </div>
        </div>
        <p className="text-center text-xs italic px-4 pb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
          I'm new and learning, so please verify any key information.
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-2.5"}`}>
            {msg.role === "assistant" && <StellaAvatar size={32} />}
            <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`} style={{ background: msg.role === "user" ? "#1B2936" : "#122330" }}>
              <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {QUICK_ACTIONS.map(action => (
              <button key={action} onClick={() => send(action)} className="px-4 py-2 rounded-full text-sm font-medium border cursor-pointer" style={{ borderColor: "#3b82f6", color: "#60a5fa", background: "transparent" }}>
                {action}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-start gap-2.5">
            <StellaAvatar size={32} />
            <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: "#122330" }}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }} className="px-4 py-3">
        <div className="rounded-full p-[2px]" style={{ background: "linear-gradient(90deg, #eab308, #a855f7, #3b82f6)" }}>
          <div className="flex items-center rounded-full px-4 py-2.5" style={{ background: "#0A141D" }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(input); }}
              placeholder="Ask or search for anything"
              className="flex-1 bg-transparent border-none text-white text-sm outline-none stella-input"
              style={{ color: "white" }}
            />
            <button onClick={() => send(input)} disabled={!input.trim() || loading} className="ml-2 text-blue-500 disabled:opacity-30 cursor-pointer border-none bg-transparent p-0">
              <Send size={18} />
            </button>
          </div>
        </div>
        <style>{`.stella-input::placeholder { color: rgba(255,255,255,0.4); }`}</style>
      </div>
    </div>
  );
}

function StellaAvatar({ size = 32 }) {
  return (
    <div className="flex-shrink-0 rounded-full flex items-center justify-center" style={{ width: size, height: size, background: "conic-gradient(from 180deg, #a855f7, #3b82f6, #eab308, #a855f7)", padding: 1.5 }}>
      <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden" style={{ background: "#0e0e1a" }}>
        <svg viewBox="0 0 36 36" width={size - 4} height={size - 4} fill="none">
          <circle cx="18" cy="18" r="13" fill="#1a1a2e" />
          <rect x="9" y="11" width="18" height="15" rx="7" fill="white" />
          <circle cx="13.5" cy="18" r="3" fill="#0e0e1a" />
          <circle cx="22.5" cy="18" r="3" fill="#0e0e1a" />
          <circle cx="14.5" cy="17" r="1" fill="white" />
          <circle cx="23.5" cy="17" r="1" fill="white" />
          <path d="M14 23 Q18 26.5 22 23" stroke="#0e0e1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  );
}