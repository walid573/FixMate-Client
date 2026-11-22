
import Link from "next/link";
import { Check } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ctaClass = cn(
  buttonVariants({ size: "lg" }),
  "h-[52px] rounded-full bg-brand-orange px-8 text-sm font-semibold text-brand-navy shadow-none hover:bg-brand-orange/90",
);

const bulletClass =
  "flex items-center gap-2.5 text-[15px] font-medium text-white/90";

export function TechnicianCta() {
  return (
    <section className="relative isolate overflow-hidden rounded-[32px] bg-gradient-to-br from-[#142b4d] via-[#18345b] to-[#1d3d6b] px-7 py-12 sm:px-14 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-[#3B5578]/90"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 left-[38%] size-40 rounded-full bg-white/[0.055]"
      />

  
      <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">

   
        <div>
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-orange-300">
            For technicians
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl">
            Are you a repair
            <br />
            professional?
          </h2>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/85">
            Publish your services and manage booking requests in one place.
          </p>

          <ul className="mt-6 space-y-3">
            <li className={bulletClass}>
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-brand-orange">
                <Check
                  className="size-3.5 stroke-[3] text-brand-navy"
                  aria-hidden="true"
                />
              </span>
              Publish your services
            </li>

            <li className={bulletClass}>
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-brand-orange">
                <Check
                  className="size-3.5 stroke-[3] text-brand-navy"
                  aria-hidden="true"
                />
              </span>
              Manage booking requests
            </li>

            <li className={bulletClass}>
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-brand-orange">
                <Check
                  className="size-3.5 stroke-[3] text-brand-navy"
                  aria-hidden="true"
                />
              </span>
              Track your earnings
            </li>
          </ul>

          <Link href="/sign-up" className={cn(ctaClass, "mt-8")}>
            Become a Technician
          </Link>
        </div>

      
        <div className="relative flex items-center justify-center lg:justify-end">
          <article className="w-full max-w-[340px] rounded-[20px] bg-white p-[22px] shadow-xl shadow-black/10">

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-brand-navy">
                New booking request
              </span>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-800">
                Requested
              </span>
            </div>

            <h3 className="mt-3 text-base font-bold text-brand-navy">
              Screen Replacement
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Aminul Karim · 20 Nov 2026
            </p>

            <div className="mt-4 flex gap-2.5">
              <button
                type="button"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-[35px] flex-1 bg-brand-orange text-xs font-semibold text-brand-navy shadow-none hover:bg-brand-orange/90",
                )}
              >
                Accept
              </button>

              <button
                type="button"
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "h-[35px] flex-1 border-slate-300 bg-white text-xs font-semibold text-rose-600 shadow-none hover:bg-slate-50",
                )}
              >
                Reject
              </button>
            </div>

          </article>
        </div>
      </div>
    </section>
  );
}
