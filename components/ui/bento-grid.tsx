import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-3xl",
      // light styles
      "bg-white/60 backdrop-blur-md border border-zinc-200 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.03),0_12px_24px_rgba(0,0,0,0.03)]",
      // dark styles
      "transform-gpu dark:bg-zinc-950/45 dark:border-zinc-900/60 dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]",
      "hover:border-[#8AFF00]/40 dark:hover:border-[#8AFF00]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(138,255,0,0.08)]",
      className,
    )}
  >
    <div className="absolute inset-0 z-0">{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10 mt-auto">
      <Icon className="h-12 w-12 origin-left transform-gpu text-zinc-650 transition-all duration-300 ease-in-out group-hover:scale-75 dark:text-zinc-350" />
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
        {name}
      </h3>
      <p className="max-w-xs text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <a 
        href={href} 
        className="pointer-events-auto flex items-center justify-center h-9 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold transition-all shadow-md"
      >
        {cta}
        <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[0.01] group-hover:dark:bg-white/[0.01]" />
  </div>
);

export { BentoCard, BentoGrid };
