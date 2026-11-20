import React from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServices } from "@/lib/api/services";



interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    mode?: string;
    sort?: string;
  }>;
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const category = resolvedParams.category || "all";
  const mode = resolvedParams.mode || "all";
  const sort = resolvedParams.sort || "newest";

  // Fetch services from http://localhost:8000/services

  const services = await getServices()

  
  const normalizeText = (value: string | undefined | null) =>
  (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const matchesSearch = (service: (typeof services)[number], query: string) => {
  if (!query.trim()) return true;

  const searchableText = normalizeText(
    [
      service.title,
      service.description,
      service.category,
      service.technicianName,
      service.serviceArea,
      service.serviceMode,
    ].join(" ")
  );

  const words = searchableText.split(" ");
  const searchWords = normalizeText(query).split(" ").filter(Boolean);

  return searchWords.every((searchWord) => {
    // AC should match AC, Air Conditioner, or Air Conditioning
    if (searchWord === "ac") {
      return (
        words.includes("ac") ||
        searchableText.includes("air conditioner") ||
        searchableText.includes("air conditioning")
      );
    }

    // Match complete words or word beginnings
    return words.some((word) => word.startsWith(searchWord));
  });
};

  // Filter & sort on the server
  const filtered = services.filter((s) => {
    // Only approved and available services
    if (s.approvalStatus !== "approved") return false;
    if (s.isAvailable !== true) return false;

    // Improved search
    if (!matchesSearch(s, search)) return false;

    // Category filter
    if (
      category !== "all" &&
      normalizeText(s.category) !== normalizeText(category)
    ) {
      return false;
    }

    // Service mode filter
    if (
      mode !== "all" &&
      normalizeText(s.serviceMode) !== normalizeText(mode)
    ) {
      return false;
    }

    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sort === "price-asc") return a.basePrice - b.basePrice;
    if (sort === "price-desc") return b.basePrice - a.basePrice;
    // default newest (by _id / date approximation)
    return b._id.localeCompare(a._id);
  });

  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy">
          Find the Right Repair Service
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Search verified technicians by category, service mode and price.
        </p>
      </div>

      {/* Search & Filter Bar (Server-driven via form navigation) */}
      <form method="GET" className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:grid-cols-2 lg:grid-cols-5">
        {/* Search input */}
        <div className="relative lg:col-span-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search service titles..."
            className="pl-9 h-10"
          />
        </div>

        {/* Category filter */}
        <select
          name="category"
          defaultValue={category}
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Service mode filter */}
        <select
          name="mode"
          defaultValue={mode}
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">Home Visit / Shop Drop-off</option>
          <option value="Home Visit">Home Visit</option>
          <option value="Shop Drop-off">Shop Drop-off</option>
        </select>

        {/* Sort */}
        <select
          name="sort"
          defaultValue={sort}
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="newest">Sort: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        {/* Submit / Clear filters */}
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 h-10 bg-brand-orange text-brand-navy hover:bg-brand-orange/90 font-semibold">
            Filter
          </Button>
          {(search || category !== "all" || mode !== "all" || sort !== "newest") && (
            <Button variant="outline" className="h-10 px-3" render={<Link href="/services" />}>
              <X className="size-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Services Grid */}
      {filtered.length === 0 ? (
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
          {filtered.map((service) => (
            <div
              key={service._id}
              className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Image banner — light blue-gray placeholder matching the mock */}
              <div className="flex h-48 w-full items-center justify-center rounded-t-2xl bg-[#e8eef5]">
                {service.image && service.image.startsWith("http") ? (
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

              <div className="p-5">
                {/* Category badge + service mode on the same row */}
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
                  className="mt-4 w-full rounded-xl bg-brand-orange text-brand-navy hover:bg-brand-orange/90 font-semibold h-10 shadow-sm"
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
