import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getBookings } from "@/lib/api/bookings";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import BookingRequestsClient from "./BookingRequestsClient";

// ---------------------------------------------------------------------------
// Booking Requests (Technician) — SERVER COMPONENT
//
// Reads the technician session, fetches bookings assigned to this technician's
// email (`GET /bookings?technicianEmail=...`), and renders the Manage Requests
// interface (table, status tabs, search, action buttons, pagination).
// ---------------------------------------------------------------------------
export default async function BookingRequestPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/login");
  }

  const bookings = await getBookings(session.user.email);

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Technician", href: "/dashboard/technician" },
          { label: "Booking Requests" },
        ]}
        badge="Technician"
      />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
          Manage Requests
        </h1>
        <p className="text-sm text-muted-foreground">
          Review bookings from customers and move each job forward.
        </p>
      </div>

      <BookingRequestsClient
        bookings={bookings}
        technicianEmail={session.user.email}
      />
    </div>
  );
}
