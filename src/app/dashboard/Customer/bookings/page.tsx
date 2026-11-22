import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getBookings } from "@/lib/api/bookings";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import BookingsClient from "./BookingsClient";

export default async function BookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const bookings = await getBookings(session.user.email);

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Customer", href: "/dashboard/customer" },
          { label: "My Bookings" },
        ]}
        badge="Customer"
      />

      <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
        My Bookings
      </h1>

      <BookingsClient bookings={bookings} />
    </div>
  );
}