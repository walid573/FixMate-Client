
"use client";

import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  Clock,
  Star,
  Users,
  Heart,
  ArrowRight,
  Check,
  CircleDollarSign,
  MapPin,
  ClipboardCheck,
  Smartphone,
  UserCheck,
  CreditCard,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const exploreClass = cn(
  buttonVariants({ size: "lg" }),
  "h-12 gap-3 rounded-full bg-brand-orange px-5 text-sm font-semibold text-brand-navy shadow-lg shadow-brand-orange/25 hover:bg-brand-orange/90"
);

const becomeClass = cn(
  buttonVariants({ variant: "outline", size: "lg" }),
  "h-12 rounded-full border-brand-navy/50 bg-white px-5 text-sm font-semibold text-brand-navy hover:bg-slate-50 hover:text-brand-navy"
);

const stats = [
  { value: "2,000+", label: "Repairs completed" },
  { value: "96", label: "Verified technicians" },
  { value: "4.9 ★", label: "Average rating" },
  { value: "30 min", label: "Typical response" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trust first",
    description:
      "Every technician is reviewed, and every service is approved before it goes live.",
  },
  {
    icon: CircleDollarSign,
    title: "Honest pricing",
    description:
      "You see the starting price up front, and the final amount before you pay.",
  },
  {
    icon: Users,
    title: "Fair to technicians",
    description:
      "Skilled people get steady work, clear requests and a simple way to run their jobs.",
  },
  {
    icon: MapPin,
    title: "Close to you",
    description:
      "Local technicians, with home visit or shop drop-off, wherever it suits you.",
  },
];

const steps = [
  {
    number: "1",
    title: "Technicians apply",
    description:
      "They create an account and list the repair services they offer.",
  },
  {
    number: "2",
    title: "We review each listing",
    description:
      "An admin checks every service. Only approved ones appear on FixMate.",
  },
  {
    number: "3",
    title: "Customers book with confidence",
    description:
      "Every job is tracked, and payment happens after the work is done.",
  },
];

const team = [
  { role: "Founder", color: "bg-orange-200" },
  { role: "Operations", color: "bg-slate-200" },
  { role: "Technician relations", color: "bg-orange-100" },
  { role: "Support", color: "bg-blue-100" },
];

const storyFeatures = [
  {
    old: "No updates after you hand over a device",
    title: "Step-by-step tracking",
    description:
      "Every job moves from Requested to Completed, and you see each step.",
  },
  {
    old: "Paying before any work is done",
    title: "Pay after the work",
    description:
      "The Pay Now button appears only once your job is completed.",
  },
  {
    old: "Skilled technicians with nowhere to show their work",
    title: "A home for their services",
    description:
      "Technicians list services, receive requests and manage every job.",
  },
];

export default function About() {
  return (
    <main className="overflow-hidden bg-[#f4f7fb] text-brand-navy">

      {/* HERO SECTION */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">

          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">

            {/* Hero content */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                <span className="size-2 rounded-full bg-brand-orange" />
                About FixMate
              </span>

              <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-navy sm:text-5xl lg:text-[3.2rem]">
                Repairs you can trust,
                <span className="block text-brand-orange-vivid">
                  from people who care.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
                FixMate connects people with verified local technicians,
                so every repair is clear, trackable and fairly priced.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/services" className={exploreClass}>
                  Explore Services
                  <span className="flex size-7 items-center justify-center rounded-full bg-brand-navy text-white">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>

                <Link href="/sign-up" className={becomeClass}>
                  Become a Technician
                </Link>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="relative mx-auto w-full max-w-md px-3 py-5">
              <div className="relative flex aspect-[1.2/1] items-center justify-center overflow-hidden rounded-[2.5rem] bg-[#ffead6]">

                <span className="absolute right-[10%] top-[10%] size-3 rounded-full bg-brand-orange" />

                {/* Decorative circles */}
                <div className="absolute -right-16 -top-16 size-64 rounded-full bg-orange-100/70" />

                {/* Smartphone */}
                <div className="relative z-10 flex h-[76%] w-[34%] flex-col items-center justify-center gap-3 rounded-[1.5rem] border-[5px] border-[#17345c] bg-[#112b4e] shadow-xl">

                  <div className="absolute top-2 h-1 w-12 rounded-full bg-slate-500/50" />

                  <span className="flex size-14 items-center justify-center rounded-full bg-brand-orange text-brand-navy">
                    <Wrench className="size-7 -rotate-12" />
                  </span>

                  <span className="h-1.5 w-14 rounded-full bg-slate-400/30" />
                  <span className="h-1.5 w-10 rounded-full bg-slate-400/20" />

                  <span className="mt-1 h-3 w-14 rounded-full bg-brand-orange" />
                </div>

                {/* Floating completed card */}
                <div className="absolute bottom-[12%] left-[-1%] z-20 flex items-center gap-2 rounded-xl bg-white p-3 shadow-lg shadow-slate-900/10 sm:left-[-2%]">
                  <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="size-4" />
                  </span>

                  <div>
                    <p className="text-[10px] font-bold text-brand-navy sm:text-xs">
                      Repair completed
                    </p>
                    <p className="text-[9px] text-slate-500 sm:text-[10px]">
                      Paid securely online
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Statistics */}
          <div className="mt-14 grid grid-cols-2 gap-6 rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-sm sm:grid-cols-4 sm:gap-4">

            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <h3 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
                  {stat.value}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}

          </div>

          {/* OUR STORY */}
          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">

            <div>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-bold text-brand-navy">
                Our story
              </span>

              <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Why we built FixMate
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Finding a trustworthy repair technician is hard. People
                hand over a device, hear nothing back and often pay before
                any work is done. Skilled technicians, meanwhile, have no
                simple place to show their services and manage incoming jobs.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                FixMate fixes both sides. Every job has a clear, trackable
                status, and payment happens only after the work is delivered.
              </p>
            </div>

            <div className="space-y-3">
              {storyFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-[10px] text-slate-400 line-through">
                    {feature.old}
                  </p>

                  <div className="mt-2 flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <Check className="size-4" />
                    </span>

                    <div>
                      <h3 className="text-xs font-bold text-brand-navy">
                        {feature.title}
                      </h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* OUR VALUES */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              What we stand for
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Four ideas guide every decision we make.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-lg"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <Icon className="size-5" />
                  </span>

                  <h3 className="mt-4 text-sm font-bold text-brand-navy">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {value.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* HOW WE WORK + TEAM */}
      <section className="bg-[#f4f7fb] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Reliability */}
          <div>
            <div className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                How we keep repairs reliable
              </h2>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-3">

              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                    {step.number}
                  </span>

                  <h3 className="mt-3 text-sm font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </div>
              ))}

            </div>
          </div>

    
          {/* CTA */}
          <div className="mt-14 flex flex-col justify-between gap-7 rounded-2xl bg-[#112b4e] px-7 py-10 text-white sm:px-10 lg:flex-row lg:items-center">

            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Ready to get it fixed?
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Find a verified technician, or start offering your own services.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/services" className={exploreClass}>
                Explore Services
                <span className="flex size-7 items-center justify-center rounded-full bg-brand-navy text-white">
                  <ArrowRight className="size-4" />
                </span>
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/60 px-5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand-navy"
              >
                Become a Technician
              </Link>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
