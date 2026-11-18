import { CategoryGrid } from "@/components/home/category-grid";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <CategoryGrid />
    </main>
  );
}
