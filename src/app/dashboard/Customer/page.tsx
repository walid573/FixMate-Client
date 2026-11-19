import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBookings } from "@/lib/api/bookings";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import RecentBookings from "./RecentBookings";

export interface Stat {
  label: string;
  value: string;
}

const ACTIVE_STATUSES = ["requested", "accepted", "in-progress"];

const CustomerPage = async () => {
  // Read session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
          Customer Overview
        </h1>
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Please log in to view your bookings.
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch real bookings for the logged-in customer
  const rawBookings = await getBookings(session.user.email);

  // Derive stats from real data
  const totalRequests = rawBookings.length;
  const activeJobs = rawBookings.filter((b) =>
    ACTIVE_STATUSES.includes(b.status)
  ).length;
  const completedJobs = rawBookings.filter(
    (b) => b.status === "completed"
  ).length;
  const totalSpent = rawBookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (b.finalAmount ?? b.basePrice ?? 0), 0);

  const stats: Stat[] = [
    { label: "Total Requests", value: String(totalRequests) },
    { label: "Active Jobs", value: String(activeJobs) },
    { label: "Completed Jobs", value: String(completedJobs) },
    { label: "Total Spent", value: `$${totalSpent.toLocaleString()}` },
  ];

  // Most recent active booking for the tracking card
  const activeBooking = rawBookings.find((b) =>
    ACTIVE_STATUSES.includes(b.status)
  );

  // Progress steps for the tracking card
  const statusSteps = ["requested", "accepted", "in-progress", "completed"];
  const currentStepIndex = activeBooking
    ? Math.max(0, statusSteps.indexOf(activeBooking.status))
    : -1;

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[{ label: "Customer" }, { label: "Overview" }]}
        badge="Customer"
      />

      <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
        Customer Overview
      </h1>


      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-xl p-4">
            <p className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-brand-navy">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

   
      {activeBooking ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-brand-navy">
                Tracking: {activeBooking.serviceTitle}
              </h3>
              <span className="text-xs font-medium text-muted-foreground">
                Technician: {activeBooking.technicianName}
              </span>
            </div>

     
            <div className="mt-6">
              <div className="grid grid-cols-4 gap-2">
                {statusSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full ${
                      i <= currentStepIndex
                        ? "bg-brand-orange"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
                {statusSteps.map((step, i) => (
                  <span
                    key={step}
                    className={
                      i <= currentStepIndex
                        ? "text-brand-navy font-semibold"
                        : ""
                    }
                  >
                    {step === "in-progress"
                      ? "In Progress"
                      : step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Pay Now appears once the technician marks the job Completed.
            </p>
          </CardContent>
        </Card>
      ) : null}


      <RecentBookings bookings={rawBookings} />
    </div>
  );
};

export default CustomerPage;