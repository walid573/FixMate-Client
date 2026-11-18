import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const signInClass = cn(
  buttonVariants({ variant: "outline", size: "lg" }),
  "hidden h-10 rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/40 sm:inline-flex",
);

const getStartedClass = cn(
  buttonVariants({ variant: "default", size: "lg" }),
  "hidden h-10 rounded-full bg-brand-orange px-5 font-semibold text-brand-navy hover:bg-brand-orange/90 focus-visible:ring-white/40 sm:inline-flex",
);

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-brand-navy">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link
          href="/"
          aria-label="FixMate home"
          className="flex w-fit items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
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

        <div className="hidden justify-self-center lg:block">
          <DesktopNav />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link href="/login" className={signInClass}>
            Sign In
          </Link>
          <Link href="/register" className={getStartedClass}>
            Get Started
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
