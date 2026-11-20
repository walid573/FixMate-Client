"use client";

// ---------------------------------------------------------------------------
// Toast layer — thin wrapper around sonner.
//
// Every call site still imports `useToast()` and gets back a
// `push(message, kind)` function, so the migration is invisible to the
// components. The design here matches the FixMate brand: a rounded white
// card with a navy headline and a 4px left accent bar that encodes the
// kind (emerald = success, red = error, brand-orange = info).
// ---------------------------------------------------------------------------

import { toast as sonnerToast, Toaster } from "sonner";

export type ToastKind = "success" | "error" | "info";

const BASE =
  "group toast rounded-xl border bg-card text-card-foreground shadow-lg " +
  "border-l-4 pl-4";

const KIND_STYLE: Record<ToastKind, string> = {
  success: "border-l-emerald-500 [&_svg]:text-emerald-500",
  error: "border-l-red-500 [&_svg]:text-red-500",
  info: "border-l-brand-orange [&_svg]:text-brand-orange",
};

export function pushToast(message: string, kind: ToastKind = "info") {
  const style = KIND_STYLE[kind];
  if (kind === "success") {
    sonnerToast.success(message, { className: style });
  } else if (kind === "error") {
    sonnerToast.error(message, { className: style });
  } else {
    sonnerToast(message, { className: style });
  }
}

export function useToast() {
  return pushToast;
}

export function ThemeToaster() {
  return (
    <Toaster
      position="bottom-right"
      theme="light"
      duration={4000}
      gap={8}
      style={{
        fontFamily: "var(--font-inter), ui-sans-serif, system-ui",
        background: "#ffffff",
      }}
    />
  );
}

// Kept for backwards compatibility with the existing layout import.
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ThemeToaster />
    </>
  );
}