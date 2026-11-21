import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

export default function Loading() {
  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[{ label: "Customer" }, { label: "Overview" }]}
        badge="Customer"
      />
      <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
        Customer Overview
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((_, i) => (
          <Card key={i} className="rounded-xl p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32 mt-2" />
          </Card>
        ))}
      </div>
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-2 w-full mt-2" />
          <div className="mt-4">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2 w-1/2 mt-1" />
            <Skeleton className="h-2 w-1/3 mt-1" />
            <Skeleton className="h-2 w-1/4 mt-1" />
          </div>
          <Skeleton className="h-4 w-1/4 mt-4" />
        </CardContent>
      </Card>
    </div>
  );
}