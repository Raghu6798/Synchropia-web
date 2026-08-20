"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchBackend } from "@/lib/backend";
import {
  Activity,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  GitBranch,
} from "lucide-react";

export type RunStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export type RunRecord = {
  id: string;
  status: RunStatus;
  current_agent: string | null;
  error_message: string | null;
  title: string;
  agent_count: number;
  created_at: string | null;
  updated_at: string | null;
};

const STATUS_STYLES: Record<RunStatus, { dot: string; label: string }> = {
  PENDING: { dot: "bg-amber-400", label: "Pending" },
  RUNNING: { dot: "bg-sky-400 animate-pulse", label: "Running" },
  COMPLETED: { dot: "bg-emerald-400", label: "Completed" },
  FAILED: { dot: "bg-rose-400", label: "Failed" },
};

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function ActivityFeed() {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    fetchBackend("/api/v1/runs?limit=25")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Backend returned ${res.status}`);
        return res.json() as Promise<RunRecord[]>;
      })
      .then((data) => {
        setRuns(data);
        setError(null);
      })
      .catch(() => {
        setError(
          "Could not reach the backend at :8000 — is the Synchropia API running?",
        );
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    const run = () => load(true);
    run();
    pollRef.current = setInterval(run, 8000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [load]);

  const handleRefresh = () => {
    setRefreshing(true);
    load(true);
  };

  const activeCount = runs.filter(
    (r) => r.status === "RUNNING" || r.status === "PENDING",
  ).length;

  return (
    <div className="flex-1 min-h-[400px] flex flex-col rounded-2xl overflow-hidden border border-border/80 bg-card/60 backdrop-blur-xl">
      <div className="px-5 py-3.5 border-b border-border/80 bg-background/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-foreground/70" />
          <span className="text-xs font-semibold text-foreground/80">
            Recent orchestration runs
          </span>
          {activeCount > 0 && (
            <span className="text-[10px] font-semibold bg-sky-500/10 text-sky-500 border border-sky-500/25 px-2 py-0.5 rounded-full">
              {activeCount} active
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-1.5 rounded-lg border border-border bg-background/50 hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          title="Refresh activity"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading && runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs">Loading run history…</span>
          </div>
        ) : error && runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground px-6 text-center">
            <XCircle className="w-6 h-6 text-rose-400" />
            <span className="text-xs leading-relaxed">{error}</span>
          </div>
        ) : runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground px-6 text-center">
            <GitBranch className="w-6 h-6 opacity-50" />
            <span className="text-xs">
              No runs yet. Trigger a swarm from the chat console and it will
              appear here.
            </span>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {runs.map((run) => {
              const style = STATUS_STYLES[run.status] ?? STATUS_STYLES.PENDING;
              return (
                <li
                  key={run.id}
                  className="px-5 py-3.5 flex items-center gap-3"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground/90 truncate">
                      {run.title || "Untitled run"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                      {run.current_agent ?? "orchestrator"}
                      {run.agent_count > 0 && ` · ${run.agent_count} agents`}
                    </p>
                    {run.status === "FAILED" && run.error_message && (
                      <p className="text-[11px] text-rose-400 mt-1 truncate">
                        {run.error_message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {run.status === "COMPLETED" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : run.status === "FAILED" ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {timeAgo(run.created_at)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="px-5 py-2.5 border-t border-border/80 bg-background/40 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Auto-refreshes every 8s</span>
        <span>{runs.length} runs</span>
      </div>
    </div>
  );
}
