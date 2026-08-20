"use client";

import React from "react";
import { Bot, Sparkles, Terminal, Activity } from "lucide-react";
import { AGENT_ROLES } from "@/lib/chat";

interface StreamingBubbleProps {
  content: string;
  activeAgent?: string;
  isStreaming: boolean;
}

export function StreamingBubble({
  content,
  activeAgent = "architect",
  isStreaming,
}: StreamingBubbleProps) {
  if (!isStreaming && !content) return null;

  const agentMeta = AGENT_ROLES[activeAgent] || AGENT_ROLES.architect;

  return (
    <div className="flex flex-col gap-2 my-4 max-w-3xl">
      {/* Agent Header Tag */}
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded-lg ${agentMeta.bg} border ${agentMeta.border}`}>
          <Bot className={`w-3.5 h-3.5 ${agentMeta.color}`} />
        </div>
        <span className={`text-xs font-semibold ${agentMeta.color}`}>
          {agentMeta.label}
        </span>
        {isStreaming && (
          <span className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            Generating live tokens...
          </span>
        )}
      </div>

      {/* Message Content Bubble */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-sm text-zinc-200 text-sm leading-relaxed shadow-lg">
        {content ? (
          <div className="whitespace-pre-wrap font-sans">
            {content}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-500 py-1">
            <Activity className="w-4 h-4 animate-spin text-indigo-400" />
            <span className="text-xs italic">Awaiting response from {agentMeta.label}...</span>
          </div>
        )}
      </div>
    </div>
  );
}
