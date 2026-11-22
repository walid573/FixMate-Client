import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Use on light backgrounds (e.g. the dashboard sidebar). */
  variant?: "dark" | "light";
}

/** White wrench with a small sparkle — the FixMate mark. */
function FixMateMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[22px]"
      aria-hidden="true"
    >
      {/* wrench */}
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      {/* sparkle */}
      <path
        d="M5 2.2l0.8 2 2 0.8-2 0.8-0.8 2-0.8-2-2-0.8 2-0.8 0.8-2z"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function Logo({ className, variant = "dark" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="FixMate home"
      className={cn(
        "flex w-fit items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange",
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[13px] bg-linear-to-br from-brand-orange to-brand-orange-deep text-white shadow-sm shadow-brand-orange/30">
        <FixMateMark />
      </span>
      <span className="text-[22px] leading-none font-extrabold tracking-[-0.045em]">
        <span className={variant === "light" ? "text-brand-navy" : "text-white"}>
          Fix
        </span>
        <span className="text-brand-orange">Mate</span>
      </span>
    </Link>
  );
}
