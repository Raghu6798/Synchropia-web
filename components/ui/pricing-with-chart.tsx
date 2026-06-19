"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export function PricingSimple() {
  return (
    <section className="relative flex flex-col items-center py-12">
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-card/45 dark:bg-zinc-950/60 flex w-80 flex-col items-center rounded-2xl border border-border px-8 py-6 text-center shadow-lg transition-transform hover:scale-105"
        >
          <div className="mb-2 text-4xl font-extrabold text-[#8AFF00]">$19/mo</div>
          <div className="text-muted-foreground mb-4 text-sm">Perfect for individuals</div>
          <ul className="text-muted-foreground mb-6 space-y-2 text-left text-xs">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#8AFF00]" /> Unlimited Projects</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#8AFF00]" /> Email Support</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#8AFF00]" /> All Core Features</li>
          </ul>
          <button className="bg-[#8AFF00] text-black w-full rounded-xl px-4 py-2 font-bold transition hover:bg-[#8AFF00]/90">
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export function PricingCreative() {
  return (
    <section className="relative flex flex-col items-center py-24 px-4">
      <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
        
        {/* Starter Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative z-10 w-72 rounded-2xl border border-[#8AFF00]/30 bg-zinc-950/40 px-8 py-10 text-foreground shadow-[0_0_0_1px_rgba(138,255,0,.08)_inset] backdrop-blur-md transition-transform hover:scale-105"
        >
          <div className="mb-2 text-lg font-bold text-[#8AFF00]">Starter</div>
          <div className="mb-4 text-3xl font-extrabold text-white">$5/mo</div>
          <ul className="mb-6 space-y-2 text-sm text-white/70">
            <li><span className="mr-2 text-[#8AFF00]">✔</span> 1 Project</li>
            <li><span className="mr-2 text-[#8AFF00]">✔</span> Email Support</li>
          </ul>
          <button className="w-full rounded-xl bg-[#8AFF00] py-2 font-bold text-black hover:bg-[#8AFF00]/90 transition">
            Start Now
          </button>
        </motion.div>

        {/* Creative Pro Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotate: 0 }}
          animate={{ opacity: 1, y: -20, rotate: 0 }}
          transition={{ type: "spring", duration: 0.7 }}
          className="relative z-20 w-80 scale-110 rounded-3xl border-4 border-[#8AFF00]/50 bg-gradient-to-b from-zinc-900 to-black px-10 py-14 text-white shadow-2xl transition-transform hover:scale-[1.12]"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border border-[#8AFF00]/30 bg-[#8AFF00] px-5 py-1 text-xs font-extrabold text-black shadow-lg">
            BEST DEAL
          </div>
          <div className="mb-2 text-lg font-bold">Creative Pro</div>
          <div className="mb-4 text-5xl font-black">$19/mo</div>
          <ul className="mb-6 space-y-3 text-sm">
            <li><span className="mr-2 text-[#8AFF00]">✔</span> Unlimited Projects</li>
            <li><span className="mr-2 text-[#8AFF00]">✔</span> Priority Support</li>
            <li><span className="mr-2 text-[#8AFF00]">✔</span> Team Collaboration</li>
            <li><span className="mr-2 text-[#8AFF00]">✔</span> Early Access</li>
          </ul>
          <button className="w-full rounded-xl bg-[#8AFF00] py-3 font-bold text-black hover:bg-[#8AFF00]/90 transition">
            Go Pro
          </button>
        </motion.div>

        {/* Enterprise Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 6 }}
          animate={{ opacity: 1, y: 0, rotate: 6 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="relative z-10 w-72 rounded-2xl border border-[#8AFF00]/30 bg-zinc-950/40 px-8 py-10 text-foreground shadow-[0_0_0_1px_rgba(138,255,0,.08)_inset] backdrop-blur-md transition-transform hover:scale-105"
        >
          <div className="mb-2 text-lg font-bold text-[#8AFF00]">Enterprise</div>
          <div className="mb-4 text-3xl font-extrabold text-white">Custom</div>
          <ul className="mb-6 space-y-2 text-sm text-white/70">
            <li><span className="mr-2 text-[#8AFF00]">✔</span> Dedicated Manager</li>
            <li><span className="mr-2 text-[#8AFF00]">✔</span> Custom Integrations</li>
            <li><span className="mr-2 text-[#8AFF00]">✔</span> SLA & Support</li>
          </ul>
          <button className="w-full rounded-xl bg-[#8AFF00] py-2 font-bold text-black hover:bg-[#8AFF00]/90 transition">
            Contact Us
          </button>
        </motion.div>
      </div>
    </section>
  );
}