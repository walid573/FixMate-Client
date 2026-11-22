import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { ArrowRight } from "lucide-react";

import { auth } from "@/lib/auth";
import { authFetch } from "@/lib/Session/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePill } from "@/components/bookings/BookingActionCell";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import { statusBadge, paymentBadge } from "@/lib/booking-status";
import type { Service } from "@/lib/api/services";
import PendingServicesCard from "./PendingServicesCard";

// ---------------------------------------------------------------------------
// Admin Overview — SERVER COMPONENT, ALL REAL DATA.
//
// Four backend reads run in parallel:
//   GET /users          -> user / technician counts + latest users
//   GET /services       -> service count + pending approvals
//   GET /bookings/all   -> booking count + latest bookings
//   GET /payments/all   -> Stripe revenue + latest transactions
// Every number on this page comes from MongoDB — nothing is mocked.
// Amounts are USD ($) per the brand rules.
// ---------------------------------------------------------------------------

interface UserRow {
  _id: string;
  name?: string;
  email: string;
  role?: string;
}

interface BookingRow {
  _id: string;
  serviceTitle: string;
  customerName: string;
  technicianName?: string;
  status: string;
  paymentStatus?: string;
}

interface PaymentRow {
  bookingId: string;
  serviceTitle: string;
  customerName?: string;
  customerEmail: string;
  amount: number;
  status: string;
  paidAt?: string;
  createdAt?: string;
}

// Role badges match ManageUsersClient so the pill looks identical everywhere.
const ROLE_BADGES: Record<string, { label: string; className: string }> = {
  customer: { label: "Customer", className: "bg-brand-navy text-white" },
  technician: { label: "Technician", className: "bg-blue-50 text-blue-600" },
  admin: { label: "Admin", className: "bg-purple-50 text-purple-600" },
};

function usd(amount: number) {
  // JSON turns a corrupt NaN amount into null — render it as "—" instead of
  // crashing the whole dashboard on .toLocaleString().
  if (amount == null || !Number.isFinite(Number(amount))) return "$—";
  return `$${Number(amount).toLocaleString()}`;
}

function shortDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Simplified auth check for demo/mock purposes.
  // if (session?.user?.role !== "admin") {
  //   redirect("/");
  // }

  const [usersRes, servicesRes, bookingsRes, paymentsRes] = await Promise.all([
    authFetch(`/users`, { cache: "no-store" }),
    authFetch(`/services`, { cache: "no-store" }),
    authFetch(`/admin/bookings`, { cache: "no-store" }),
    authFetch(`/admin/payments`, { cache: "no-store" }),
  ]);

  // Surface failures in the server terminal instead of silently showing zeros.
  [usersRes, servicesRes, bookingsRes, paymentsRes].forEach((r) => {
    if (!r.ok) console.error("Admin overview fetch failed:", r.url, r.status);
  });

  const users: UserRow[] = usersRes.ok ? await usersRes.json() : [];
  const services: Service[] = servicesRes.ok ? await servicesRes.json() : [];
  const bookings: BookingRow[] = bookingsRes.ok
    ? await bookingsRes.json()
    : [];
  // /admin/payments responds with { success, total, data }
  const paymentsBody = paymentsRes.ok ? await paymentsRes.json() : null;
  const payments: PaymentRow[] = Array.isArray(paymentsBody?.data)
    ? paymentsBody.data
    : [];

  // ---- Derived stats -------------------------------------------------------
  const technicians = users.filter((u) => u.role === "technician").length;
  const paidPayments = payments.filter((p) => p.status === "paid");
  const revenue = paidPayments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  const pendingServices = services.filter(
    (s) => s.approvalStatus === "pending"
  );

  // /bookings/all and /payments/all arrive newest-first already.
  const latestUsers = [...users]
    .sort((a, b) => (b._id > a._id ? 1 : -1))
    .slice(0, 5);
  const recentPayments = paidPayments.slice(0, 5);
  const latestBookings = bookings.slice(0, 6);

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[{ label: "Admin" }, { label: "Overview" }]}
        badge="Admin"
      />

      <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
        Admin Overview
      </h1>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Users" value={users.length.toLocaleString()} />
        <StatCard title="Technicians" value={technicians.toLocaleString()} />
        <StatCard title="Services" value={services.length.toLocaleString()} />
        <StatCard
          title="Total Bookings"
          value={bookings.length.toLocaleString()}
        />
        <StatCard title="Stripe Revenue" value={usd(revenue)} />
      </div>

      {/* ---- Pending service approvals (working buttons) ---- */}
      <PendingServicesCard
        services={pendingServices.slice(0, 5)}
        totalPending={pendingServices.length}
      />

      {/* ---- Users + transactions ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Manage Users</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
              render={<Link href="/dashboard/admin/users" />}
            >
              View all
              <ArrowRight className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {latestUsers.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No users yet.
              </p>
            ) : (
              <div className="space-y-4">
                {latestUsers.map((user) => {
                  const badge =
                    ROLE_BADGES[user.role ?? "customer"] ??
                    ROLE_BADGES.customer;
                  return (
                    <div
                      key={user._id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-brand-navy">
                          {user.name || user.email}
                        </p>
                        {user.name ? (
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        ) : null}
                      </div>
                      <BadgePill badge={badge} />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Recent Transactions</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
              render={<Link href="/dashboard/admin/transactions" />}
            >
              View all
              <ArrowRight className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No payments yet.
              </p>
            ) : (
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.bookingId}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-brand-navy">
                        {payment.serviceTitle}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {payment.customerName || payment.customerEmail}
                        {shortDate(payment.paidAt ?? payment.createdAt)
                          ? ` · ${shortDate(payment.paidAt ?? payment.createdAt)}`
                          : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-brand-navy">
                      {usd(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---- Latest bookings ---- */}
      <Card className="rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>All Bookings</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            render={<Link href="/dashboard/admin/bookings" />}
          >
            View all
            <ArrowRight className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="pb-3">Service</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Technician</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {latestBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-sm text-muted-foreground"
                  >
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                latestBookings.map((booking) => (
                  <tr key={booking._id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{booking.serviceTitle}</td>
                    <td className="py-3">{booking.customerName}</td>
                    <td className="py-3">{booking.technicianName || "—"}</td>
                    <td className="py-3">
                      <BadgePill badge={statusBadge(booking.status)} />
                    </td>
                    <td className="py-3">
                      {/* Pay-after-service: payment only exists once the job
                          is completed — otherwise there is nothing to show. */}
                      {booking.status === "completed" ? (
                        <BadgePill badge={paymentBadge(booking.paymentStatus)} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        render={
                          <Link href="/dashboard/admin/bookings" />
                        }
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </Card>
  );
}
