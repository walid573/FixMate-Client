import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ctaClass = cn(
  buttonVariants({ size: "lg" }),
  "h-11 shrink-0 bg-brand-orange px-5 text-sm font-semibold text-brand-navy hover:bg-brand-orange/90",
);

export function TechnicianCta() {
  return (
    <section className="bg-brand-cream">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-brand-navy px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Are you a repair professional?
            </h2>
            <p className="mt-2 text-sm text-white/70 sm:text-base">
              Publish your services and manage booking requests in one place.
            </p>
          </div>

          <Link href="/register" className={ctaClass}>
            Become a Technician
          </Link>
        </div>
      </div>
    </section>
  );
}
