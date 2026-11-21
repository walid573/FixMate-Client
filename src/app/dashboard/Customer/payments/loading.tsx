import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

export default function Loading() {
  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[{ label: "Customer" }, { label: "Payments" }]}
        badge="Customer"
      />
      <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
        Payment History
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((_, i) => (
          <Card key={i} className="rounded-xl p-5">
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
                  {["Date", "Service", "Amount", "Method", "Transaction ID", "Status", "Receipt"].map(
                    (label, i) => (
                      <th key={i} className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground">
                        {label}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((row) => (
                  <tr key={row} className="border-b">
                    {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                      <td key={col} className="py-3.5 pr-4">
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