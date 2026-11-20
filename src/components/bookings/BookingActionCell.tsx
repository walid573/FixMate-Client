"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { bookingAction, type Badge } from "@/lib/booking-status";
import type { Booking } from "@/lib/api/bookings";

// ---------------------------------------------------------------------------
// Badge pill used for the status / payment / "Paid" indicators.
// ---------------------------------------------------------------------------
export function BadgePill({ badge }: { badge: Badge }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// BookingActionCell
//
// The one place the customer-facing booking actions are rendered, shared by
// the Overview table and the My Bookings page:
//
//   requested           -> Cancel button   (opens the confirmation modal)
//   completed + unpaid  -> Pay Now         (Stripe is out of scope: toast)
//   completed + paid    -> "Paid" badge INSTEAD of a button
//   rejected / cancelled-> real Link to /services
//   accepted / in-progress -> muted text, not clickable
//   anything else       -> nothing (no dead buttons)
// ---------------------------------------------------------------------------
interface BookingActionCellProps {
  booking: Booking;
  /** Opens the shared confirmation modal. */
  onCancel: (booking: Booking) => void;
}

export default function BookingActionCell({
  booking,
  onCancel,
}: BookingActionCellProps) {
  const pushToast = useToast();
  const action = bookingAction(booking);

  if (!action) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  switch (action.kind) {
    case "paid":
      return <BadgePill badge={{ label: "Paid", className: "bg-emerald-100 text-emerald-700" }} />;

    case "cancel":
      return (
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => onCancel(booking)}
        >
          Cancel
        </Button>
      );

    case "pay":
      return (
        <Button
          size="sm"
          className="bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/90"
          onClick={() => pushToast("Stripe checkout is not wired up yet.", "info")}
        >
          Pay Now
        </Button>
      );

    case "rebook":
      return (
        <Button size="sm" variant="outline" render={<Link href="/services" />}>
          {action.label}
        </Button>
      );

    default:
      // Informational status (Awaiting technician / Working on it).
      return (
        <span className="text-xs font-medium text-muted-foreground">
          {action.label}
        </span>
      );
  }
}