
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getServices } from "@/lib/api/services";

const detailsClass = cn(
  buttonVariants({ size: "lg" }),
  "w-full bg-brand-orange text-xs font-semibold text-brand-navy hover:bg-brand-orange/90",
);

// Fetch and display services
async function FeaturedServicesContent() {
  const services = await getServices();

  return (
    <section className="bg-brand-cream">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <h2 className="text-2xl font-bold tracking-tight text-brand-navy">
          Featured Services
        </h2>

        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70">
                <div className="relative aspect-[16/10] bg-slate-100">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium tracking-wide text-slate-400">
                      [ {service.photoLabel} ]
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border border-brand-orange/25 bg-brand-peach/60 px-2 py-0.5 text-[11px] font-semibold text-brand-orange-ink">
                      {service.category}
                    </span>

                    <span className="text-[11px] text-slate-500">
                      {service.mode}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-[15px] font-bold leading-snug text-brand-navy">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500">
                    {service.technician} · {service.location}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {service.duration} ·{" "}
                    <span className="font-semibold text-brand-navy">
                      From ৳{service.price.toLocaleString("en-US")}
                    </span>
                  </p>

                  <div className="mt-auto pt-4">
                    <Link
                      href={`/service/${service.id}`}
                      className={detailsClass}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {services.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">
            No services available right now.
          </p>
        )}
      </div>
    </section>
  );
}

// Suspense wrapper
export function FeaturedServices() {
  return (
    <Suspense
      fallback={
        <section className="bg-brand-cream p-12 text-center">
          <p className="text-sm text-slate-500">
            Loading featured services...
          </p>
        </section>
      }
    >
      <FeaturedServicesContent />
    </Suspense>
  );
}
