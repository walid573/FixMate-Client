import React from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { stats, bookings } from "./mock-data";

// ---------------------------------------------------------------------------
// Action button helper based on status / payment
// ---------------------------------------------------------------------------
function getBookingAction(status: string, payment: string) {
  if (status === "completed" && payment === "unpaid") {
    return { label: "Pay Now", variant: "default" as const };
  }
  if (status === "in-progress") {
    return { label: "View", variant: "outline" as const };
  }
  if (status === "completed" && payment === "paid") {
    return { label: "Receipt", variant: "outline" as const };
  }
  if (status === "requested") {
    return { label: "Cancel", variant: "outline" as const, destructive: true };
  }
  return { label: "View", variant: "outline" as const };
}

// Stubbed handler — leave for user implementation
// const handleActionClick = (bookingId: string, actionLabel: string) => {
//   console.log(`[stub] ${actionLabel} clicked for booking ${bookingId}`);
// };

const CustomerPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
        Customer Overview
      </h1>

      {/* Stats row */}
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

      {/* Active Tracking Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-navy">
              Tracking: AC Gas Refill & Servicing
            </h3>
            <span className="text-xs font-medium text-muted-foreground">
              Technician: Tanvir Ahmed
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="grid grid-cols-4 gap-2">
              <div className="h-2 rounded-full bg-brand-orange" />
              <div className="h-2 rounded-full bg-brand-orange" />
              <div className="h-2 rounded-full bg-brand-orange" />
              <div className="h-2 rounded-full bg-slate-200" />
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
              <span className="text-brand-navy font-semibold">Requested</span>
              <span className="text-brand-navy font-semibold">Accepted</span>
              <span className="text-brand-navy font-semibold">In Progress</span>
              <span>Completed</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Pay Now appears once the technician marks the job Completed.
          </p>
        </CardContent>
      </Card>

      {/* My Bookings */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>My Bookings</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="w-48 pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="pb-3">Service</th>
                <th className="pb-3">Technician</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const action = getBookingAction(booking.status, booking.payment);
                return (
                  <tr key={booking.id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-brand-navy">
                      {booking.service}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {booking.technician}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {booking.date}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          booking.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : booking.status === "in-progress"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-brand-orange/10 text-brand-orange"
                        }`}
                      >
                        {booking.status === "completed"
                          ? "Completed"
                          : booking.status === "in-progress"
                          ? "In Progress"
                          : "Requested"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          booking.payment === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-brand-orange/10 text-brand-orange"
                        }`}
                      >
                        {booking.payment === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-brand-navy">
                      {booking.amount}
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        variant={action.variant}
                        className={
                          action.destructive
                            ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                            : action.variant === "default"
                            ? "bg-brand-orange text-brand-navy hover:bg-brand-orange/90 font-semibold"
                            : ""
                        }
                        // onClick={() => handleActionClick(booking.id, action.label)}
                      >
                        {action.label}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPage;
