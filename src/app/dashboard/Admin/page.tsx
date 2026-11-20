import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgePill } from "@/components/bookings/BookingActionCell";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Simplified auth check for demo/mock purposes.
  // if (session?.user?.role !== "admin") {
  //   redirect("/");
  // }

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[{ label: "Admin" }, { label: "Overview" }]}
        badge="Admin"
      />

      <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
        Admin Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Users" value="1,284" />
        <StatCard title="Technicians" value="96" />
        <StatCard title="Services" value="212" />
        <StatCard title="Total Bookings" value="3,420" />
        <StatCard title="Stripe Revenue" value="৳6.8L" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Services Awaiting Approval</CardTitle>
          <Input className="w-64" placeholder="Search..." />
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="pb-3">Service</th>
                <th className="pb-3">Technician</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4">Fridge Compressor Check</td>
                <td className="py-4">Sajid Karim</td>
                <td className="py-4">Refrigerator</td>
                <td className="py-4">৳2,000</td>
                <td className="py-4">
                  <BadgePill badge={{ label: "Pending", className: "bg-amber-100 text-amber-700" }} />
                </td>
                <td className="py-4 space-x-2">
                  <Button size="sm" className="bg-brand-orange text-brand-navy">Approve</Button>
                  <Button size="sm" variant="outline" className="text-red-500">Reject</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Manage Users</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Aminul Karim</span>
                <BadgePill badge={{ label: "Customer", className: "bg-blue-100 text-blue-700" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>#1042</span>
                <span>৳2,800</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>All Bookings</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th>Service</th>
                <th>Customer</th>
                <th>Technician</th>
                <th>Status</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">AC Gas Refill</td>
                <td className="py-3">Aminul Karim</td>
                <td className="py-3">Tanvir Ahmed</td>
                <td className="py-3">
                  <BadgePill badge={{ label: "In Progress", className: "bg-sky-100 text-sky-700" }} />
                </td>
                <td className="py-3">Unpaid</td>
                <td className="py-3"><Button variant="ghost">View</Button></td>
              </tr>
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