"use client";

import { Wrench } from "lucide-react";
import { usePathname } from "next/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardErrorPage({ error, reset }: ErrorProps) {
  const pathname = usePathname();

  // Determine dashboard section from pathname
  const isCustomer = pathname?.startsWith("/dashboard/customer");
  const isTechnician = pathname?.startsWith("/dashboard/technician");
  const isAdmin = pathname?.startsWith("/dashboard/admin");

  const sectionLabel = isCustomer ? "Customer" : isTechnician ? "Technician" : isAdmin ? "Admin" : "Dashboard";
  const sectionHref = isCustomer ? "/dashboard/customer" : isTechnician ? "/dashboard/technician" : isAdmin ? "/dashboard/admin" : "/dashboard";

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-7 flex items-center justify-center gap-2 sm:gap-4">
          <span className="text-[100px] font-extrabold leading-none tracking-tight text-brand-navy sm:text-[120px]">
            5
          </span>
          <div className="relative flex size-[88px] shrink-0 items-center justify-center rounded-full bg-[#FFEAD5] sm:size-[104px]">
            <div className="absolute inset-[10px] rounded-full bg-[#FF963F]" />
            <div className="absolute inset-[10px] rounded-full border-[3px] border-dashed border-brand-navy" />
            <Wrench className="relative z-10 size-8 text-brand-navy sm:size-9" strokeWidth={2.5} />
          </div>
          <span className="text-[100px] font-extrabold leading-none tracking-tight text-brand-navy sm:text-[120px]">
            0
          </span>
        </div>

        <h1 className="mb-2 text-xl font-bold tracking-tight text-brand-navy sm:text-2xl">
          Something went wrong
        </h1>
        <p className="mb-7 max-w-sm text-xs leading-[1.7] text-slate-500 sm:text-sm">
          We ran into an unexpected problem in the {sectionLabel} dashboard. Your data is safe.
        </p>

        <div className="flex w-full flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex min-w-[100px] items-center justify-center rounded-full bg-[#FF963F] px-5 py-2.5 text-xs font-semibold text-brand-navy shadow-[0_5px_15px_rgba(255,150,63,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FF8725] hover:shadow-lg sm:px-6 sm:py-3"
          >
            Try again
          </button>
          <a
            href={sectionHref}
            className="inline-flex min-w-[100px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-brand-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange hover:bg-orange-50 sm:px-6 sm:py-3"
          >
            {sectionLabel} Home
          </a>
        </div>
      </div>
    </div>
  );
}