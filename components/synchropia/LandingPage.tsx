"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import Header from "../layout/Header";
import { IsometricBackground } from "@/components/synchropia/IsometricBackground";
import { AuroraBackground } from "@/components/lightswind/aurora-background";
import { SwarmGrid } from "@/components/synchropia/SwarmGrid";
import { IntegrationsShowcase } from "@/components/synchropia/IntegrationsShowcase";
import { Globe } from "@/components/ui/globe";
import { ScrollTimeline } from "@/components/lightswind/scroll-timeline";
import GlowingCards, { GlowingCard } from "@/components/lightswind/glowing-cards";
import { ConfettiButton } from "@/components/lightswind/confetti-button";
import { TrustedUsers } from "@/components/lightswind/trusted-users";
import { ComicText } from "@/components/ui/cosmic-text";
import { PricingCreative } from "../ui/pricing-with-chart";
import {
  Shield,
  Workflow,
  RefreshCw,
  Users,
  Flame,
  Lock,
  ArrowRight,
  GitPullRequest,
  FileText,
  Cpu,
  Code2,
  CheckCircle2,
  Rocket
} from "lucide-react";

export function LandingPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isCompact, setIsCompact] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsCompact(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDarkMode = !mounted ? true : resolvedTheme === "dark";
  const handleToggleTheme = () => setTheme(isDarkMode ? "light" : "dark");

  const globeConfig = React.useMemo(() => {
    return {
      width: 800,
      height: 800,
      onRender: () => { },
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.2,
      dark: isDarkMode ? 1 : 0,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: isDarkMode ? [39 / 255, 39 / 255, 42 / 255] as [number, number, number] : [240 / 255, 240 / 255, 240 / 255] as [number, number, number],
      markerColor: [0.1, 0.5, 1.0] as [number, number, number],
      glowColor: [1, 1, 1] as [number, number, number],
      markers: [
        { location: [14.5995, 120.9842] as [number, number], size: 0.03 },
        { location: [19.076, 72.8777] as [number, number], size: 0.1 },
        { location: [23.8103, 90.4125] as [number, number], size: 0.05 },
        { location: [30.0444, 31.2357] as [number, number], size: 0.07 },
        { location: [39.9042, 116.4074] as [number, number], size: 0.08 },
        { location: [-23.5505, -46.6333] as [number, number], size: 0.1 },
        { location: [19.4326, -99.1332] as [number, number], size: 0.1 },
        { location: [40.7128, -74.006] as [number, number], size: 0.1 },
        { location: [34.6937, 135.5022] as [number, number], size: 0.05 },
        { location: [41.0082, 28.9784] as [number, number], size: 0.06 },
      ],
    };
  }, [isDarkMode]);

  const swarmMethodologyEvents = React.useMemo(() => {
    return [
      {
        year: "Phase 1: PM Swarm",
        title: "Requirements & PRD Ingestion",
        subtitle: "Ticket Analysis Agent",
        description: "Ingests developer tickets, conducts comprehensive AST and repository code searches, and compiles high-fidelity Product Requirement Documents (PRDs).",
        icon: <FileText className="h-4 w-4 mr-2 text-cyan-500" />,
        color: "cyan-500"
      },
      {
        year: "Phase 2: Architect Swarm",
        title: "System Design & Decomposition",
        subtitle: "System Planner Agent",
        description: "Deconstructs PRD items into explicit file paths, database migrations, API models, and splits engineering workload across concurrent tracks.",
        icon: <Cpu className="h-4 w-4 mr-2 text-indigo-500" />,
        color: "indigo-500"
      },
      {
        year: "Phase 3: SDE Swarm",
        title: "Concurrent Implementation",
        subtitle: "Code Synthesis Agents",
        description: "Frontend and backend agents build application code and unit tests concurrently inside secure, sandboxed, VPC-isolated environments.",
        icon: <Code2 className="h-4 w-4 mr-2 text-purple-500" />,
        color: "purple-500"
      },
      {
        year: "Phase 4: QA Swarm",
        title: "Automated Test Verification",
        subtitle: "Quality Assurance Agent",
        description: "Orchestrates comprehensive linting, type-checking, automated unit/integration runs, and code style conformance reports.",
        icon: <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />,
        color: "emerald-500"
      },
      {
        year: "Phase 5: DevOps Swarm",
        title: "Isolated Sandboxed Deployment",
        subtitle: "VPC Deployer Agent",
        description: "Configures networking, handles build compilation, bundles serverless triggers, and provisions secure preview URLs within private VPC subnets.",
        icon: <Rocket className="h-4 w-4 mr-2 text-amber-500" />,
        color: "amber-500"
      },
      {
        year: "Phase 6: Admin Gate",
        title: "Human-in-the-Loop Approval",
        subtitle: "Git Pull Request",
        description: "Assembles complete logs, audit traces, and changesets into a clean Git PR. Production deployment is gated pending human admin review.",
        icon: <GitPullRequest className="h-4 w-4 mr-2 text-rose-500" />,
        color: "rose-500"
      }
    ];
  }, []);

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&w=100&h=100&q=80"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-[#8AFF00]/30 selection:text-zinc-950 transition-colors duration-300">

      {/* Floating Navbar */}
      <Header isCompact={isCompact} isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-12 overflow-hidden" id="home">
        {/* Background Visual Layers */}
        <div className="absolute inset-0 z-0">
          <AuroraBackground className="h-full w-full opacity-20 dark:opacity-25" showRadialGradient={true}>
            <div className="hidden" />
          </AuroraBackground>
        </div>

        {/* Isometric agent swarm diagram — rendered behind hero text */}
        <div className="absolute inset-0 z-[1]">
          <IsometricBackground />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-6">

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-650 dark:from-white dark:via-zinc-100 dark:to-zinc-400">
            The Agentic Software <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-[#8AFF00] dark:from-white dark:to-[#8AFF00]">
              Delivery Factory
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Automate the entire software lifecycle. Orchestrate swarms of specialized, collaborative AI agents in private, VPC-isolated environments to ship code with zero manual overhead.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            <ConfettiButton
              variant="gradient"
              size="lg"
              animation="glow"
              className="bg-[#8AFF00] hover:bg-[#8AFF00]/95 text-black border border-[#8AFF00] shadow-[0_0_20px_rgba(138,255,0,0.3)] hover:shadow-[0_0_25px_rgba(138,255,0,0.45)] font-bold transition-all duration-300"
              onClick={() => window.location.href = '/login'}
              icon={<ArrowRight className="w-5 h-5 text-black" />}
              iconPosition="right"
            >
              Deploy Your Swarm Free
            </ConfettiButton>

            <Link
              href="#swarms"
              className="flex items-center justify-center h-12 px-6 rounded-md border border-border bg-card hover:bg-muted text-sm font-semibold transition-all text-foreground"
            >
              Explore Swarms
            </Link>
          </div>


        </div>
      </section>

      {/* Integrations Section */}
      <IntegrationsShowcase />

      {/* Swarms Grid Section */}
      <section className="bg-background py-8" id="swarms-grid">
        <SwarmGrid />
      </section>

      {/* Features Grid Section */}
      <section className="bg-background py-20 px-4 sm:px-6 lg:px-8 border-t border-border" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Enterprise Agent Infrastructure
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Engineered with private VPC subnet parameters, multi-tenancy auth plugins, and human-in-the-loop gates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />,
                title: "Security-First Isolation",
                desc: "Every swarm runs in its own private VPC subnet. Connections to database models (Aurora RDS) and resources never touch the public internet."
              },
              {
                icon: <GitPullRequest className="w-6 h-6 text-purple-500 dark:text-purple-400" />,
                title: "Human-in-the-Loop Gates",
                desc: "Safety comes first. Code modifications are pushed as Git Pull Requests, requiring explicit human reviews and signed approvals before deploy."
              },
              {
                icon: <RefreshCw className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
                title: "Redis Stateful Memory",
                desc: "Redis-backed persistence maintains long-term memory, cross-agent coordinating arrays, and execution state parameters across crashes."
              },
              {
                icon: <Workflow className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />,
                title: "LangGraph State Machines",
                desc: "Uses stateful, multi-agent LangGraph flows to structure collaboration, cyclic agent updates, and dynamic supervisor decisions."
              },
              {
                icon: <Users className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />,
                title: "Authentication Orgs",
                desc: "Integrated with robust tenant configurations to map external developer workspace profiles to tenant organization records seamlessly."
              },
              {
                icon: <Lock className="w-6 h-6 text-rose-500 dark:text-rose-400" />,
                title: "Enterprise SSO Ready",
                desc: "Easily integrates with corporate Identity Providers (IDPs) via Enterprise Single Sign-On SAML 2.0 and OIDC plugins."
              }
            ].map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card/40 border border-border hover:border-[#8AFF00]/40 hover:bg-card/75 dark:bg-zinc-950/40 dark:border-zinc-900 dark:hover:border-[#8AFF00]/45 dark:hover:bg-zinc-950/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(138,255,0,0.08)]"
              >
                <div className="p-3 bg-muted border border-border/85 rounded-xl w-fit mb-4 dark:bg-zinc-900/60 dark:border-zinc-800">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (Glowing Cards) */}
      <section className="bg-background py-20 border-t border-border" id="testimonials">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
              Trusted by Technical Leaders
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              See what CTOs, VP of Engineering, and Platform Architects are saying about Synchropia's Swarm factory.
            </p>
          </div>

          <GlowingCards
            glowRadius={30}
            gap="2rem"
            className="w-full"
            padding="2rem 0"
          >
            {[
              {
                quote: "Synchropia completely transformed our feature delivery pipelines. We went from manual coding loops to autonomous swarm delivery inside our secure VPC in weeks.",
                author: "Sarah Jenkins",
                role: "VP of Engineering at CloudScale",
                color: "#8AFF00"
              },
              {
                quote: "The human-in-the-loop security validation gives our security administrators full peace of mind. Agents build the patches, but our team signs off on every line.",
                author: "Marcus Chen",
                role: "Chief Architect at SecureBank",
                color: "#8AFF00"
              },
              {
                quote: "We deployed the Data Swarm to manage our lakehouse migrations. Seeing Glue ETL jobs and MLOps triggers scale automatically was incredible.",
                author: "Elena Rostova",
                role: "Head of Data Science at Datacraft",
                color: "#8AFF00"
              }
            ].map((test, index) => (
              <GlowingCard
                key={index}
                className="border-border/80 dark:border-zinc-800/80 bg-card/40 dark:bg-zinc-950/40 p-6 flex flex-col justify-between max-w-[340px]"
                glowColor={test.color}
              >
                <div>
                  <div className="flex gap-1 text-[#8AFF00] mb-4">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-muted-foreground text-sm italic leading-relaxed mb-6">
                    "{test.quote}"
                  </p>
                </div>
                <div>
                  <div className="h-[1px] w-full bg-border/80 dark:bg-zinc-800 mb-4" />
                  <h4 className="font-bold text-foreground text-sm">{test.author}</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{test.role}</p>
                </div>
              </GlowingCard>
            ))}
          </GlowingCards>
        </div>
      </section>

      {/* Global Network Infrastructure Section (Globe) */}
      <section className="bg-background py-16 border-t border-border overflow-hidden" id="network">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Global Enterprise Network Mesh
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Synchropia coordinates memory layers, state containers, and execution pipelines securely across private edge networks globally.
          </p>
          <div className="pt-8 flex justify-center">
            <div className="relative w-[24rem] h-[24rem] max-w-full aspect-square">
              <Globe
                className="absolute inset-0"
                config={globeConfig}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-background py-20 px-4 sm:px-6 lg:px-8 border-t border-border overflow-hidden" id="pricing">
        <div className="max-w-6xl mx-auto">
          <PricingCreative />
        </div>
      </section>

      {/* CTA Conversion Section */}
      <section className="bg-background py-24 border-t border-border relative overflow-hidden" id="cta-section">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,255,0,0.05)_0%,rgba(0,0,0,0)_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(138,255,0,0.07)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

        {/* ScrollTimeline to demonstrate the swarm end-to-end process */}
        <div className="w-full mb-20">
          <ScrollTimeline
            events={swarmMethodologyEvents}
            title="Autonomous Swarm Development Lifecycle"
            subtitle="Scroll to explore how our specialized software agents collaborate to deliver code end-to-end."
            darkMode={isDarkMode}
            cardVariant="elevated"
            cardEffect="glow"
            revealAnimation="slide"
            connectorStyle="dashed"
            lineColor={isDarkMode ? "bg-zinc-800" : "bg-zinc-200"}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="flex justify-center mb-6">
            <ComicText
              fontSize={3.5}
              style={{
                backgroundColor: "#8AFF00",
                backgroundImage: "radial-gradient(circle at 1px 1px, #3d7a00 1px, transparent 0)",
                backgroundSize: "8px 8px",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                filter: "drop-shadow(5px 5px 0px #000000) drop-shadow(3px 3px 0px #3d7a00)",
              }}
            >
              SHIPPED!
            </ComicText>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Ready to Build at the Speed of Thought?
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Provision your secure VPC agent node and coordinate SDE, Data, and GenAI Swarms today. Get started in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <ConfettiButton
              variant="gradient"
              size="lg"
              animation="glow"
              className="bg-[#8AFF00] hover:bg-[#8AFF00]/95 text-black border border-[#8AFF00] shadow-[0_0_20px_rgba(138,255,0,0.3)] hover:shadow-[0_0_25px_rgba(138,255,0,0.45)] font-bold transition-all duration-300"
              onClick={() => window.location.href = '/login'}
              icon={<ArrowRight className="w-5 h-5 text-black" />}
              iconPosition="right"
            >
              Initialize Factory Node
            </ConfettiButton>

            <Link
              href="mailto:team@synchropia.ai"
              className="flex items-center justify-center h-12 px-8 rounded-md border border-border bg-card hover:bg-muted text-sm font-semibold transition-colors text-foreground"
            >
              Contact Enterprise Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Glassmorphic Footer */}
      <footer className="bg-card/40 border-t border-border py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-md relative z-10 dark:bg-black/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/synchropia.png"
                alt="Synchropia Logo"
                width={24}
                height={24}
                className="rounded object-contain shadow"
              />
              <span className="font-extrabold text-sm tracking-wider text-foreground">
                SYNCHROPIA
              </span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed dark:text-zinc-400">
              Automated VPC-isolated agent swarms designed to build, test, and ship complete features autonomously.
            </p>
          </div>

          <div>
            <h4 className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-zinc-550 dark:text-zinc-400">
              <li><Link href="#swarms-grid" className="hover:text-foreground transition-colors">Swarms Grid</Link></li>
              <li><Link href="#features" className="hover:text-foreground transition-colors">Security Isolation</Link></li>
              <li><Link href="#network" className="hover:text-foreground transition-colors">Global Network Mesh</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing Models</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">Integrations</h4>
            <ul className="space-y-2 text-xs text-zinc-550 dark:text-zinc-400">
              <li><Link href="#" className="hover:text-foreground transition-colors">GitHub Apps</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Slack Alert Bus</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Jira Ticket Syncer</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">AWS VPC Networks</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">Legal & Security</h4>
            <ul className="space-y-2 text-xs text-zinc-550 dark:text-zinc-400">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">SOC2 Compliance</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">VPC Security Whitepaper</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
          <span>&copy; {new Date().getFullYear()} Synchropia Inc. All rights reserved.</span>
          <span className="flex items-center gap-2 mt-2 md:mt-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All agent pods operational.
          </span>
        </div>
      </footer>
    </div>
  );
}
