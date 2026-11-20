"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgePill } from "@/components/bookings/BookingActionCell";
import { useToast } from "@/lib/toast";
import { updateApprovalStatus, type Service } from "@/lib/api/services";

// ---------------------------------------------------------------------------
// PendingServicesCard (Admin Overview)
//
// "Services Awaiting Approval" with REAL pending services and WORKING
// Approve / Reject buttons — PATCH /services/:id/approval, then
// router.refresh() so the server component refetches the fresh list.
// The dead mock search box was dropped; full search lives on
// /dashboard/admin/services.
// ---------------------------------------------------------------------------

export default function PendingServicesCard({
  services,
  totalPending,
}: {
  /** Already filtered to "pending", newest first, capped by the page. */
  services: Service[];
  /** Full pending count (the card may only show the first few). */
  totalPending: number;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();
  const pushToast = useToast();

  async function decide(
    service: Service,
    status: "approved" | "rejected"
  ) {
    if (busyId) return;
    setBusyId(service._id);
    try {
      await updateApprovalStatus(service._id, status);
      pushToast(`${service.title} ${status}.`, "success");
      router.refresh();
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : "Failed to update the service.",
        "error"
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>
          Services Awaiting Approval
          {totalPending > 0 ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({totalPending})
            </span>
          ) : null}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          render={<Link href="/dashboard/admin/services" />}
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
              <th className="pb-3">Technician</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 text-center text-sm text-muted-foreground"
                >
                  All caught up — nothing awaiting approval.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service._id} className="border-b last:border-0">
                  <td className="py-4 font-medium">{service.title}</td>
                  <td className="py-4">{service.technicianName}</td>
                  <td className="py-4">{service.category}</td>
                  <td className="py-4">
                    ${service.basePrice.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <BadgePill
                      badge={{
                        label: "Pending",
                        className: "bg-amber-100 text-amber-700",
                      }}
                    />
                  </td>
                  <td className="space-x-2 py-4 text-right whitespace-nowrap">
                    <Button
                      size="sm"
                      disabled={busyId === service._id}
                      onClick={() => decide(service, "approved")}
                      className="bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/90"
                    >
                      {busyId === service._id ? "Working…" : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === service._id}
                      onClick={() => decide(service, "rejected")}
                      className="text-red-500"
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
