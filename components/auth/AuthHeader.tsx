"use client";

import React from "react";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthHeader({ title, subtitle, className = "" }: AuthHeaderProps) {
  return (
    <div className={`mb-6 text-center ${className}`}>
      <h2 className="mb-2 text-2xl font-bold text-foreground">{title}</h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}