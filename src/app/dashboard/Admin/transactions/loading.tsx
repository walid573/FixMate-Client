import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
          Transactions
        </h1>
        <p className="text-sm text-muted-foreground">
          Every payment received through Stripe.
        </p>
      </div>
      <Card className="rounded-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50">
                  {["Payment", "Customer", "Technician", "Amount", "Status", "Receipt"].map(
                    (title, i) => (
                      <th key={i} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                        {title}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5, 6].map((row) => (
                  <tr key={row}>
                    {[1, 2, 3, 4, 5, 6].map((col) => (
                      <td key={col} className="px-6 py-4">
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
