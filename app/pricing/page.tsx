"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Header from "@/components/layout/Header";
import { PricingWithChart } from "@/components/ui/pricing-with-chart";
import { cn } from "@/lib/utils";

export default function PricingPage() {
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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-[#8AFF00]/30 selection:text-zinc-950 transition-colors duration-300">
      {/* Floating Navbar */}
      <Header isCompact={isCompact} isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />

      <div className="relative flex min-h-screen w-full items-center justify-center px-4 pt-32 pb-16 bg-[radial-gradient(35%_80%_at_50%_0%,--theme(--color-foreground/.1),transparent)]">
        <PricingWithChart />

        {/* Dots background overlay */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 -z-10 size-full pointer-events-none opacity-40',
            'bg-[radial-gradient(color-mix(in_oklab,--theme(--color-foreground/.1)30%,transparent)_2px,transparent_2px)]',
            'bg-[size:12px_12px]',
          )}
        />
      </div>
    </div>
  );
}
