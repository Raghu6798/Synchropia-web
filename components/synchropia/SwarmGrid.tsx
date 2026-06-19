"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { Marquee } from "@/components/ui/marquee";
import { Calendar } from "@/components/lightswind/calendar";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Bell, Share2, Calendar as CalendarIcon, ArrowRight } from "lucide-react";

// --- Custom AnimatedList Component (Locally Encapsulated) ---
interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

const AnimatedList = React.memo(
  ({ className, children, delay = 1800 }: AnimatedListProps) => {
    const [index, setIndex] = React.useState(0);
    const childrenArray = React.Children.toArray(children);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
      }, delay);

      return () => clearInterval(interval);
    }, [childrenArray.length, delay]);

    const itemsToShow = React.useMemo(
      () => childrenArray.slice(0, index + 1).reverse(),
      [index, childrenArray],
    );

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <motion.div
              key={(item as React.ReactElement).key}
              layout
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 40 }}
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);
AnimatedList.displayName = "AnimatedList";

const agentNotifications = [
  {
    name: "Feature Ticket Ingested",
    description: "PM Agent analyzed ticket scope & auto-generated PRD.",
    time: "Just now",
    icon: "📋",
  },
  {
    name: "Schema Migrations Generated",
    description: "Architect Agent defined new database models.",
    time: "2m ago",
    icon: "⚙️",
  },
  {
    name: "Concurrent Code Complete",
    description: "SDE Agents successfully compiled frontend & backend endpoints.",
    time: "5m ago",
    icon: "💻",
  },
  {
    name: "VPC Subnet Nodes Testing",
    description: "QA Agent verified sandbox route isolation checks.",
    time: "8m ago",
    icon: "🛡️",
  },
];

const NotificationCard = ({ name, description, time, icon }: any) => {
  return (
    <div className="flex w-full items-start gap-3 rounded-xl border border-zinc-200/50 bg-white/60 p-3 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/40 shadow-sm transition-all duration-300">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm">
        {icon}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{name}</span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-550 whitespace-nowrap">{time}</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed truncate mt-0.5">{description}</p>
      </div>
    </div>
  );
};

// --- Custom Integrations Animated Beam Grid ---
const Circle = React.forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-20 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950 p-2 transition-transform duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

function AnimatedBeamMultipleOutputDemo({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-[14rem] w-full items-center justify-between p-6 overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-col justify-around h-full gap-4 relative z-25">
        <Circle ref={div1Ref}>
          <Image src="/github-com-logo.png" alt="GitHub" width={18} height={18} className="object-contain" />
        </Circle>
        <Circle ref={div2Ref}>
          <Image src="/gitlab-cn-logo.png" alt="GitLab" width={18} height={18} className="object-contain" />
        </Circle>
        <Circle ref={div3Ref} className="h-14 w-14 p-1.5">
          <Image src="/databricks-com-logo.png" alt="Databricks" width={48} height={48} className="object-contain w-full h-full" />
        </Circle>
      </div>

      <div className="flex items-center justify-center relative z-25">
        <Circle ref={div4Ref} className="h-14 w-14 border-[#8AFF00]/80 dark:border-[#8AFF00]/60 p-3 ring-4 ring-[#8AFF00]/10 shadow-[0_0_20px_rgba(138,255,0,0.15)] bg-white dark:bg-zinc-950">
          <Image src="/synchropia.png" alt="Synchropia Core" width={32} height={32} className="object-contain rounded" />
        </Circle>
      </div>

      <div className="flex flex-col justify-around h-full gap-4 relative z-25">
        <Circle ref={div5Ref} className="h-14 w-14 p-1.5">
          <Image src="/slack-com-logo.png" alt="Slack" width={48} height={48} className="object-contain w-full h-full" />
        </Circle>
        <Circle ref={div6Ref} className="h-14 w-14 p-1.5">
          <Image src="/snowflake.jpg" alt="Snowflake" width={48} height={48} className="object-contain w-full h-full rounded-full" />
        </Circle>
        <Circle ref={div7Ref} className="h-14 w-14 p-1.5">
          <Image src="/sonarQube.png" alt="SonarQube" width={48} height={48} className="object-contain w-full h-full" />
        </Circle>
      </div>

      {/* Animated Beams with Theme accents */}
      <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div4Ref} curvature={-20} delay={0.2} duration={3} pathColor="#e4e4e7" gradientStartColor="#8AFF00" gradientStopColor="#3f7300" />
      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} curvature={0} delay={0.6} duration={3} pathColor="#e4e4e7" gradientStartColor="#8AFF00" gradientStopColor="#3f7300" />
      <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} curvature={20} delay={1.0} duration={3} pathColor="#e4e4e7" gradientStartColor="#8AFF00" gradientStopColor="#3f7300" />
      <AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={div5Ref} curvature={-20} delay={1.4} duration={3} pathColor="#e4e4e7" gradientStartColor="#3f7300" gradientStopColor="#8AFF00" />
      <AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={div6Ref} curvature={0} delay={1.8} duration={3} pathColor="#e4e4e7" gradientStartColor="#3f7300" gradientStopColor="#8AFF00" />
      <AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={div7Ref} curvature={20} delay={2.2} duration={3} pathColor="#e4e4e7" gradientStartColor="#3f7300" gradientStopColor="#8AFF00" />
    </div>
  );
}

