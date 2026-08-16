"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  MessageSquarePlus,
  Bot,
  Layers,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowLeft,
  Activity,
  CheckCircle2,
  AlertCircle,
  Cpu
} from "lucide-react";
import { ChatSessionSummary } from "@/lib/chat";

interface ChatSidebarProps {
  sessions: ChatSessionSummary[];
  activeThreadId?: string;
  onNewChat: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function ChatSidebar({
  sessions,
  activeThreadId,
  onNewChat,
  isOpenMobile,
  onCloseMobile,
}: ChatSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "RUNNING":
        return (
          <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            In Progress
          </span>
        );
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Completed
          </span>
        );
      case "FAILED":
        return (
          <span className="flex items-center gap-1 text-[10px] font-medium text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
            <AlertCircle className="w-2.5 h-2.5" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0B0C10]/95 backdrop-blur-xl border-r border-zinc-800/70 flex flex-col transition-transform duration-300 md:translate-x-0 ${
        isOpenMobile ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold tracking-wide uppercase">
          <Cpu className="w-3 h-3" />
          <span>Swarm OS</span>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>New Swarm Session</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="px-2 pb-1 text-[11px] font-medium text-zinc-500 uppercase tracking-wider flex items-center justify-between">
          <span>Recent Conversations</span>
          <span className="text-[10px] text-zinc-600">{sessions.length}</span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-10 px-4">
            <Bot className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">No previous sessions</p>
            <p className="text-[11px] text-zinc-600 mt-1">Start a task to orchestrate your agent swarm</p>
          </div>
        ) : (
          sessions.map((sess) => {
            const isSelected = activeThreadId === sess.id;
            return (
              <button
                key={sess.id}
                onClick={() => {
                  router.push(`/chat/${sess.id}`);
                  onCloseMobile?.();
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex flex-col gap-1 group relative ${
                  isSelected
                    ? "bg-zinc-800/90 text-white border border-indigo-500/40 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium truncate max-w-[170px] text-zinc-200 group-hover:text-white">
                    {sess.title || "Untitled Swarm Task"}
                  </span>
                  <ChevronRight
                    className={`w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-transform ${
                      isSelected ? "text-indigo-400 translate-x-0.5" : ""
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {formatTime(sess.created_at)}
                  </span>
                  {getStatusBadge(sess.status)}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-zinc-800/70 bg-zinc-950/60 flex items-center justify-between text-[11px] text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Swarm Cluster Ready</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-600">v1.2</span>
      </div>
    </aside>
  );
}
