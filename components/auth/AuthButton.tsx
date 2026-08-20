"use client";

import React from "react";

interface AuthButtonProps {
  children: React.ReactNode;
  type?: "submit" | "button";
  variant?: "primary" | "secondary" | "outline";
  size?: "default" | "sm";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export function AuthButton({
  children,
  type = "button",
  variant = "primary",
  size = "default",
  disabled = false,
  loading = false,
  className = "",
  onClick
}: AuthButtonProps) {
  const baseClasses = `
    flex items-center justify-center gap-2
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus-ring-primary/30
    disabled:opacity-50 disabled:pointer-events-none
  `;

  const variantClasses = variant === "primary"
    ? `bg-primary text-primary-foreground hover:bg-primary/90`
    : variant === "secondary"
    ? `bg-secondary text-secondary-foreground hover:bg-secondary/80`
    : `bg-muted text-muted-foreground hover:bg-muted/80 border border-border`;

  const sizeClasses = size === "sm"
    ? `px-3 py-2 text-xs`
    : `px-4 py-3 text-sm`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
    >
      {loading ? (
        <>
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}