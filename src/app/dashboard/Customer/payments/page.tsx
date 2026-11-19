import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getPayments } from "@/lib/api/payments";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import PaymentsClient from "./PaymentsClient";

export default async function PaymentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/login");
  }

  const payments = await getPayments(session.user.email);

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Customer", href: "/dashboard/customer" },
          { label: "Payments" },
        ]}
        badge="Customer"
      />

      <PaymentsClient payments={payments} />
    </div>
  );
}
