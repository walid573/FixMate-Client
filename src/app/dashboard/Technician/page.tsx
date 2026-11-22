import React from "react";
import { redirect } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { headers } from "next/headers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import { ServiceJobsChart } from "@/components/charts/DashboardCharts";

import { auth } from "@/lib/auth";
import { getBookings } from "@/lib/api/bookings";
import { getServices } from "@/lib/api/services";
import OverviewBookings from "./OverviewBookings";

export default async function TechnicianPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const technicianEmail = session.user.email;
  // Fetch real data from the backend.
  const [bookings, services] = await Promise.all([
    getBookings(undefined, technicianEmail).catch(() => []),
    getServices(technicianEmail, session.user.id).catch(() => []),
  ]);

  // ---- Stats computed from real bookings ----
  const totalServices = services.length;
  const approvedServices = services.filter(
    (s) => s.approvalStatus === "approved"
  ).length;
  const pendingRequests = bookings.filter((b) => b.status === "requested").length;
  const activeRepairs = bookings.filter(
    (b) => b.status === "accepted" || b.status === "in-progress"
  ).length;
  const completedJobs = bookings.filter((b) => b.status === "completed").length;
  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.finalAmount ?? b.basePrice ?? 0), 0);

  // ---- Service performance (group bookings by service title) ----
  const performanceMap = new Map<string, { title: string; jobs: number }>();
  bookings.forEach((b) => {
    const existing = performanceMap.get(b.serviceTitle);
    if (existing) existing.jobs += 1;
    else performanceMap.set(b.serviceTitle, { title: b.serviceTitle, jobs: 1 });
  });
  const servicePerformance = Array.from(performanceMap.values()).sort(
    (a, b) => b.jobs - a.jobs
  );

  return (
    <div className="space-y-6 w-full min-w-0 mb-20">
      <DashboardBreadcrumb
        items={[{ label: "Technician" }, { label: "Overview" }]}
        badge="Technician"
      />

      <h1 className="text-2xl font-bold text-brand-navy">
        Technician Overview
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground">Total Services</p>
          <p className="mt-2 text-2xl font-bold text-brand-navy">
            {totalServices}
          </p>
        </Card>
        <Card className="rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground">Approved Services</p>
          <p className="mt-2 text-2xl font-bold text-brand-navy">
            {approvedServices}
          </p>
        </Card>
        <Card className="rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground">Pending Requests</p>
          <p className="mt-2 text-2xl font-bold text-brand-navy">
            {pendingRequests}
          </p>
        </Card>
        <Card className="rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground">Active Repairs</p>
          <p className="mt-2 text-2xl font-bold text-brand-navy">
            {activeRepairs}
          </p>
        </Card>
        <Card className="rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground">Completed Jobs</p>
          <p className="mt-2 text-2xl font-bold text-brand-navy">
            {completedJobs}
          </p>
        </Card>
        <Card className="rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground">Total Earnings</p>
          <p className="mt-2 text-2xl font-bold text-brand-navy">
            ${totalEarnings.toLocaleString()}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Booking Requests</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="w-48 pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <OverviewBookings
            bookings={bookings}
            technicianEmail={technicianEmail}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceJobsChart data={servicePerformance} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>My Services</CardTitle>
            <Button size="sm">
              <Plus />
              Add New Service
            </Button>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                  <th className="pb-3">Service</th>
                  <th className="pb-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service._id} className="border-b last:border-0">
                    <td className="py-3 text-muted-foreground">
                      {service.title}
                    </td>
                    <td className="py-3 text-right font-medium text-brand-navy">
                      ${service.basePrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-sm text-muted-foreground">
                      No services found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}