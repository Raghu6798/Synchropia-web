"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Header from "@/components/layout/Header";
import { ActivityFeed } from "@/components/synchropia/ActivityFeed";
import { getServiceConfig } from "@/lib/oauth-config";
import { fetchBackend } from "@/lib/backend";
import {
  Shield,
  RefreshCw,
  Cpu,
  Layers,
  GitBranch,
  Activity,
  Building2,
  CheckCircle2,
  XCircle,
  Loader2,
  Database,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type OnboardingData = {
  onboarding: boolean;
  step: number;
  completed: number[];
  isComplete: boolean;
  profile?: { name: string; oktaDomain?: string };
  services: Record<string, { connected: boolean; orgName?: string }>;
};

type RunDay = { date: string; runs: number };

type DashboardStats = {
  summary: {
    total_runs: number;
    total_tool_calls: number;
    total_agents: number;
    active_runs: number;
  };
  runs_by_status: Record<string, number>;
  runs_by_day: RunDay[];
  tool_calls: { SUCCESS: number; ERROR: number; total: number };
  agents_by_status: Record<string, number>;
  quality: {
    project_key: string;
    status: string;
    bugs: number | null;
    vulnerabilities: number | null;
    code_smells: number | null;
    coverage: number | null;
    created_at: string | null;
  }[];
};

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "#34d399",
  RUNNING: "#38bdf8",
  PENDING: "#fbbf24",
  FAILED: "#fb7185",
};

const CHART_CONFIG: ChartConfig = {
  runs: {
    label: "Runs",
    color: "#6d7cff",
  },
};

