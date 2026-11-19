"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Booking } from "@/lib/api/bookings";
import { paymentBadge, statusBadge } from "@/lib/booking-status";
import BookingActionCell, {
  BadgePill,
} from "@/components/bookings/BookingActionCell";
import CancelBookingDialog from "@/components/bookings/CancelBookingDialog";

// ---------------------------------------------------------------------------
// RecentBookings — the "My Bookings" card on the customer Overview.
//
// Extracted into a client component because the Overview page itself is a
// server component and server components cannot attach onClick handlers.
// Badges and action rules come from @/lib/booking-status so this table is
// always labelled identically to the My Bookings page.
// ---------------------------------------------------------------------------

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentBookings({ bookings }: { bookings: Booking[] }) {
  const [query, setQuery] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const router = useRouter();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookings;

    return bookings.filter((b) =>
      [b.serviceTitle, b.technicianName, b.category]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [bookings, query]);

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>My Bookings</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-48 pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          {rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {bookings.length === 0
                ? "No bookings yet. Request a repair to get started."
                : "No bookings match your search."}
            </p>
          ) : (
            <Table className="min-w-[820px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium text-brand-navy">
                      {booking.serviceTitle}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {booking.technicianName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(booking.preferredDate)}
                    </TableCell>
                    <TableCell>
                      <BadgePill badge={statusBadge(booking.status)} />
                    </TableCell>
                    <TableCell>
                      <BadgePill badge={paymentBadge(booking.paymentStatus)} />
                    </TableCell>
                    <TableCell className="font-medium text-brand-navy">
                      $
                      {(booking.finalAmount ?? booking.basePrice ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <BookingActionCell
                        booking={booking}
                        onCancel={setCancelTarget}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CancelBookingDialog
        booking={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onCancelled={() => router.refresh()}
      />
    </>
  );
}
