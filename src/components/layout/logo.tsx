import Link from "next/link";
import { Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/** FixMate wordmark. Designed for dark backgrounds (navbar, footer). */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="FixMate home"
      className={cn(
        "flex w-fit items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange",
        className,
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-[13px] bg-linear-to-br from-brand-orange via-brand-orange-light to-brand-orange-deep text-white shadow-[0_0_18px_-2px_rgba(250,127,61,0.65)]">
        <Wrench className="size-5 -rotate-12" aria-hidden="true" />
      </span>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-white">Fix</span>
        <span className="text-brand-orange [text-shadow:0_0_14px_rgba(255,150,61,0.45)]">
          Mate
        </span>
      </span>
    </Link>
  );
}
