"use client";

import React from "react";
import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

import {
  stats,
  bookings,
  servicePerformance,
  myServices,
  type BookingStatus,
} from "./mock-data";

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

const statusLabels: Record<BookingStatus, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
};

const statusStyles: Record<BookingStatus, string> = {
  requested: "bg-brand-orange/10 text-brand-orange",
  accepted: "bg-emerald-100 text-emerald-700",
  "in-progress": "bg-sky-100 text-sky-700",
  completed: "bg-emerald-100 text-emerald-700",
};

// Action buttons shown for a booking, derived from its status. Kept as a
// function so it can be made dynamic later (e.g. driven by technician job
// state returned from the API).
function getBookingActions(status: BookingStatus) {
  switch (status) {
    case "requested":
      return ["Accept", "Reject"] as const;
    case "accepted":
      return ["Start Repair"] as const;
    case "in-progress":
      return ["Mark Completed"] as const;
    default:
      return [] as const;
  }
}

// Stubbed action handler — wire up to the real API when ready.
const handleBookingAction = (action: string, bookingId: string) => {
  console.log(`[stub] ${action} on booking ${bookingId}`);
};

const TechnicianPage = () => {
  return (
    <div className="space-y-6 w-full min-w-0 mb-20">
      <DashboardBreadcrumb
        items={[{ label: "Technician" }, { label: "Overview" }]}
        badge="Technician"
      />

      <h1 className="text-2xl font-bold text-brand-navy">
        Technician Overview
      </h1>


      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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


      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Booking Requests</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-48 pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Final amount</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b last:border-0"
                >
                  <td className="py-3">
                    <p className="font-medium text-brand-navy">
                      {booking.customer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.phone}
                    </p>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {booking.service}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {booking.date}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[booking.status]}`}
                    >
                      {statusLabels[booking.status]}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-brand-navy">
                    {booking.finalAmount ?? "—"}
                  </td>
                  <td className="py-3 text-right">
                    {getBookingActions(booking.status).length > 0 ? (
                      <div className="flex justify-end gap-2">
                        {getBookingActions(booking.status).map((action) => (
                          <Button
                            key={action}
                            size="sm"
                            variant={
                              action === "Reject" ? "outline" : "default"
                            }
                            onClick={() =>
                              handleBookingAction(action, booking.id)
                            }
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Awaiting payment
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>


      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {servicePerformance.map((item) => (
              <div key={item.service}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-brand-navy">{item.service}</span>
                  <span className="font-medium">{item.jobs} Jobs</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-orange"
                    style={{ width: `${(item.jobs / 14) * 100}%` }}
                  />
                </div>
              </div>
            ))}
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
                {myServices.map((service) => (
                  <tr key={service.service} className="border-b last:border-0">
                    <td className="py-3 text-muted-foreground">
                      {service.service}
                    </td>
                    <td className="py-3 text-right font-medium text-brand-navy">
                      {service.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianPage;
