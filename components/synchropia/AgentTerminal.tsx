"use client";

import React, { useEffect, useState, useRef } from "react";
import { Terminal, Play, Pause, Trash2, ArrowDownCircle, ShieldCheck } from "lucide-react";

interface LogMessage {
  id: string;
  time: string;
  source: "ORCHESTRATOR" | "SDE" | "DATA" | "DEVOPS" | "QA" | "SYSTEM";
  message: string;
}

const LOG_TEMPLATES: Omit<LogMessage, "id" | "time">[] = [
  { source: "SYSTEM", message: "Initial startup sequence complete. Standing by for instructions..." },
  { source: "ORCHESTRATOR", message: "Incoming feature request received from Jira: 'Implement user password reset flow'" },
  { source: "ORCHESTRATOR", message: "Analyzing project scope and mapping dependencies. Initiating Product Delivery Swarm..." },
  { source: "SDE", message: "Frontend Agent initialized. Pulling UI specs from lightswind tokens..." },
  { source: "SDE", message: "Backend Agent initialized. Scaffolding password reset route, generating schema patch..." },
  { source: "DEVOPS", message: "Spinning up sandboxed workspace inside private VPC subnet..." },
  { source: "SDE", message: "Backend code generated. Formulating Drizzle migration..." },
  { source: "SDE", message: "Frontend code generated. Integrating verification forms with react-hook-form..." },
  { source: "DEVOPS", message: "Provisioning RDS instances and syncing database state in isolated cluster..." },
  { source: "QA", message: "QA Agent triggered. Constructing Playwright E2E tests for verification flow..." },
  { source: "QA", message: "Running E2E tests: Checking password-strength validation... PASS" },
  { source: "QA", message: "Running E2E tests: Testing email notification delivery... PASS" },
  { source: "DEVOPS", message: "Assembling candidate bundle. Launching Vitest unit tests suite..." },
  { source: "SYSTEM", message: "All test phases complete. Success rate: 100%. Code compilation clean." },
  { source: "ORCHESTRATOR", message: "Generating pull request #284 in GitHub Repository: 'feat/password-reset'" },
  { source: "SYSTEM", message: "Deploy candidate staged. Slack notification broadcast sent to #synchropia-alerts." },
  { source: "ORCHESTRATOR", message: "Awaiting signed human-in-the-loop PR approval to merge into main..." },
  { source: "DATA", message: "Data Swarm activated: Data Engineer triggered for pipeline updates..." },
  { source: "DATA", message: "Glue ETL job initiated. Syncing customer plane password metrics to Aurora warehouse..." },
  { source: "DATA", message: "Databricks cluster processing user login telemetry for fraud detection..." },
  { source: "DATA", message: "GenAI Engineer building custom prompt embedding for agent recommendations..." }
];

