import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedServices } from "@/components/home/featured-services";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { TechnicianCta } from "@/components/home/technician-cta";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <CategoryGrid />
      <FeaturedServices />
      <HowItWorks />
      <WhyChooseUs />
      <TechnicianCta />
    </main>
  );
}