// --- Main SwarmGrid Component ---
export function SwarmGrid() {
  const files = [
    {
      name: "prd_compilation.pdf",
      body: "Comprehensive Product Requirement Document generated automatically from developer ticket inputs.",
    },
    {
      name: "schema_migration.sql",
      body: "PostgreSQL database migrations containing workspace, tenant, and org structure definitions.",
    },
    {
      name: "docker-compose.yml",
      body: "Private VPC container configurations including stateful Redis stores and microservice nodes.",
    },
    {
      name: "security_audit.json",
      body: "Static analysis reports verifying token isolation and checking credentials safety policies.",
    },
    {
      name: "main_route_test.py",
      body: "Automated route coverage verification checking authentication guards and org scope permissions.",
    },
  ];

  const features = [
    {
      Icon: FileText,
      name: "Autonomous Output Archiving",
      description: "Auto-ingests output contexts and compiles documents, migrations, configurations, and test logs.",
      href: "#cta-section",
      cta: "Explore Workspace",
      className: "col-span-3 lg:col-span-1",
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-4 inset-x-0 h-[19rem] [mask-image:linear-gradient(to_bottom,black_45%,transparent_100%)] [--duration:25s]"
        >
          {files.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-44 cursor-pointer overflow-hidden rounded-xl border p-3.5 m-1.5 text-left",
                "border-zinc-200 bg-white/60 hover:bg-white dark:border-zinc-800/40 dark:bg-zinc-950/40 dark:hover:bg-zinc-900/60",
                "transform-gpu transition-all duration-300 ease-out hover:border-[#8AFF00]/30 shadow-sm"
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <span className="text-xs">📄</span>
                <figcaption className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {f.name}
                </figcaption>
              </div>
              <blockquote className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: Bell,
      name: "Real-Time Agent Pipelines",
      description: "Get immediate notifications as SDE, PM, QA, and DevOps agents compile steps in private subnets.",
      href: "#cta-section",
      cta: "Monitor Pipeline",
      className: "col-span-3 lg:col-span-2",
      background: (
        <div className="absolute inset-x-4 top-4 h-[12rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]">
          <AnimatedList className="w-full">
            {agentNotifications.map((n, idx) => (
              <NotificationCard key={idx} {...n} />
            ))}
          </AnimatedList>
        </div>
      ),
    },
    {
      Icon: Share2,
      name: "Direct Workspace Integrations",
      description: "Coordinates memory states, pipelines, and auth nodes securely across your VCS and DevOps tools.",
      href: "#integrations",
      cta: "Explore Integrations",
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedBeamMultipleOutputDemo className="absolute top-0 right-0 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]" />
      ),
    },
    {
      Icon: CalendarIcon,
      name: "Stateful Delivery Calendar",
      description: "Track sprint logs, commit tags, and deployment release runs across custom intervals.",
      className: "col-span-3 lg:col-span-1",
      href: "#cta-section",
      cta: "View Deployments",
      background: (
        <Calendar
          mode="single"
          selected={new Date()}
          className="absolute top-10 right-0 origin-top scale-75 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] transition-all duration-300 ease-out group-hover:scale-[0.8] z-0"
        />
      ),
    },
  ];

  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background text-foreground transition-colors duration-300" id="swarms">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,255,0,0.02)_0%,rgba(0,0,0,0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(138,255,0,0.04)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-650 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
            Intelligent Swarms in Action
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Watch the central orchestrator coordinate tasks in real-time, routing autonomous execution streams to specialized agent networks.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <BentoGrid className="lg:grid-cols-3">
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}
