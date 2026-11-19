// ---------------------------------------------------------------------------
// Minimal in-house toast hook.
//
// Sonner / react-hot-toast are not installed in this project, so we provide a
// tiny self-contained replacement: a hook that returns a `push(message, kind)`
// function plus a `<ToastProvider />` to render the messages. It is
// intentionally minimal — no animations, no positioning config — but covers
// success / error / info toasts used across the app.
// ---------------------------------------------------------------------------

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ToastKind = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  push: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, kind: ToastKind = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg ring-1 ${
              t.kind === "success"
                ? "bg-green-50 text-green-800 ring-green-200"
                : t.kind === "error"
                  ? "bg-red-50 text-red-800 ring-red-200"
                  : "bg-slate-50 text-slate-800 ring-slate-200"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside a <ToastProvider />");
  }
  return ctx.push;
}