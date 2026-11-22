import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { authFetch } from "@/lib/Session/server";
import type { Payment } from "@/lib/api/payments";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import PaymentsClient from "./PaymentsClient";

export default async function PaymentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Server-side fetch WITH the backend JWT (the /payments route is protected)
  let payments: Payment[] = [];
  try {
    const res = await authFetch(
      `/payments?email=${encodeURIComponent(session.user.email)}`
    );
    if (res.ok) {
      const data = await res.json();
      payments = Array.isArray(data) ? data : [];
    } else {
      console.error("Failed to fetch payments:", res.status);
    }
  } catch (error) {
    console.error("Failed to fetch payments:", error);
  }

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
