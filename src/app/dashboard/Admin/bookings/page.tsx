import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import ManageBookingsClient from "./ManageBookingsClient";

// ---------------------------------------------------------------------------
// All Bookings (Admin) — SERVER COMPONENT
//
// Fetches every booking on the platform and passes the list to the client
// for filtering, searching, and pagination. Admins are read-only here.
// ---------------------------------------------------------------------------
export default async function ManageBookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Admin guard (commented out for demo — enable in production)
  // if (session?.user?.role !== "admin") redirect("/");

  const res = await fetch(`${process.env.BASE_URL}/bookings/all`, {
    cache: "no-store",
  });
  const bookings = res.ok ? await res.json() : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
          All Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          Every booking on the platform.
        </p>
      </div>

      <ManageBookingsClient initialBookings={bookings} />
    </div>
  );
}