import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, Zap, RotateCcw, ChevronRight } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { copilotResponses } from "../data/railwayData";

const suggestedQuestions = [
  { label: "Most vulnerable route?", key: "vulnerable route", icon: "🛤️" },
  { label: "Highest congestion risk?", key: "congestion risk", icon: "👥" },
  { label: "Recommended actions?", key: "operator actions", icon: "⚡" },
  { label: "Weather impact today?", key: "weather impact", icon: "🌧️" },
];

function formatMessage(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.includes("\n")) {
      return part.split("\n").map((line, j) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < part.split("\n").length - 1 && <br />}
        </span>
      ));
    }
    return <span key={i}>{part}</span>;
  });
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-rail-accent/60"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function AICopilot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello, I'm the **RailTwin AI Copilot**. I have real-time access to your railway network data, including train positions, delay predictions, congestion levels, and simulation results.\n\nHow can I help you today?",
      tags: ["Network Health: 72%", "4 Alerts Active", "6 Trains Monitored"],
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function getResponse(text) {
    const lower = text.toLowerCase();
    if (lower.includes("vulnerable") || lower.includes("route")) return copilotResponses["vulnerable route"];
    if (lower.includes("congestion") || lower.includes("crowd") || lower.includes("packed")) return copilotResponses["congestion risk"];
    if (lower.includes("action") || lower.includes("operator") || lower.includes("recommend") || lower.includes("what should")) return copilotResponses["operator actions"];
    if (lower.includes("weather") || lower.includes("rain") || lower.includes("wind")) return copilotResponses["weather impact"];
    return copilotResponses["default"];
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    const userMsg = {
      role: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const response = getResponse(text);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.answer,
          tags: response.tags,
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, delay);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleReset() {
    setMessages([
      {
        role: "assistant",
        text: "Conversation cleared. I'm ready to assist with your railway operations. What would you like to know?",
        tags: ["Ready"],
        time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  return (
    <div className="flex flex-col h-full max-w-screen-2xl mx-auto" style={{ height: "calc(100vh - 130px)" }}>
      <SectionHeader
        icon={Bot}
        title="AI Operations Copilot"
        subtitle="Natural language assistant · Powered by LangGraph + Gemini · Real-time network awareness"
        color="purple"
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rail-purple/10 border border-rail-purple/30">
              <Sparkles size={12} className="text-rail-purple" />
              <span className="text-xs text-rail-purple font-mono">AI ONLINE</span>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-rail-border/50 text-rail-muted hover:text-rail-accent transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        }
      />

      <div className="flex flex-1 gap-4 min-h-0">
        {/* Chat Area */}
        <div className="flex flex-col flex-1 panel-border rounded-xl overflow-hidden min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "assistant"
                    ? "bg-rail-purple/20 border border-rail-purple/40"
                    : "bg-rail-accent/20 border border-rail-accent/40"
                }`}>
                  {msg.role === "assistant"
                    ? <Bot size={14} className="text-rail-purple" />
                    : <User size={14} className="text-rail-accent" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-rail-card border border-rail-border text-rail-text"
                      : "bg-rail-accent/15 border border-rail-accent/30 text-rail-text"
                  }`}>
                    {formatMessage(msg.text)}
                  </div>
                  {msg.tags && msg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {msg.tags.map((tag, j) => (
                        <span key={j} className="text-[9px] font-mono px-2 py-0.5 rounded bg-rail-purple/10 border border-rail-purple/20 text-rail-purple">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-rail-muted font-mono">{msg.time}</div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-rail-purple/20 border border-rail-purple/40 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-rail-purple" />
                </div>
                <div className="bg-rail-card border border-rail-border rounded-xl">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-rail-border p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about delays, congestion, recommendations..."
                  rows={1}
                  className="w-full bg-rail-card border border-rail-border rounded-xl px-4 py-3 text-sm text-rail-text placeholder-rail-muted resize-none focus:outline-none focus:border-rail-accent/50 font-sans"
                  style={{ minHeight: 48, maxHeight: 120 }}
                />
              </div>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || typing}
                className={`px-4 py-3 rounded-xl font-mono text-sm font-bold transition-all flex items-center gap-2 ${
                  input.trim() && !typing
                    ? "bg-rail-accent/20 border border-rail-accent text-rail-accent hover:bg-rail-accent/30"
                    : "bg-rail-card border border-rail-border text-rail-muted cursor-not-allowed"
                }`}
              >
                <Send size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-rail-muted font-mono">
              <span>Press Enter to send · Shift+Enter for new line</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-4">
          {/* Suggested Questions */}
          <div className="panel-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={12} className="text-rail-purple" />
              <h3 className="text-xs font-semibold text-white">Suggested Questions</h3>
            </div>
            <div className="space-y-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q.key}
                  onClick={() => sendMessage(q.label)}
                  disabled={typing}
                  className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-rail-card border border-rail-border hover:border-rail-purple/40 hover:bg-rail-purple/5 text-left transition-colors group"
                >
                  <span>{q.icon}</span>
                  <span className="text-xs text-rail-text group-hover:text-white flex-1">{q.label}</span>
                  <ChevronRight size={10} className="text-rail-muted group-hover:text-rail-purple" />
                </button>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="panel-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={12} className="text-rail-accent" />
              <h3 className="text-xs font-semibold text-white">Copilot Capabilities</h3>
            </div>
            <div className="space-y-2 text-[10px] font-mono text-rail-muted">
              {[
                "🛤️ Route vulnerability analysis",
                "⏱️ Real-time delay prediction",
                "👥 Congestion risk assessment",
                "⚡ Operator action recommendations",
                "🌧️ Weather impact analysis",
                "🔧 Maintenance scheduling",
                "🚨 Emergency response guidance",
                "📊 Network performance reports",
              ].map((cap) => (
                <div key={cap} className="flex items-start gap-1">
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Info */}
          <div className="panel-border rounded-xl p-4">
            <h3 className="text-xs font-semibold text-white mb-3">AI Model Info</h3>
            <div className="space-y-2 text-[10px] font-mono">
              {[
                { label: "Framework", value: "LangGraph", color: "text-rail-purple" },
                { label: "LLM", value: "Gemini Pro", color: "text-rail-accent" },
                { label: "Data Sync", value: "Real-time", color: "text-rail-green" },
                { label: "Context Window", value: "32K tokens", color: "text-rail-text" },
                { label: "Response Time", value: "< 2 sec", color: "text-rail-green" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-rail-muted">{label}</span>
                  <span className={color}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
