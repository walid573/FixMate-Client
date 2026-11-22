import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { authFetch } from "@/lib/Session/server";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
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

  if (session?.user?.role !== "admin") redirect("/forbidden");

  const res = await authFetch(`/admin/bookings`, {
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Admin bookings fetch failed:", res.status, await res.text());
  }
  const bookings = res.ok ? await res.json() : [];

  return (
    <div className="space-y-6">
      <div>
        <DashboardBreadcrumb
          items={[
            { label: "Admin", href: "/dashboard/admin" },
            { label: "Bookings" },
          ]}
          badge="Admin"
        />

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-navy">
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