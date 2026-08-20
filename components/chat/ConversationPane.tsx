"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Cpu,
  Layers,
  Menu,
  Terminal,
  Paperclip,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  ChatMessage,
  ChatStreamEvent,
  ChatStreamRequest,
  HandoffInterruptState,
  AGENT_ROLES,
} from "@/lib/chat";
import { StreamingBubble } from "./StreamingBubble";
import { HandoffBadge } from "./HandoffBadge";
import { ResumeInterruptWidget } from "./ResumeInterruptWidget";

interface ConversationPaneProps {
  threadId: string;
  messages: ChatMessage[];
  streamingContent: string;
  isStreaming: boolean;
  activeAgent: string;
  handoffEvents: { source: string; target: string; tool?: string; time: string }[];
  interrupt: HandoffInterruptState | null;
  onSendMessage: (prompt: string, provider: string, model: string) => void;
  onResumeInterrupt: (query: string) => void;
  isResuming: boolean;
  onToggleSidebarMobile?: () => void;
  orgName?: string;
  orgId?: string | null;
}

const AVAILABLE_MODELS = [
  { provider: "sambanova", model: "gpt-oss-120b", label: "GPT OSS 120B (SambaNova)" },
  { provider: "groq", model: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (Groq)" },
  { provider: "google", model: "gemini-2.0-flash", label: "Gemini 2.0 Flash (Google)" },
];

export function ConversationPane({
  threadId,
  messages,
  streamingContent,
  isStreaming,
  activeAgent,
  handoffEvents,
  interrupt,
  onSendMessage,
  onResumeInterrupt,
  isResuming,
  onToggleSidebarMobile,
  orgName = "Synchropia Workspace",
  orgId,
}: ConversationPaneProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedModelIdx, setSelectedModelIdx] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages or streaming chunks
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, handoffEvents, interrupt]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isStreaming || isResuming) return;
    const { provider, model } = AVAILABLE_MODELS[selectedModelIdx];
    onSendMessage(prompt.trim(), provider, model);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0D0E12] text-zinc-100 overflow-hidden relative">
      {/* Top Navbar */}
      <header className="h-14 border-b border-zinc-800/80 px-4 flex items-center justify-between bg-zinc-950/70 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebarMobile}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-200">
              {orgName}
            </span>
            <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline-block">
              thread: {threadId.slice(0, 8)}...
            </span>
          </div>
        </div>

        {/* Model Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400 hidden sm:inline-block">
            Model:
          </label>
          <select
            value={selectedModelIdx}
            onChange={(e) => setSelectedModelIdx(Number(e.target.value))}
            disabled={isStreaming || isResuming}
            className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1 text-xs text-indigo-300 font-medium focus:outline-none focus:border-indigo-500 disabled:opacity-50 cursor-pointer"
          >
            {AVAILABLE_MODELS.map((m, idx) => (
              <option key={m.model} value={idx}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4 max-w-4xl w-full mx-auto scrollbar-thin scrollbar-thumb-zinc-800">
        {messages.length === 0 && !isStreaming && !interrupt && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4 shadow-xl">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Autonomous Swarm Workspace
            </h2>
            <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed">
              Describe a feature, task, or bug fix. Synchropia will orchestrate the Architect, PM, DevOps, SDE, and QA agents to design, implement, and verify your delivery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg w-full text-left">
              {[
                "Create a user authentication microservice with JWT & PostgreSQL",
                "Draft architecture for rate-limiting Redis gateway & SonarQube gates",
                "Scaffold fullstack Next.js dashboard with Kafka event streaming",
                "Implement end-to-end QA tests with Playwright and Vitest",
              ].map((sample) => (
                <button
                  key={sample}
                  onClick={() => setPrompt(sample)}
                  className="p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-all hover:scale-[1.01]"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Existing Messages */}
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const agentMeta = AGENT_ROLES[msg.sender] || AGENT_ROLES.system;

          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1.5 ${
                isUser ? "items-end ml-auto" : "items-start mr-auto"
              } max-w-3xl`}
            >
              {/* Header Label */}
              <div className="flex items-center gap-1.5 px-1">
                {isUser ? (
                  <>
                    <span className="text-[11px] text-zinc-400 font-medium">You</span>
                    <div className="p-0.5 rounded bg-zinc-800 text-zinc-300">
                      <User className="w-3 h-3" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`p-0.5 rounded ${agentMeta.bg} ${agentMeta.color}`}>
                      <Bot className="w-3 h-3" />
                    </div>
                    <span className={`text-[11px] font-semibold ${agentMeta.color}`}>
                      {agentMeta.label}
                    </span>
                  </>
                )}
              </div>

              {/* Bubble Body */}
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-zinc-900/90 text-zinc-200 border border-zinc-800/80 rounded-tl-sm backdrop-blur-sm"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}

        {/* Handoff Event Badges */}
        {handoffEvents.map((ev, i) => (
          <HandoffBadge
            key={`handoff-${i}`}
            sourceAgent={ev.source}
            targetAgent={ev.target}
            toolName={ev.tool}
            timestamp={ev.time}
          />
        ))}

        {/* Live Streaming Tokens Bubble */}
        {isStreaming && (
          <StreamingBubble
            content={streamingContent}
            activeAgent={activeAgent}
            isStreaming={isStreaming}
          />
        )}

        {/* Inline Interruption Checkpoint Widget */}
        {interrupt && (
          <ResumeInterruptWidget
            interrupt={interrupt}
            onResume={onResumeInterrupt}
            isResuming={isResuming}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <footer className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-end gap-2 bg-zinc-900/90 border border-zinc-700/80 rounded-2xl p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-xl"
        >
          <textarea
            ref={inputRef}
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              interrupt
                ? "Interruption active — use the confirmation widget above to continue..."
                : "Ask Synchropia to orchestrate an architecture or feature..."
            }
            disabled={isStreaming || isResuming || !!interrupt}
            className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none px-2 py-1 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!prompt.trim() || isStreaming || isResuming || !!interrupt}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md shadow-indigo-600/20"
          >
            {isStreaming ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        <div className="max-w-4xl mx-auto flex items-center justify-between text-[10px] text-zinc-500 mt-1.5 px-2">
          <span>Press Enter to send, Shift + Enter for new line</span>
          <span>FastAPI Swarm • Kafka SSE Stream</span>
        </div>
      </footer>
    </div>
  );
}
