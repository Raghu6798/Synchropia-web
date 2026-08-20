"use client";

import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div
      className={`w-full max-w-md mx-auto p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}