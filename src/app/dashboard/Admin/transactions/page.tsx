import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import ManageTransactionsClient from "./ManageTransactionsClient";

// ---------------------------------------------------------------------------
// Transactions (Admin) — SERVER COMPONENT
//
// Fetches every payment on the platform and passes the list to the client
// for filtering, searching, and pagination. Admins are read-only here.
// ---------------------------------------------------------------------------
export default async function TransactionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Admin guard (commented out for demo — enable in production)
  // if (session?.user?.role !== "admin") redirect("/");

  const res = await fetch(`${process.env.BASE_URL}/payments/all`, {
    cache: "no-store",
  });
  const payments = res.ok ? await res.json() : [];

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

      <ManageTransactionsClient initialPayments={payments} />
    </div>
  );
}