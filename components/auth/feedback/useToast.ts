import { useState, useCallback, useRef, useEffect } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastState {
  toasts: Toast[];
}

interface ToastActions {
  addToast: (message: string, type: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });
  const toastIdRef = useRef(0);

  const addToast = useCallback((message: string, type: "success" | "error" | "info") => {
    const id = `toast-${++toastIdRef.current}`;
    setState(prev => ({
      toasts: [...prev.toasts, { id, message, type }]
    }));

    // Auto remove after 5 seconds
    const timeoutId = setTimeout(() => {
      removeToast(id);
    }, 5000);

    // Cleanup on unmount
    return () => clearTimeout(timeoutId);
  }, []);

  const removeToast = useCallback((id: string) => {
    setState(prev => ({
      toasts: prev.toasts.filter(toast => toast.id !== id)
    }));
  }, []);

  const clearToasts = useCallback(() => {
    setState({ toasts: [] });
  }, []);

  return {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearToasts
  };
}