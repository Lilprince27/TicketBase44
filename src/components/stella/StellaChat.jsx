import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";
import { TICKETEK_FEATURED, TICKETEK_TRENDING, TICKETEK_WAITLISTS } from "../events/ticketekEvents";

const SUGGESTED_ACTIONS = [
  "Recommend me some events",
  "What's happening this month",
  "Popular events this weekend",
  "Get support",
];

const StellaRobotIcon = ({ size = 32 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "#0d2d43", border: "1.5px solid #005d9e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg viewBox="0 0 36 36" width={Math.round(size * 0.65)} height={Math.round(size * 0.65)} fill="none">
      <rect x="9" y="11" width="18" height="15" rx="7" fill="white" />
      <circle cx="13.5" cy="18" r="3" fill="#0d2d43" />
      <circle cx="22.5" cy="18" r="3" fill="#0d2d43" />
      <circle cx="14.5" cy="17" r="1" fill="white" />
      <circle cx="23.5" cy="17" r="1" fill="white" />
      <path d="M14 23 Q18 26.5 22 23" stroke="#0d2d43" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

export default function StellaChat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const scrollRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    async function init() {
      const me = await base44.auth.me().catch(() => null);
      const firstName = me?.display_name?.split(" ")[0] || me?.full_name?.split(" ")[0] || "there";
      setUserName(firstName);
      setMessages([{
        role: "assistant",
        content: `Hi ${firstName}, I'm Stella 👋 I'm here to help you navigate the world of Ticketek. Whether it's concerts, sports, venues or anything in between, I can help you discover events you'll love. What do you want to explore first?`,
      }]);
    }
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const buildPrompt = (userMessage) => {
    const featured = TICKETEK_FEATURED.map(e => `- ${e.title}${e.subtitle ? ` (${e.subtitle})` : ""}`).join("\n");
    const trending = TICKETEK_TRENDING.map(e => `- ${e.title}`).join("\n");
    const waitlists = TICKETEK_WAITLISTS.map(e => `- ${e.title}`).join("\n");

    return `You are Stella, the friendly AI assistant for Ticketek Australia (ticketek.com.au). You help users discover events, get recommendations, and answer questions about concerts, sports, theatre, comedy, and entertainment available on Ticketek.

The user's name is ${userName}.

Here are some current events on Ticketek:
Featured:
${featured}

Trending:
${trending}

Waitlists:
${waitlists}

Instructions:
- Be friendly, concise, and helpful.
- If asked for recommendations, suggest events from the list above or search for current events in Australia.
- If asked about venues, ticketing, or support, give helpful guidance.
- If you don't know something, say so honestly.

WHEN ASKED ABOUT A SPECIFIC EVENT OR ARTIST (e.g. "Olivia Dean tickets", "Coldplay tour", "Pink tickets"):
You MUST search the internet (Ticketek.com.au) and provide a DETAILED response with:
1. A brief conversational opening mentioning the user's name.
2. Group by state (NSW, VIC, QLD, SA, WA, etc.) — use **bold** state headings.
3. Under each state, list each show with:
   - **Event/Artist name** in bold
   - Date and time (e.g. "Mon, 05 Oct 2026 • 7:30pm")
   - Venue name and city (e.g. "Rod Laver Arena, Melbourne, VIC")
4. For each show, list ALL ticket types/categories available (e.g. "General Admission Standing", "A Reserve", "Premium Reserve", "VIP Package", etc.) with their availability status:
   - Use "• Allocation Exhausted" for sold-out tiers
   - Use "• Available from $XXX.XX" for available tiers with pricing
   - Use "• Waitlist Open" for waitlist-only tiers
5. Include a fee disclosure at the bottom in italics: "*A one-off service fee and handling fee may apply per transaction. Please check the event's booking link on ticketek.com.au for the most up-to-date pricing and availability.*"
6. Mention the Ticketek booking link: "Check ticketek.com.au for booking."

If tickets are exhausted across all shows, say so clearly and suggest joining the waitlist or checking back.

Format everything using markdown with bold headings, bullet points, and clear structure.

User question: ${userMessage}`;
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: buildPrompt(text.trim()),
        add_context_from_internet: true,
        model: "gemini_3_flash",
      });
      const response = typeof res === "string" ? res : String(res);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble responding just now. Please try again." }]);
    }
    setLoading(false);
  };

  const handleSend = () => sendMessage(input);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100000, background: "#082438", display: "flex", flexDirection: "column" }}>
      <style>{`
        .stella-input { color: white; }
        .stella-input::placeholder { color: rgba(255,255,255,0.4); }
        @keyframes stella-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        .stella-msg p { margin: 0; }
        .stella-msg p + p { margin-top: 8px; }
        .stella-msg ul, .stella-msg ol { margin: 4px 0 0; padding-left: 20px; }
        .stella-msg li { margin-bottom: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "calc(env(safe-area-inset-top) + 16px) 20px 16px", borderBottom: "1px solid rgba(0,93,158,0.3)" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "white", fontSize: 17, fontWeight: 700 }}>Ask Stella</span>
          <StellaRobotIcon size={28} />
        </div>
        <div style={{ padding: "1px", borderRadius: "100px", background: "linear-gradient(90deg, #facc15, #a855f7)" }}>
          <div style={{ background: "#082438", borderRadius: "100px", padding: "4px 12px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
            Beta mode
          </div>
        </div>
      </div>

      {/* Content area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "24px 20px 120px", WebkitOverflowScrolling: "touch" }}>
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)", fontStyle: "italic", marginBottom: 20 }}>
          I'm new and learning, so please verify any key information.
        </p>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", textAlign: "center", marginBottom: 24 }}>
          How can I help?
        </h1>

        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <StellaRobotIcon size={32} />
            <div style={{ background: "#0d2d43", borderRadius: "18px 18px 18px 4px", padding: "14px 18px", display: "flex", gap: 4, border: "1px solid rgba(0,93,158,0.3)" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.5)",
                  animation: `stella-bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {messages.length <= 1 && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            <div style={{ display: "flex", gap: 10 }}>
              {SUGGESTED_ACTIONS.slice(0, 2).map(action => (
                <SuggestionButton key={action} label={action} onClick={() => sendMessage(action)} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {SUGGESTED_ACTIONS.slice(2).map(action => (
                <SuggestionButton key={action} label={action} onClick={() => sendMessage(action)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1px", background: "linear-gradient(90deg, #facc15, #a855f7)" }}>
        <div style={{ background: "#082438", display: "flex", alignItems: "center", padding: "10px 16px", paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}>
          <input
            type="text"
            className="stella-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            placeholder="Ask or search for anything"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 15 }}
          />
          <button onClick={handleSend} disabled={!input.trim() || loading}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: (!input.trim() || loading) ? 0.4 : 1, display: "flex", alignItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#005d9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ background: "#005d9e", color: "white", borderRadius: "18px 18px 4px 18px", padding: "12px 16px", fontSize: 14, maxWidth: "80%", lineHeight: 1.5 }}>
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
      <StellaRobotIcon size={32} />
      <div className="stella-msg" style={{ background: "#0d2d43", color: "white", borderRadius: "4px 18px 18px 18px", padding: "14px 16px", fontSize: 14, maxWidth: "80%", lineHeight: 1.5, border: "1px solid rgba(0,93,158,0.3)" }}>
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}

function SuggestionButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, background: "#0d2d43", border: "1px solid #005d9e", borderRadius: 12, padding: "12px 14px",
      color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left",
    }}>
      {label}
    </button>
  );
}