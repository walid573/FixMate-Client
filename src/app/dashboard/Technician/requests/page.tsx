import { redirect } from "next/navigation";
import { getBookings } from "@/lib/api/bookings";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import BookingRequestsClient from "./BookingRequestsClient";
import { getSessionServer } from "@/lib/Session/server";


export default async function BookingRequestPage() {
  const session = await getSessionServer()
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const bookings = await getBookings(undefined, session.user.email);

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
