"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "model";
  content: string;
};

interface TemplateChatProps {
  availableTags: string[];
  onSelectTag: (tag: string | null) => void;
  activeTag: string | null;
}

export default function TemplateChat({ availableTags, onSelectTag, activeTag }: TemplateChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "SYSTEM ONLINE. Describe your project requirements or the type of website you are building, and I will filter the catalog for the optimal template.\n\nBUILD MODE: Start a message with /build — e.g. \"/build a fitness brand called PlayFit\" to auto-adapt the template copy.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat container only (prevents window scrolling)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    const isBuild = /^\/(build|create)\b/i.test(userMessage);

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          tags: availableTags,
          mode: isBuild ? "build" : "filter",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const overridesRaw: unknown[] = Array.isArray(data.overrides) ? data.overrides : [];
      setMessages((prev) => [
        ...prev,
        { role: "model", content: data.reply || "Sorry, I couldn't understand that." },
      ]);

      if (data.suggestedTag && availableTags.includes(data.suggestedTag)) {
        onSelectTag(data.suggestedTag);
      }

      // Build mode: the server pipeline already picked the best-fit template
      // (AI), read its component ids + current texts from the database, and
      // generated a new per-component text JSON. Carry it to the full-screen
      // preview (/templates/[id]?ai=1) where the page fetches the template
      // structure and renders it with the new text applied.
      if (isBuild && typeof data.templateId === "string") {
        const key = `nextflow-ai-overrides:${data.templateId}`;
        sessionStorage.setItem(
          key,
          JSON.stringify({
            overrides: overridesRaw,
            applied: Array.isArray(data.applied) ? data.applied : [],
            templateName: typeof data.templateName === "string" ? data.templateName : null,
          }),
        );
        onSelectTag(null);
        router.push(`/templates/${data.templateId}?ai=1`);
      }

    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : undefined;
      setMessages((prev) => [
        ...prev,
        { role: "model", content: msg ? `ERROR: ${msg}` : "Error connecting to AI. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[300px] max-h-[320px] bg-[#090a0f] border border-white/10 rounded-none shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#0a0b12] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-cyan-400 animate-pulse shrink-0" />
          <h2 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest whitespace-nowrap">Template UI</h2>
        </div>
        {activeTag && (
          <span className="px-2 py-0.5 rounded-none bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            #{activeTag}
          </span>
        )}
      </div>

      {/* Messages Area */}
      <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-[#06070a]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-2 mb-1 opacity-60">
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">
                {msg.role === "user" ? "USER_INPUT" : "SYSTEM_RESPONSE"}
              </span>
            </div>
            <div className={`p-2.5 rounded-none border max-w-[95%] text-xs leading-relaxed ${
              msg.role === "user" 
                ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-50 border-r-2 border-r-cyan-400" 
                : "bg-[#0a0b12] border-white/10 text-slate-300 border-l-2 border-l-slate-400"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start">
             <div className="flex items-center gap-2 mb-1 opacity-60">
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">SYSTEM_PROCESSING</span>
            </div>
            <div className="p-2.5 rounded-none border max-w-[90%] text-xs leading-relaxed bg-[#0a0b12] border-white/10 text-slate-500 flex items-center gap-2 border-l-2 border-l-slate-400">
              <div className="w-1 h-1 bg-slate-500 rounded-none animate-ping" />
              <span className="font-mono text-[10px] tracking-widest uppercase">Computing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-0 border-t border-white/10 bg-[#0a0b12] shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-0 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type requirements..."
            disabled={isLoading}
            className="flex-1 bg-[#06070a] border-none text-white text-[11px] px-3 py-2 rounded-none focus:outline-none focus:ring-1 focus:ring-cyan-500 inset-ring transition-all placeholder:text-slate-600 font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-[9px] uppercase tracking-widest font-extrabold disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-none shrink-0"
          >
            EXECUTE
          </button>
        </form>
      </div>
    </div>
  );
}
