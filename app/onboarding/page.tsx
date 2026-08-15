"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getServiceConfig, type OAuthServiceConfig } from "@/lib/oauth-config";
import {
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Rocket,
  Zap,
  Shield,
  GitBranch,
  Code2,
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

const STEPS: StepDef[] = [
  {
    id: "profile",
    label: "Organization",
    service: "",
    icon: <Shield className="w-4 h-4" />,
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
    icon: <ExternalLink className="w-4 h-4" />,
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

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session && !loading) {
      router.push("/login");
    }
  }, [session, loading, router]);

  const isConnected = (service: string) =>
    data?.services?.[service]?.connected ?? false;
  const isCompleted = (step: number) => {
    if (data?.completed?.includes(step)) return true;
    const s = STEPS[step];
    if (s?.service && isConnected(s.service)) return true;
    return false;
  };
  const canProceed = (step: number) =>
    step === 0 ? profile.name.length > 0 : true;

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

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/v1/onboarding/status");
      const d: OnboardingData = await res.json();
      setData(d);
      if (d.step !== undefined) {
        setCurrentStep(d.step);
      }
    } catch {
      setError("Failed to load onboarding status");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/onboarding/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        await authClient.getSession({ forceRefresh: true });
        await fetchStatus();
        handleNext();
      } else {
        const errJson = await res.json();
        setError(errJson.error || "Failed to save organization profile");
      }
    } catch {
      setError("Failed to save organization profile");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await fetch("/api/v1/onboarding/complete", { method: "POST" });
      router.push("/dashboard");
    } catch {
      setError("Failed to complete onboarding");
    }
  };

  if (data?.isComplete) {
    router.push("/dashboard");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0E12] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
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
    <div className="min-h-screen bg-[#0D0E12] text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Connect Your Workspace
          </h1>
          <p className="text-white/40 mt-2">
            Link your development toolchain to enable the agent swarm.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => isCompleted(i) && setCurrentStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                  i === step
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : isCompleted(i)
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-white/30"
                }`}
              >
                {isCompleted(i) ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : i === step ? (
                  <Circle className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Circle className="w-4 h-4 text-white/20" />
                )}
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-6 h-px ${isCompleted(i) ? "bg-emerald-500/30" : "bg-white/10"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-2xl p-8">
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Organization Profile</h2>
              <p className="text-white/40 text-sm">
                Tell us about your organization so agents know the context.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    placeholder="e.g. Synchropia Inc"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">
                    Okta Domain
                  </label>
                  <input
                    type="text"
                    value={profile.oktaDomain}
                    onChange={(e) =>
                      setProfile({ ...profile, oktaDomain: e.target.value })
                    }
                    placeholder="e.g. your-org.okta.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={!canProceed(step)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 rounded-lg text-sm font-medium transition-all"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
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
        </div>

        {/* Navigation Footer */}
        {step >= 1 && step <= 5 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                serviceConfig && isConnected(serviceConfig.id)
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm"
                  : "bg-white/5 hover:bg-white/10 text-white/70"
              }`}
            >
              {serviceConfig && isConnected(serviceConfig.id)
                ? "Continue"
                : "Skip"}{" "}
              <ArrowRight className="w-4 h-4" />
            </button>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Connect {config.label}</h2>
          <p className="text-white/40 text-sm mt-1">
            Synchropia agents will use this connection to interact with your{" "}
            {config.label} resources.
          </p>
        </div>
        {connected && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" /> Connected
          </span>
        )}
      </div>

      {/* Scope Display */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">
          Permissions Requested
        </h3>
        <div className="space-y-2">
          {config.scopes.map((s) => (
            <div key={s.scope} className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  s.category === "admin"
                    ? "bg-red-400"
                    : s.category === "write"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                }`}
              />
              <div>
                <code className="text-sm font-mono text-white/80">
                  {s.scope}
                </code>
                <p className="text-xs text-white/40">{s.description}</p>
              </div>
              <span
                className={`ml-auto text-[10px] uppercase px-1.5 py-0.5 rounded ${
                  s.category === "admin"
                    ? "bg-red-500/10 text-red-400"
                    : s.category === "write"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {s.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Connect / Disconnect */}
      <div className="flex justify-end">
        {connected ? (
          <span className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm">
            <CheckCircle className="w-4 h-4" /> Connected
          </span>
        ) : (
          <button
            onClick={onConnect}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-all"
          >
            Connect {config.label} <ExternalLink className="w-4 h-4" />
          </button>
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
        <h2 className="text-xl font-semibold">Review & Launch</h2>
        <p className="text-white/40 text-sm mt-1">
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
              className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl"
            >
              <div className="flex items-center gap-3">
                {connected ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-white/20" />
                )}
                <div>
                  <span className="text-sm font-medium">{cfg?.label ?? s}</span>
                  {services[s]?.orgName && (
                    <span className="text-xs text-white/40 ml-2">
                      {services[s].orgName}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={`/api/v1/services/${s}/authorize`}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {connected ? "Reconnect" : "Connect"}
              </a>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onComplete}
          disabled={connectedCount === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:opacity-90 disabled:opacity-30 rounded-xl text-sm font-semibold transition-all"
        >
          <Rocket className="w-4 h-4" /> Launch Agent Swarm
        </button>
      </div>
    </div>
  );
}
