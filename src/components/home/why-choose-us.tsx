
import {
  ShieldCheck,
  Tag,
  CalendarDays,
  LockKeyhole,
  House,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { TechnicianCta } from "./technician-cta";

type FeatureItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  featured?: boolean;
  tags?: string[];
  rating?: string;
};

const WHY_CHOOSE_US: FeatureItem[] = [
  {
    title: "Verified Technicians",
    description: "Every professional is reviewed before approval.",
    icon: ShieldCheck,
    featured: true,
    tags: ["Reviewed", "Approved"],
    rating: "Rated ★ 4.9",
  },
  {
    title: "Transparent Pricing",
    description: "See the starting price before you book.",
    icon: Tag,
    tags: ["From ৳1,200", "No surprises"],
  },
  {
    title: "Easy Online Booking",
    description: "Schedule in a minute, from any device.",
    icon: CalendarDays,
  },
  {
    title: "Secure Payments",
    description: "Pay online with protected checkout.",
    icon: LockKeyhole,
  },
  {
    title: "Convenient Options",
    description: "Home visit or shop drop-off.",
    icon: House,
  },
];

function WhyChooseCard({ item }: { item: FeatureItem }) {
  const Icon = item.icon;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[24px] p-8",
        item.featured
          ? "bg-[#142B4E] text-white shadow-sm"
          : "bg-white ring-1 ring-[#E8EDF3]"
      )}
    >
      {item.featured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-[180px] w-[180px] rounded-full bg-[#45434E]/75"
        />
      )}

      <span
        className={cn(
          "relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px]",
          item.featured
            ? "bg-[#FF913D] text-[#142B4E]"
            : "bg-[#FFF0E2] text-[#D94B00]"
        )}
      >
        <Icon
          className="h-[22px] w-[22px]"
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>

      <h3
        className={cn(
          "relative mt-5 text-xl font-bold leading-6 tracking-tight",
          item.featured ? "text-white" : "text-[#142B4E]"
        )}
      >
        {item.title}
      </h3>

      <p
        className={cn(
          "relative mt-2 text-[15px] leading-6",
          item.featured ? "text-[#DCE7F8]" : "text-[#64748B]"
        )}
      >
        {item.description}
      </p>

   
      {(item.tags?.length || item.rating) && (
        <ul className="relative mt-auto flex flex-wrap items-center gap-2 pt-5">
          {item.tags?.map((tag) => (
            <li
              key={tag}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold leading-[18px]",
                item.featured
                  ? "bg-white/10 text-white"
                  : "bg-[#FFF0E2] text-[#963700]"
              )}
            >
              {tag}
            </li>
          ))}

          {item.rating && (
            <li className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold leading-[18px] text-white">
              {item.rating}
            </li>
          )}
        </ul>
      )}
    </article>
  );
}

export function WhyChooseUs() {
  return (
    <section className="w-full bg-[#F4F7FB]">
      <div className="mx-auto w-full max-w-[1104px] px-5 pb-[45px] pt-[56px]">

        {/* Heading */}
        <div className="mx-auto max-w-[650px] text-center">
          <span className="inline-flex items-center rounded-full bg-[#FFF0E2] px-3.5 py-1.5 text-xs font-semibold text-[#963700]">
            Why FixMate
          </span>

          <h2 className="mt-4 text-[36px] font-bold leading-[44px] tracking-tight text-[#142B4E]">
            Why Choose FixMate
          </h2>

          <p className="mx-auto mt-3 max-w-[600px] text-[16px] leading-[26px] text-[#64748B]">
            Everything you need to get a device fixed with confidence, from
            booking to payment.
          </p>
        </div>

        {/* Feature Cards */}
        <ul className="mt-[43px] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">

          {WHY_CHOOSE_US.map((item, index) => (
            <li
              key={item.title}
              className={cn(
                "min-w-0",
                index < 2
                  ? "lg:col-span-3"
                  : "lg:col-span-2"
              )}
            >
              <div
                className={cn(
                  "h-full",
                  index < 2
                    ? "min-h-[245px]"
                    : "min-h-[197px]"
                )}
              >
                <WhyChooseCard item={item} />
              </div>
            </li>
          ))}

        </ul>
           <div className="my-10">
          <TechnicianCta />
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
