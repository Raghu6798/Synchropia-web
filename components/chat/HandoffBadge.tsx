"use client";

import React from "react";
import { ArrowRight, Bot, Sparkles, Terminal, ShieldAlert, Cpu } from "lucide-react";
import { AGENT_ROLES } from "@/lib/chat";

interface HandoffBadgeProps {
  sourceAgent?: string;
  targetAgent?: string;
  toolName?: string;
  timestamp?: string;
}

export function HandoffBadge({
  sourceAgent = "architect",
  targetAgent = "pm",
  toolName,
  timestamp,
}: HandoffBadgeProps) {
  const sourceMeta = AGENT_ROLES[sourceAgent] || AGENT_ROLES.architect;
  const targetMeta = AGENT_ROLES[targetAgent] || AGENT_ROLES.pm;

  return (
    <div className="my-3 flex items-center justify-center">
      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md shadow-md">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium ${sourceMeta.color}`}>
            {sourceMeta.label}
          </span>
        </div>

        <div className="flex items-center gap-1 text-zinc-500">
          <ArrowRight className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-semibold ${targetMeta.color}`}>
            {targetMeta.label}
          </span>
        </div>

        {toolName && (
          <span className="ml-1.5 px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800/80 rounded border border-zinc-700/50">
            {toolName}
          </span>
        )}
      </div>
    </div>
  );
}
