import { WHY_CHOOSE_US } from "@/constants/why-choose-us";

export function WhyChooseUs() {
  return (
    <section className="bg-brand-cream">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <h2 className="text-2xl font-bold tracking-tight text-brand-navy">
          Why Choose FixMate
        </h2>

        <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item) => (
            <li key={item.title}>
              <h3 className="text-base font-bold text-brand-navy">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
