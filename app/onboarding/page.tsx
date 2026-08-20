"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getServiceConfig, type OAuthServiceConfig } from "@/lib/oauth-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PixelBlast from "@/components/PixelBlast";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Rocket,
  Zap,
  Shield,
  GitBranch,
  Code2,
  Server,
  Building2,
} from "lucide-react";

type OnboardingData = {
  onboarding: boolean;
  step: number;
  completed: number[];
  isComplete: boolean;
  profile?: { step: number };
  services: Record<string, { connected: boolean; orgName?: string }>;
};

type StepDef = {
  id: string;
  label: string;
  service: string;
  icon: React.ReactNode;
};

const ACCENT = "#6d7cff";

const STEPS: StepDef[] = [
  {
    id: "profile",
    label: "Organization",
    service: "",
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: "github",
    label: "GitHub",
    service: "github",
    icon: <Code2 className="w-4 h-4" />,
  },
  {
    id: "gitlab",
    label: "GitLab",
    service: "gitlab",
    icon: <GitBranch className="w-4 h-4" />,
  },
  {
    id: "jira",
    label: "Jira",
    service: "jira",
    icon: <Server className="w-4 h-4" />,
  },
  {
    id: "sonarqube",
    label: "SonarQube",
    service: "sonarqube",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: "slack",
    label: "Slack",
    service: "slack",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "review",
    label: "Review",
    service: "",
    icon: <Rocket className="w-4 h-4" />,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({ name: "", oktaDomain: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/onboarding/status")
      .then((r) => r.json())
      .then((d: OnboardingData) => {
        setData(d);
        setCurrentStep(d.step);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load onboarding status");
        setLoading(false);
      });
  }, []);

  const { data: session, refetch } = authClient.useSession();

  useEffect(() => {
    if (!session && !loading) {
      router.push("/login");
    }
  }, [session, loading, router]);

  const isConnected = (service: string) =>
    data?.services?.[service]?.connected ?? false;
  const isCompleted = (step: number) =>
    data?.completed?.includes(step) ?? false;
  const canProceed = (step: number) =>
    step === 0 ? profile.name.trim().length > 0 : true;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConnect = async (service: string) => {
    window.location.href = `/api/v1/services/${service}/authorize`;
  };

  const handleSaveProfile = async () => {
    setError(null);
    setSaving(true);
    const res = await fetch("/api/v1/onboarding/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    if (res.ok) {
      await refetch();
      const statusRes = await fetch("/api/v1/onboarding/status");
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setData(statusData);
      }
      handleNext();
    } else {
      setError("Failed to save organization profile");
    }
  };

  const handleComplete = async () => {
    await fetch("/api/v1/onboarding/complete", { method: "POST" });
    router.push("/");
  };

  if (data?.isComplete) {
    router.push("/");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
      </div>
    );
  }

  const serviceConfig =
    currentStep > 0 && currentStep < 6
      ? getServiceConfig(STEPS[currentStep].service)
      : null;

  const step = currentStep;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <PixelBlast
        variant="diamond"
        pixelSize={4}
        color="#4c4f8a"
        patternScale={2.4}
        patternDensity={0.55}
        pixelSizeJitter={0.35}
        enableRipples
        rippleSpeed={0.25}
        rippleThickness={0.12}
        rippleIntensityScale={1.2}
        speed={0.3}
        edgeFade={0.35}
        transparent
      />
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              synchropia
            </span>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
              workspace setup
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Connect your workspace
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Link your development toolchain so the agent swarm can operate
            against your real infrastructure.
          </p>
        </div>

        <Progress value={progress} className="mb-8 h-1.5" />

        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {STEPS.map((s, i) => {
            const completed = isCompleted(i);
            const active = i === step;
            return (
              <div key={s.id} className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => isCompleted(i) && setCurrentStep(i)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm whitespace-nowrap transition-all ${
                    active
                      ? "border-border bg-accent/60 text-foreground"
                      : completed
                        ? "border-border/60 bg-transparent text-foreground/80 hover:bg-accent/40"
                        : "border-transparent text-muted-foreground/50 hover:text-muted-foreground"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold border ${
                      active
                        ? "border-transparent"
                        : completed
                          ? "border-transparent"
                          : "border-border"
                    }`}
                    style={
                      active || completed
                        ? {
                            backgroundColor: completed ? ACCENT : "transparent",
                            color: completed ? "#0b0c10" : ACCENT,
                            boxShadow: active
                              ? `0 0 0 3px ${ACCENT}22, 0 0 12px ${ACCENT}44`
                              : undefined,
                          }
                        : undefined
                    }
                  >
                    {completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className={active ? "text-foreground" : undefined}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-6 h-px ${completed ? "bg-border" : "bg-border/40"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-destructive/10 border border-destructive/25 rounded-lg flex items-center gap-2.5 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <Card className="border-border/80 bg-card/70 backdrop-blur-xl shadow-2xl shadow-black/40">
          <CardContent className="p-8">
            {step === 0 && (
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-xl">
                    Organization profile
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Agents use this context to scope their work and target the
                    right repositories.
                  </CardDescription>
                </CardHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization name</Label>
                    <Input
                      id="org-name"
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      placeholder="e.g. Synchropia Inc"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="okta-domain">Okta domain</Label>
                    <Input
                      id="okta-domain"
                      type="text"
                      value={profile.oktaDomain}
                      onChange={(e) =>
                        setProfile({ ...profile, oktaDomain: e.target.value })
                      }
                      placeholder="your-org.okta.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Used to authenticate team members and provision access.
                    </p>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={!canProceed(step) || saving}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4 mr-2" />
                      )}
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step >= 1 && step <= 5 && serviceConfig && (
              <ServiceConnectionCard
                config={serviceConfig}
                connected={isConnected(serviceConfig.id)}
                onConnect={() => handleConnect(serviceConfig.id)}
              />
            )}

            {step === 6 && (
              <ReviewScreen
                services={data?.services ?? {}}
                onComplete={handleComplete}
              />
            )}
          </CardContent>
        </Card>

        {step >= 1 && step <= 5 && (
          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={handlePrev}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="outline" onClick={handleNext}>
              Skip
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceConnectionCard({
  config,
  connected,
  onConnect,
}: {
  config: OAuthServiceConfig;
  connected: boolean;
  onConnect: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Connect {config.label}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Synchropia agents will use this connection to interact with your{" "}
            {config.label} resources.
          </p>
        </div>
        {connected && (
          <Badge
            className="shrink-0 bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
            variant="outline"
          >
            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Connected
          </Badge>
        )}
      </div>

      <div className="rounded-xl border border-border/80 bg-background/40 p-5">
        <h3 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Permissions requested
        </h3>
        <div className="space-y-3">
          {config.scopes.map((s) => (
            <div key={s.scope} className="flex items-start gap-3">
              <div
                className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                  s.category === "admin"
                    ? "bg-red-400"
                    : s.category === "write"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                }`}
              />
              <div className="min-w-0">
                <code className="text-sm font-mono text-foreground/90 break-all">
                  {s.scope}
                </code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.description}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`ml-auto shrink-0 text-[10px] uppercase tracking-wider ${
                  s.category === "admin"
                    ? "text-red-400 border-red-400/25"
                    : s.category === "write"
                      ? "text-amber-400 border-amber-400/25"
                      : "text-emerald-400 border-emerald-400/25"
                }`}
              >
                {s.category}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        {connected ? (
          <Badge
            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/25 px-4 py-2 text-sm"
            variant="outline"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Connected
          </Badge>
        ) : (
          <Button onClick={onConnect}>
            Connect {config.label}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ReviewScreen({
  services,
  onComplete,
}: {
  services: Record<string, { connected: boolean; orgName?: string }>;
  onComplete: () => void;
}) {
  const allServices = ["github", "gitlab", "jira", "sonarqube", "slack"];
  const connectedCount = allServices.filter(
    (s) => services[s]?.connected,
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Review & launch
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {connectedCount} of {allServices.length} services connected. You can
          always reconnect later.
        </p>
      </div>

      <div className="space-y-3">
        {allServices.map((s) => {
          const cfg = getServiceConfig(s);
          const connected = services[s]?.connected;
          return (
            <div
              key={s}
              className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-background/40"
            >
              <div className="flex items-center gap-3">
                {connected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-border" />
                )}
                <div>
                  <span className="text-sm font-medium">{cfg?.label ?? s}</span>
                  {services[s]?.orgName && (
                    <span className="text-xs text-muted-foreground ml-2 font-mono">
                      {services[s].orgName}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={`/api/v1/services/${s}/authorize`}
                className="text-xs text-foreground/70 hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                {connected ? "Reconnect" : "Connect"}
              </a>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onComplete} disabled={connectedCount === 0} size="lg">
          <Rocket className="w-4 h-4 mr-2" /> Launch agent swarm
        </Button>
      </div>
    </div>
  );
}
