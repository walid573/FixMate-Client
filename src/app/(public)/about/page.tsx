import Link from "next/link";
import { Wrench, Shield, Clock, Star, Users, Heart, CalendarDays, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Find a Service",
    description:
      "Browse verified repair services by category — smartphone, laptop, AC, TV, appliances and more. Filter by price, location, or service mode (home visit or shop drop-off).",
    icon: Wrench,
  },
  {
    number: "02",
    title: "Book & Confirm",
    description:
      "Select your preferred date, describe the problem, and submit. The technician reviews and accepts. You get real-time status updates: Requested → Accepted → In Progress → Completed.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Pay After Service",
    description:
      "No upfront payment. Once the technician marks the job completed, you receive a secure Stripe Checkout link. Pay only when the work is done — card, wallet, or bank redirect.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Rate & Review",
    description:
      "After payment, leave a rating and review. Your feedback helps other customers choose the best technician and keeps quality high across the platform.",
    icon: Star,
  },
];

const values = [
  {
    icon: Shield,
    title: "Verified Technicians",
    description:
      "Every technician is background-checked and their services are admin-approved before going live.",
  },
  {
    icon: Clock,
    title: "On-Time Service",
    description:
      "Real-time status tracking means you always know when your technician will arrive.",
  },
  {
    icon: Heart,
    title: "Pay After Completion",
    description:
      "Risk-free model — you only pay when the job is done to your satisfaction.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Transparent ratings and reviews build trust between customers and technicians.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-navy px-6 py-20 sm:px-12 lg:px-20">
        <div
          className="pointer-events-none absolute -top-1/2 -right-1/2 size-96 rounded-full bg-brand-orange/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-brand-orange/15 px-4 py-1.5 text-sm font-semibold text-brand-orange mb-6">
            Since 2024
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Fixing Things,<br />
            <span className="text-brand-orange">Building Trust</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            FixMate connects you with verified local repair technicians. Book a service,
            track the repair, and pay only when the job is done — no surprises.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-brand-orange text-brand-navy hover:bg-brand-orange/90 font-semibold"
              render={<Link href="/services" />}
            >
              Browse Services
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              render={<Link href="/register" />}
            >
              Become a Technician
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Four simple steps from broken to fixed — all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {steps.map((step) => (
              <Card key={step.number} className="relative overflow-hidden border-slate-200 hover:border-brand-orange/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-orange/10 mx-auto">
                    <step.icon className="size-7 text-brand-orange" aria-hidden="true" />
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-extrabold text-brand-navy">{step.number}</span>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              What We Stand For
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              These principles guide every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center p-6">
                <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-orange/10 mx-auto">
                  <value.icon className="size-7 text-brand-orange" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Technicians */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-brand-navy p-8 md:p-16 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Are You a Repair Technician?
            </h2>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Join FixMate and get access to customers in your area. Set your own prices,
              manage your schedule, and build your reputation with verified reviews.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-brand-orange text-brand-navy hover:bg-brand-orange/90 font-semibold"
                render={<Link href="/register" />}
              >
                Sign Up as Technician
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                render={<Link href="/services" />}
              >
                See How It Looks
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "How do I know the technician is qualified?",
                a:
                  "All technicians undergo background verification and their services are reviewed by our admin team before going live. You can also see ratings and reviews from previous customers.",
              },
              {
                q: "What if I'm not satisfied with the repair?",
                a:
                  "You only pay after the job is marked completed. If there's an issue, contact support and we'll mediate. Technicians can also adjust the final amount before you pay.",
              },
              {
                q: "Can I cancel a booking?",
                a:
                  "Yes, you can cancel any booking that's still in 'Requested' status — no fees. Once a technician accepts, contact them directly or reach out to support.",
              },
              {
                q: "What payment methods are accepted?",
                a:
                  "We use Stripe Checkout, which supports cards, digital wallets (Apple Pay, Google Pay), and bank redirects depending on your country.",
              },
              {
                q: "How do I become a technician on FixMate?",
                a:
                  "Sign up as a Technician, add your services with pricing and details, and wait for admin approval. Once approved, your services appear in search and customers can book you.",
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 bg-white p-5">
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-brand-navy">
                  {faq.q}
                  <span className="text-brand-orange transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}