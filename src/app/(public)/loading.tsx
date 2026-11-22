import { Skeleton } from "@/components/ui/skeleton";

// Shared loading state for the public home and about routes (the services
// routes have their own, more specific skeleton). Mirrors the navy hero and
// card layout so the page doesn't jump when the real content arrives.
export default function Loading() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-brand-navy">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="space-y-5">
            <Skeleton className="h-6 w-36 rounded-full bg-white/10" />
            <Skeleton className="h-12 w-full max-w-md bg-white/15" />
            <Skeleton className="h-12 w-4/5 max-w-sm bg-white/15" />
            <Skeleton className="h-4 w-full max-w-lg bg-white/10" />
            <Skeleton className="h-4 w-5/6 max-w-md bg-white/10" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 w-40 rounded-full bg-white/15" />
              <Skeleton className="h-11 w-32 rounded-full bg-white/10" />
            </div>
          </div>
          <Skeleton className="hidden h-80 rounded-2xl bg-white/10 lg:block" />
        </div>
      </section>

      {/* Content section */}
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-9 w-72" />
          <Skeleton className="mx-auto h-4 w-96 max-w-full" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm"
            >
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="mt-5 h-5 w-3/4" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
              <Skeleton className="mt-5 h-10 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
