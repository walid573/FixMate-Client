import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

export default function Loading() {
  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[{ label: "Admin" }, { label: "Overview" }]}
        badge="Admin"
      />
      <h1 className="text-2xl font-bold text-brand-navy">
        Admin Overview
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b">
                  {["Users", "Services", "Bookings", "Payments", "Latest", "Recent"].map(
                    (title, i) => (
                      <th key={i} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                        {title}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row} className="border-b">
                    {[1, 2, 3, 4, 5, 6].map((col) => (
                      <td key={col} className="px-6 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
