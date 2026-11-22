import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <DashboardBreadcrumb
          items={[
            { label: "Technician", href: "/dashboard/technician" },
            { label: "My Services" },
          ]}
          badge="Technician"
        />

        <h1 className="mt-4 text-2xl font-bold text-brand-navy">
          My Services
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage the services you offer.
        </p>
      </div>
      <Card className="rounded-xl">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}