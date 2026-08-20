"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthTabsProps {
  activeTab: "signin" | "create";
  onChange: (tab: "signin" | "create") => void;
  className?: string;
}

export function AuthTabs({ activeTab, onChange, className = "" }: AuthTabsProps) {
  return (
    <div className={`w-full flex items-center justify-center gap-6 sm:gap-8 border-b border-border/60 mb-6 ${className}`}>
      <button
        onClick={() => onChange("signin")}
        className={`text-xs sm:text-sm font-semibold pb-2 transition-all ${
          activeTab === "signin"
            ? "text-foreground border-b-2 border-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => onChange("create")}
        className={`text-xs sm:text-sm font-semibold pb-2 transition-all ${
          activeTab === "create"
            ? "text-foreground border-b-2 border-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Create Account
      </button>
    </div>
  );
}