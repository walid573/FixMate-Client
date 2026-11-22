
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { authFetch } from "@/lib/Session/server";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import ManageTransactionsClient from "./ManageTransactionsClient";


export default async function TransactionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (session?.user?.role !== "admin") redirect("/forbidden");

  const res = await authFetch("/admin/payments", {
    cache: "no-store",
  });

  let payments = [];

  if (res.ok) {
    const result = await res.json();
    payments = Array.isArray(result.data)
      ? result.data
      : {};
  } else {
    console.error(
      "Failed to fetch admin payments:",
      res.status,
      await res.text()
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <DashboardBreadcrumb
          items={[
            { label: "Admin", href: "/dashboard/admin" },
            { label: "Transactions" },
          ]}
          badge="Admin"
        />

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-navy">
          Transactions
        </h1>

        <p className="text-sm text-muted-foreground">
          Every payment received through Stripe.
        </p>
      </div>

      <ManageTransactionsClient
        initialPayments={payments}
      />
    </div>
  );
}
