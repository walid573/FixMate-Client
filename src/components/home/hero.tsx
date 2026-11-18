import Link from "next/link";
import { ArrowRight, Check, Monitor, Star, Wrench, Zap } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Stat {
  value: string;
  label: string;
  star?: boolean;
}

const STATS: Stat[] = [
  { value: "2,000+", label: "Repairs completed" },
  { value: "4.9", label: "Average rating", star: true },
  { value: "30 min", label: "Typical response" },
];

const exploreClass = cn(
  buttonVariants({ size: "lg" }),
  "h-14 gap-3 rounded-full bg-brand-orange pl-6 pr-2 text-base font-semibold text-brand-navy shadow-lg shadow-brand-orange/25 hover:bg-brand-orange/90",
);

const becomeClass = cn(
  buttonVariants({ variant: "outline", size: "lg" }),
  "h-14 rounded-full border-slate-300 bg-white px-6 text-base font-semibold text-brand-navy hover:bg-white hover:text-brand-navy",
);

export function Hero() {
  return (
    <section className="bg-brand-cream">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
      
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-white px-4 py-1.5 text-xs font-medium text-brand-orange-ink shadow-sm">
            <span className="size-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
            Reliable Repair Services, Made Simple
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-navy sm:text-5xl lg:text-[3.4rem]">
            Broken Device?
            <span className="block text-brand-orange-vivid">
              Get It Fixed by Verified Technicians
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600">
            Tell us what is broken, compare trusted local technicians and book a
            repair in minutes. Track every step and pay only when the job is done.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/services" className={exploreClass}>
              Explore Services
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-navy text-white">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
            <Link href="/register" className={becomeClass}>
              Become a Technician
            </Link>
          </div>

   
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6 border-t border-slate-200 pt-6">
            <div className="flex -space-x-2" aria-hidden="true">
              {["RH", "NJ", "TA"].map((initials) => (
                <span
                  key={initials}
                  className="flex size-8 items-center justify-center rounded-full border-2 border-brand-cream bg-brand-peach text-[10px] font-semibold text-brand-navy"
                >
                  {initials}
                </span>
              ))}
            </div>

            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="flex items-center gap-1 text-lg font-bold text-brand-navy">
                  {stat.value}
                  {stat.star && (
                    <Star
                      className="size-4 fill-brand-orange text-brand-orange"
                      aria-hidden="true"
                    />
                  )}
                </p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-full px-3">
          <div className="relative aspect-[6/5] rounded-[2rem] bg-brand-navy">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,150,61,0.35),transparent_55%)]" />
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="absolute -right-20 top-1/2 size-[380px] -translate-y-1/2 rounded-full border border-white/10" />
              <div className="absolute -right-2 top-1/2 size-[240px] -translate-y-1/2 rounded-full border border-white/10" />
            </div>

     
            <span className="absolute right-[11%] top-[26%] rounded-xl bg-white/10 p-2.5 text-white/70">
              <Zap className="size-4" aria-hidden="true" />
            </span>
            <span className="absolute bottom-[16%] left-[14%] rounded-xl bg-white/10 p-2.5 text-white/70">
              <Monitor className="size-4" aria-hidden="true" />
            </span>

      
            <div className="absolute left-1/2 top-1/2 flex h-[78%] w-[38%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-5 rounded-[2rem] border border-white/15 bg-[#0b1420] px-5 shadow-2xl shadow-black/40">
              <span className="flex size-16 items-center justify-center rounded-full bg-brand-orange text-white">
                <Wrench className="size-7 -rotate-12" aria-hidden="true" />
              </span>
              <span className="h-2 w-20 rounded-full bg-white/25" aria-hidden="true" />
              <span className="h-2 w-14 rounded-full bg-white/15" aria-hidden="true" />
              <span className="h-10 w-full rounded-xl bg-brand-orange" aria-hidden="true" />
            </div>

     
            <div className="absolute -left-3 top-[7%] hidden w-44 items-center gap-2.5 rounded-xl bg-white p-3 shadow-lg shadow-brand-navy/20 sm:flex">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-brand-navy">Booking confirmed</p>
                <p className="truncate text-[10px] text-slate-500">Tomorrow · 10:00 AM</p>
              </div>
            </div>

  
            <div className="absolute -right-3 top-[46%] flex items-center gap-2.5 rounded-xl bg-white p-3 shadow-lg shadow-brand-navy/20">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-peach text-[10px] font-semibold text-brand-navy">
                RH
              </span>
              <div>
                <p className="text-xs font-semibold text-brand-navy">Rafiq Hasan</p>
                <p className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Star
                    className="size-2.5 fill-brand-orange text-brand-orange"
                    aria-hidden="true"
                  />
                  4.9 · Verified technician
                </p>
              </div>
            </div>


            <div className="absolute -left-3 bottom-[10%] hidden w-48 rounded-xl bg-white p-3 shadow-lg shadow-brand-navy/20 sm:block">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-brand-navy">AC Servicing</p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  In Progress
                </span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <span className="block h-full w-2/3 rounded-full bg-brand-orange" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
