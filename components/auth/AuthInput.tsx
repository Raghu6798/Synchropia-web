"use client";

import React from "react";

interface AuthInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  required?: boolean;
}

export function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  className = "",
  required = false
}: AuthInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={label.toLowerCase().replace(/\s+/g, "-")} className="text-sm font-medium text-muted-foreground">
        {label}{required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={label.toLowerCase().replace(/\s+/g, "-")}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 bg-background/50 backdrop-blur-sm border border-border/60 rounded-lg focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm ${className} ${error ? "border-rose-500" : ""}`}
        />
        {error && (
          <p className="mt-1 text-sm text-rose-500">{error}</p>
        )}
      </div>
    </div>
  );
}