"use client";

import React, { useState } from "react";
import { AlertCircle, ArrowRight, Play, Sparkles, Bot, ShieldCheck, Loader2 } from "lucide-react";
import { AGENT_ROLES, HandoffInterruptState } from "@/lib/chat";

interface ResumeInterruptWidgetProps {
  interrupt: HandoffInterruptState;
  onResume: (userQuery: string) => Promise<void> | void;
  isResuming: boolean;
}

export function ResumeInterruptWidget({
  interrupt,
  onResume,
  isResuming,
}: ResumeInterruptWidgetProps) {
  const [query, setQuery] = useState("");
  const targetAgentMeta = AGENT_ROLES[interrupt.targetAgent || "architect"] || AGENT_ROLES.architect;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isResuming) return;
    onResume(query || "Proceed with the planned architecture and execution.");
  };

  return (
    <div className="my-6 max-w-3xl rounded-2xl bg-gradient-to-b from-indigo-950/40 via-zinc-900/90 to-zinc-900/90 border border-indigo-500/40 p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Agent Interruption Checkpoint
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                Awaiting Feedback
              </span>
            </div>
            <h4 className="text-sm font-medium text-white mt-0.5">
              Swarm execution paused for confirmation
            </h4>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-xs">
          <span className="text-zinc-400">Active Coordinator:</span>
          <span className={`font-semibold ${targetAgentMeta.color}`}>
            {targetAgentMeta.label}
          </span>
        </div>
      </div>

      {/* Agent Prompt Message */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 text-sm text-zinc-300 mb-4">
        <p className="text-xs text-zinc-400 font-medium mb-1">Checkpoint Message:</p>
        <p className="font-mono text-xs text-indigo-300">
          {interrupt.promptMessage || "Please enter your query or instructions for the active agent:"}
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Your Instructions / Confirmation:
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type instructions (or leave blank to proceed with current plan)..."
            disabled={isResuming}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-500 italic">
            Resuming will return control to the Architect to proceed with worker agent handoffs.
          </span>

          <button
            type="submit"
            disabled={isResuming}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isResuming ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Resuming Swarm...</span>
              </>
            ) : (
              <>
                <span>Continue Execution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
