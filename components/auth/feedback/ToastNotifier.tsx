"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose?: () => void;
}

interface ToastNotifierProps {
  toasts: ToastProps[];
  onRemove: (index: number) => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 5000); // Auto dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Match CSS transition duration
  };

  const getVariantStyles = (type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          text: "text-emerald-400",
          icon: <CheckCircle2 className="h-4 w-4" />,
        };
      case "error":
        return {
          bg: "bg-rose-500/10",
          border: "border-rose-500/20",
          text: "text-rose-400",
          icon: <XCircle className="h-4 w-4" />,
        };
      case "info":
        return {
          bg: "bg-indigo-500/10",
          border: "border-indigo-500/20",
          text: "text-indigo-400",
          icon: <AlertTriangle className="h-4 w-4" />,
        };
    }
  };

  const styles = getVariantStyles(type);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 mx-4 max-w-sm z-50 flex items-center p-4 ${styles.bg} ${styles.border} rounded-lg shadow-lg transform transition-all duration-300 ${
        isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
      role="alert"
    >
      <div className="flex-shrink-0">{styles.icon}</div>
      <div className="ml-3 text-sm font-medium">{styles.text}</div>
      <div className="ml-auto flex-shrink-0">
        <button
          onClick={handleClose}
          className="p-1 mr-1 text-sm text-muted-foreground hover:text-foreground/70 rounded"
          aria-label="Close toast"
        >
          <XCircle className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function ToastNotifier({ toasts, onRemove }: ToastNotifierProps) {
  return (
    <div className="pointer-events-none">
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(index)}
        />
      ))}
    </div>
  );
}