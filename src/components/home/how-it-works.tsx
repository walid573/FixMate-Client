import { HOW_IT_WORKS_STEPS } from "@/constants/how-it-works";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-brand-cream">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <h2 className="text-2xl font-bold tracking-tight text-brand-navy">
          How It Works
        </h2>

        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-brand-navy">
                Step {index + 1}
              </span>

              <h3 className="mt-3 text-base font-bold text-brand-navy">
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
