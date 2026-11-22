import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <DashboardBreadcrumb
          items={[
            { label: "Admin", href: "/dashboard/admin" },
            { label: "Services" },
          ]}
          badge="Admin"
        />

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-navy">
          Service Approval
        </h1>
        <p className="text-sm text-muted-foreground">
          Review services from every technician. Pending ones come first.
        </p>
      </div>
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50">
              <tr className="border-b text-left text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Technician</th>
                <th className="px-6 py-3">Base Price</th>
                <th className="px-6 py-3">Submitted</th>
                <th className="px-6 py-3">Approval</th>
                <th className="px-6 py-3">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="hover:bg-slate-50/30">
                  {[1, 2, 3, 4, 5, 6].map((col) => (
                    <td key={col} className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}