function formatNumber(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/v1/onboarding/status");
<<<<<<< HEAD
      const statusData: OnboardingData = await res.json();
      setData(statusData);

      if (statusData && !statusData.isComplete) {
        router.push("/onboarding");
=======
      if (res.ok) {
        const statusData: OnboardingData = await res.json();
        setData(statusData);
        if (!statusData.isComplete) {
          router.push("/onboarding");
        }
>>>>>>> origin/fronted_features
      }
    } catch (err) {
      console.error("Failed to load onboarding status", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchStats = async (silent = false) => {
    if (!silent) setStatsLoading(true);
    try {
      const res = await fetchBackend("/api/v1/dashboard/stats?days=14");
      if (res.ok) {
        const s: DashboardStats = await res.json();
        setStats(s);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!session) {
      router.push("/login");
      return;
    }

    let ignore = false;

    const init = async () => {
      try {
        const res = await fetch("/api/v1/onboarding/status");
        const statusData: OnboardingData = await res.json();
        if (ignore) return;
        setData(statusData);
        if (statusData && !statusData.isComplete) {
          router.push("/onboarding");
        }
      } catch (err) {
        console.error("Failed to load onboarding status", err);
      } finally {
        if (!ignore) setLoading(false);
      }

      try {
        const statsRes = await fetchBackend("/api/v1/dashboard/stats?days=14");
        if (ignore) return;
        if (statsRes.ok) {
          const s: DashboardStats = await statsRes.json();
          setStats(s);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        if (!ignore) setStatsLoading(false);
      }
    };

    init();

    return () => {
      ignore = true;
    };
  }, [session, sessionLoading, router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStatus();
    fetchStats(true);
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted-foreground">
        <RefreshCw className="w-8 h-8 text-foreground/50 animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Loading workspace…</p>
      </div>
    );
  }

  if (!session) return null;

  const connectedServices = Object.keys(data?.services || {}).filter(
    (key) => data?.services[key]?.connected,
  );

  const summary = stats?.summary ?? {
    total_runs: 0,
    total_tool_calls: 0,
    total_agents: 0,
    active_runs: 0,
  };

  const statusEntries = Object.entries(stats?.runs_by_status ?? {}).filter(
    ([, count]) => count > 0,
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden select-none">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 relative z-10 mt-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Swarm orchestration
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1.5 font-medium">
              Live agent delivery metrics and run history from the Synchropia
              backend.
            </p>
          </div>
<<<<<<< HEAD
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border hover:bg-accent/60 text-foreground rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
=======
          <div className="flex items-center gap-2">
            <Link
              href="/chat"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open Chat Workspace</span>
            </Link>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh State
            </button>
          </div>
>>>>>>> origin/fronted_features
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Active runs"
            value={formatNumber(summary.active_runs)}
            hint="Pending or running"
            icon={<Cpu className="w-4 h-4 text-sky-400" />}
            loading={statsLoading}
          />
          <MetricCard
            label="Connected tools"
            value={`${connectedServices.length} / 5`}
            hint="Developer toolchain integrations"
            icon={<Layers className="w-4 h-4 text-foreground/60" />}
            loading={loading}
          />
          <MetricCard
            label="Total runs"
            value={formatNumber(summary.total_runs)}
            hint="All orchestration runs"
            icon={<GitBranch className="w-4 h-4 text-foreground/60" />}
            loading={statsLoading}
          />
          <MetricCard
            label="Tool calls"
            value={formatNumber(summary.total_tool_calls)}
            hint="Agent tool executions"
            icon={<Activity className="w-4 h-4 text-foreground/60" />}
            loading={statsLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-5 rounded-2xl bg-card border border-border/80">
              <h3 className="text-sm font-bold text-foreground/80 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-foreground/60" />
                Active organization
              </h3>
              <div className="flex items-center gap-3 p-3 bg-background/40 border border-border/80 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
                  {data?.profile?.name?.slice(0, 2).toUpperCase() || "OR"}
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {data?.profile?.name || "Organization"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {data?.profile?.oktaDomain || "Local authentication ID"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground/80">
                  Integration connections
                </h3>
                <span className="text-[10px] font-semibold text-foreground/60 bg-accent/60 px-2 py-0.5 rounded-full">
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
                      className="flex items-center justify-between p-3 bg-background/40 border border-border/80 rounded-xl hover:border-border transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-xs">
                          {connected ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground/40" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold capitalize">
                            {cfg?.label || s}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[120px] mt-0.5">
                            {connected
                              ? orgName || "Connected"
                              : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={
                          connected ? "#" : `/api/v1/services/${s}/authorize`
                        }
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                          connected
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-background hover:bg-accent/60 text-muted-foreground border border-border"
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

          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-card border border-border/80">
                <h3 className="text-sm font-bold text-foreground/80 mb-1 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-foreground/60" />
                  Runs last 14 days
                </h3>
                <p className="text-[10px] text-muted-foreground mb-3">
                  Orchestration runs per day
                </p>
                {statsLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                  </div>
                ) : (
                  <ChartContainer
                    config={CHART_CONFIG}
                    className="h-40 aspect-auto"
                  >
                    <AreaChart
                      data={stats?.runs_by_day ?? []}
                      margin={{ left: -20, right: 8, top: 4, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="fillRuns"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6d7cff"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6d7cff"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(d: string) => d.slice(5)}
                      />
                      <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Area
                        dataKey="runs"
                        type="monotone"
                        fill="url(#fillRuns)"
                        stroke="#6d7cff"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border/80">
                <h3 className="text-sm font-bold text-foreground/80 mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-foreground/60" />
                  Runs by status
                </h3>
                <p className="text-[10px] text-muted-foreground mb-3">
                  Pipeline outcome distribution
                </p>
                {statsLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                  </div>
                ) : statusEntries.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">
                    No runs recorded yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(STATUS_COLORS).map(([status, color]) => {
                      const count = stats?.runs_by_status?.[status] ?? 0;
                      const total = Math.max(summary.total_runs, 1);
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={status} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 capitalize text-foreground/80">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              {status.toLowerCase()}
                            </span>
                            <span className="text-muted-foreground font-mono">
                              {count}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-background overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon,
  loading,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border/80">
      <div className="flex items-center justify-between text-muted-foreground mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
        {icon}
      </div>
      {loading ? (
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin mb-1" />
      ) : (
        <p className="text-2xl font-bold">{value}</p>
      )}
      <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}
