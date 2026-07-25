"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Header from "@/components/layout/Header";
import { AgentTerminal } from "@/components/synchropia/AgentTerminal";
import { SwarmGrid } from "@/components/synchropia/SwarmGrid";
import { getServiceConfig } from "@/lib/oauth-config";
import {
  Shield,
  Activity,
  GitBranch,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  ArrowRight,
} from "lucide-react";

type OnboardingData = {
  onboarding: boolean;
  step: number;
  completed: number[];
  isComplete: boolean;
  profile?: { name: string; oktaDomain?: string };
  services: Record<string, { connected: boolean; orgName?: string }>;
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/v1/onboarding/status");
      const statusData: OnboardingData = await res.json();
      setData(statusData);
      
      // If onboarding is not complete, redirect to onboarding page
      if (statusData && !statusData.isComplete) {
        router.push("/onboarding");
      }
    } catch (err) {
      console.error("Failed to load onboarding status", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        router.push("/login");
      } else {
        fetchStatus();
      }
    }
  }, [session, sessionLoading, router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStatus();
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0D0E12] flex flex-col items-center justify-center text-white/50">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Initializing agent console...</p>
      </div>
    );
  }

  if (!session) return null;

  const connectedServices = Object.keys(data?.services || {}).filter(
    (key) => data?.services[key]?.connected
  );

  return (
    <div className="min-h-screen bg-[#0D0E12] text-white flex flex-col relative overflow-hidden select-none">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Shared Header Component */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 relative z-10 mt-16">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Swarm Orchestration Console
            </h1>
            <p className="text-white/40 text-xs sm:text-sm mt-1.5 font-medium">
              Real-time workspace integration metrics and active agent delivery streams.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh State
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Swarms</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold">1</p>
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Running ticket pipeline
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Connected Tools</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold">{connectedServices.length} / 5</p>
            <p className="text-[10px] text-white/40 mt-1">
              Active developer toolchain integrations
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Commits</span>
              <GitBranch className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-bold">14</p>
            <p className="text-[10px] text-sky-400 mt-1">
              Swarm agent commits this week
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Deployments</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-[10px] text-purple-400 mt-1">
              Successful builds deployed to staging
            </p>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Integrations & Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Organization Info */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-bold text-white/80 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                Active Organization
              </h3>
              <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/20">
                  {data?.profile?.name?.slice(0, 2).toUpperCase() || "OR"}
                </div>
                <div>
                  <p className="text-sm font-bold">{data?.profile?.name || "Organization"}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {data?.profile?.oktaDomain || "Local authentication ID"}
                  </p>
                </div>
              </div>
            </div>

            {/* Connection Status List */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white/80">Integration Connections</h3>
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  Status
                </span>
              </div>
              <div className="space-y-3">
                {["github", "gitlab", "jira", "sonarqube", "slack"].map((s) => {
                  const cfg = getServiceConfig(s);
                  const connected = data?.services?.[s]?.connected;
                  const orgName = data?.services?.[s]?.orgName;

                  return (
                    <div
                      key={s}
                      className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-xs">
                          {connected ? "🟢" : "⚪"}
                        </div>
                        <div>
                          <p className="text-xs font-bold capitalize">{cfg?.label || s}</p>
                          <p className="text-[10px] text-white/40 truncate max-w-[120px] mt-0.5">
                            {connected ? (orgName || "Connected") : "Not Connected"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={connected ? "#" : `/api/v1/services/${s}/authorize`}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                          connected
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
                        }`}
                      >
                        {connected ? "Active" : "Connect"}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel: Active Logs (AgentTerminal) */}
          <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
            {/* Terminal Logs */}
            <div className="flex-1 min-h-[400px] flex flex-col rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
              <div className="px-5 py-3.5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-white/80 ml-2">live-swarm-orchestrator.log</span>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                  Streaming
                </span>
              </div>
              <div className="flex-1 flex flex-col p-2">
                <AgentTerminal />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
