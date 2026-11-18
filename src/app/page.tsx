import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedServices } from "@/components/home/featured-services";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <FeaturedServices />
      <CategoryGrid />
    </main>
  );
}
