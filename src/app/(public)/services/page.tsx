import React from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SERVICE_CATEGORIES,
  canonicalCategory,
} from "@/constants/categories";
import { getServiceCategories, getServicesByQuery } from "@/lib/api/services";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    mode?: string;
    sort?: string;
  }>;
}

const SORTS = ["newest", "price-asc", "price-desc"] as const;
type Sort = (typeof SORTS)[number];

export default async function ServicesPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const search = resolved.search || "";
  const category = resolved.category || "all";
  const mode = resolved.mode || "all";
  const sort: Sort = SORTS.includes(resolved.sort as Sort)
    ? (resolved.sort as Sort)
    : "newest";
  // Canonicalise both the URL value and the API values so the dropdown never
  // shows aliases like "ac" next to "AC" or "laptop" next to "Laptop & PC".
  const selectedCategory = canonicalCategory(category);

  // Everything below is executed by MongoDB in GET /services. The URL is the
  // single source of truth, so filters survive a reload and a home-page
  // category card (?category=AC) arrives here already applied.
  const [services, categoryList] = await Promise.all([
    getServicesByQuery({
      search: search || undefined,
      category: selectedCategory,
      mode: mode !== "all" ? mode : undefined,
      sort,
      approvalStatus: "approved",
      isAvailable: true,
    }),
    getServiceCategories(),
  ]);

  // Keep the dropdown stable while filters are applied: combine the API list
  // with the known categories and whatever category is currently selected.
  const categories = [
    ...new Set(
      [
        ...SERVICE_CATEGORIES.map((c) => c.label),
        ...categoryList.map((c) => canonicalCategory(c) ?? c),
        ...(selectedCategory ? [selectedCategory] : []),
      ].filter(Boolean) as string[]
    ),
  ].sort((a, b) => a.localeCompare(b));

  const hasFilters =
    Boolean(search) ||
    Boolean(selectedCategory) ||
    mode !== "all" ||
    sort !== "newest";

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy">
          Find the Right Repair Service
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Search verified technicians by category, service mode and price.
        </p>
      </div>

      {/* Search & Filter Bar — a plain GET form, so all state lives in the URL */}
      <form
        method="GET"
        className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:grid-cols-2 lg:grid-cols-5"
      >
        <div className="relative lg:col-span-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search by title or category..."
            className="pl-9 h-10"
          />
        </div>

        <select
          name="category"
          defaultValue={selectedCategory ?? "all"}
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          name="mode"
          defaultValue={mode}
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">Home Visit / Shop Drop-off</option>
          <option value="Home Visit">Home Visit</option>
          <option value="Shop Drop-off">Shop Drop-off</option>
        </select>

        <select
          name="sort"
          defaultValue={sort}
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="newest">Sort: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1 h-10 bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/90"
          >
            Filter
          </Button>
          {hasFilters && (
            <Button
              variant="outline"
              className="h-10 px-3"
              render={<Link href="/services" />}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </form>

      <p className="text-sm text-muted-foreground">
        {services.length} {services.length === 1 ? "service" : "services"} found
      </p>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <p className="text-base font-semibold text-brand-navy">No services found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search query or filters.
          </p>
          <Button variant="outline" className="mt-4" render={<Link href="/services" />}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-48 w-full items-center justify-center rounded-t-2xl bg-[#e8eef5]">
                {service.image && service.image.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.image}
                    alt={service.title}
                    className="size-full rounded-t-2xl object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-slate-500">
                    [ {service.category} photo ]
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {service.category}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {service.serviceMode}
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-brand-navy">
                  {service.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {service.technicianName} · {service.serviceArea}
                </p>

                <p className="mt-1 text-xs font-semibold text-brand-navy">
                  {service.estimatedDuration} · From ${service.basePrice}
                </p>

                <Button
                  className="mt-auto h-10 w-full rounded-xl bg-brand-orange font-semibold text-brand-navy shadow-sm hover:bg-brand-orange/90"
                  render={<Link href={`/services/${service._id}`} />}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
