import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Use on light backgrounds (e.g. the dashboard sidebar). */
  variant?: "dark" | "light";
}

export function Logo({ className, variant = "dark" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="FixMate home"
      className={cn(
        "flex w-fit items-center gap-1 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange",
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
        className="size-[52px] shrink-0"
        role="img"
        aria-label="FixMate"
      >
        <defs>
          <linearGradient id="fm-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF963D" />
            <stop offset="1" stopColor="#F0533D" />
          </linearGradient>
        </defs>
        <g transform="translate(26 26) rotate(-8)">
          <rect x="-20" y="-20" width="40" height="40" rx="12" fill="url(#fm-g)" />
          <path
            transform="translate(-11 -11) scale(.9167)"
            d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.2-.6-.6-2.2z"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      <span className="text-[22px] leading-none font-extrabold tracking-[-0.045em]">
        <span className={variant === "light" ? "text-brand-navy" : "text-white"}>
          Fix
        </span>
        <span className="text-brand-orange">Mate</span>
      </span>
    </Link>
  );
}
