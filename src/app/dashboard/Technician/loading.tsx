import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

export default function Loading() {
  return (
    <div className="space-y-6 w-full min-w-0 mb-20">
      <DashboardBreadcrumb
        items={[{ label: "Technician" }, { label: "Overview" }]}
        badge="Technician"
      />
      <h1 className="text-2xl font-bold text-brand-navy">
        Technician Overview
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="rounded-xl p-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-24 mt-2" />
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((row) => (
              <Skeleton key={row} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((col) => (
          <Card key={col}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}