import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { SERVICE_CATEGORIES } from "@/constants/categories";

export function CategoryGrid() {
  return (
    <section className="bg-brand-cream">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-brand-navy">
              Browse by Category
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Pick your device and we’ll match you with verified technicians
              nearby.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-orange-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
          >
            View all services
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {SERVICE_CATEGORIES.map(({ label, slug, icon: Icon }) => (
            <li key={slug}>
              <Link
                href={`/services?category=${slug}`}
                className="group flex h-full flex-col justify-between gap-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
              >
                <span className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-peach text-brand-orange-ink">
                    <Icon className="size-5" strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <ArrowUpRight
                    className="size-3.5 text-slate-300 transition-colors group-hover:text-brand-orange"
                    aria-hidden="true"
                  />
                </span>

                <span className="text-sm font-semibold leading-snug text-brand-navy">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