export function AgentTerminal() {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const templateIndexRef = useRef(0);

  // Helper to generate current timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(" ")[0];
  };

  // Add a log entry
  const addLog = () => {
    const template = LOG_TEMPLATES[templateIndexRef.current];
    const newLog: LogMessage = {
      id: Math.random().toString(36).substring(7),
      time: getTimestamp(),
      ...template
    };

    setLogs((prev) => [...prev, newLog].slice(-100)); // Limit to last 100 logs
    templateIndexRef.current = (templateIndexRef.current + 1) % LOG_TEMPLATES.length;
  };

  // Initialize with a few starter logs
  useEffect(() => {
    const initialLogs: LogMessage[] = [];
    for (let i = 0; i < 5; i++) {
      const template = LOG_TEMPLATES[i];
      const now = new Date();
      now.setSeconds(now.getSeconds() - (15 - i * 3));
      initialLogs.push({
        id: `init-${i}`,
        time: now.toTimeString().split(" ")[0],
        ...template
      });
    }
    setLogs(initialLogs);
    templateIndexRef.current = 5;
  }, []);

  // Periodic log generation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        addLog();
      }, 2000 + Math.random() * 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Scroll to bottom
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Styling helper based on source
  const getSourceStyle = (source: LogMessage["source"]) => {
    switch (source) {
      case "ORCHESTRATOR":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/30";
      case "SDE":
        return "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/30";
      case "DATA":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/30";
      case "DEVOPS":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/30";
      case "QA":
        return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/30";
      case "SYSTEM":
      default:
        return "text-zinc-650 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800/30";
    }
  };

  return (
    <div className="w-full py-16 bg-background text-foreground px-4 sm:px-6 lg:px-8 border-t border-border transition-colors duration-300" id="terminal">
      <div className="max-w-5xl mx-auto">
        {/* Terminal Wrapper */}
        <div className="border border-border/80 dark:border-zinc-800 rounded-3xl bg-card/65 dark:bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl">
          {/* Terminal Titlebar */}
          <div className="flex items-center justify-between px-6 py-4 bg-muted/65 dark:bg-zinc-900/60 border-b border-border/60 dark:border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 animate-pulse">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500/80 block" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500/80 block" />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 block" />
              </div>
              <div className="h-4 w-[1px] bg-border dark:bg-zinc-800 mx-1" />
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground font-medium">
                <Terminal className="w-4 h-4 text-sky-500 dark:text-sky-400 animate-pulse" />
                <span>global-heartbeat@synchropia:~$ log-stream --follow</span>
              </div>
            </div>
            
            {/* Terminal Actions */}
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg border border-border bg-card dark:bg-zinc-900 hover:bg-muted dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
                title={isPlaying ? "Pause stream" : "Play stream"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              </button>
              
              {/* Clear */}
              <button 
                onClick={() => setLogs([])}
                className="p-1.5 rounded-lg border border-border bg-card dark:bg-zinc-900 hover:bg-muted dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
                title="Clear terminal logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              {/* Auto Scroll toggle */}
              <button 
                onClick={() => setAutoScroll(!autoScroll)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  autoScroll 
                    ? "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/40 text-sky-600 dark:text-sky-400" 
                    : "bg-card dark:bg-zinc-900 border-border dark:border-zinc-800 text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800 hover:text-foreground dark:hover:text-white"
                }`}
                title="Toggle Auto-Scroll"
              >
                <ArrowDownCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Terminal Logging Window */}
          <div 
            ref={scrollRef}
            className="p-6 h-[400px] overflow-y-auto font-mono text-sm leading-relaxed space-y-3 scrollbar-thin scrollbar-thumb-border dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
          >
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500/60 dark:text-zinc-650 gap-2">
                <Terminal className="w-8 h-8 opacity-40 animate-pulse" />
                <span className="text-xs select-none">No active logs. Click play or trigger events to stream.</span>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 select-text group py-0.5 px-1.5 rounded hover:bg-foreground/5 transition-colors">
                  {/* Timestamp */}
                  <span className="text-zinc-500 text-xs font-mono select-none pt-0.5">{log.time}</span>
                  
                  {/* Tag */}
                  <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border leading-none shrink-0 font-sans select-none ${getSourceStyle(log.source)}`}>
                    {log.source}
                  </span>
                  
                  {/* Message */}
                  <span className={`text-foreground/90 dark:text-zinc-300 font-mono ${
                    log.message.includes("PASS") ? "text-emerald-600 dark:text-emerald-400 font-bold" :
                    log.message.includes("Success rate") ? "font-black text-emerald-600 dark:text-emerald-400" :
                    log.message.includes("dependencies") ? "text-foreground dark:text-zinc-200" :
                    ""
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
            
            {/* Pulsing prompt indicator */}
            {isPlaying && (
              <div className="flex items-center gap-2 pl-1 select-none pt-1">
                <span className="w-1.5 h-3 bg-sky-500 dark:bg-sky-400 animate-pulse" />
                <span className="text-xs text-muted-foreground italic">Streaming active swarms...</span>
              </div>
            )}
          </div>

          {/* Terminal Footer Info */}
          <div className="px-6 py-3 bg-card/90 dark:bg-zinc-950 border-t border-border/60 dark:border-zinc-900/80 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              Agent Isolation Level: High (Private Subnet VPC)
            </span>
            <span>Logs Count: {logs.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
