// ---------------------------------------------------------------------------
// Shared booking display rules.
//
// Used by BOTH the customer Overview table and the My Bookings page so a
// booking is labelled identically in the two places it appears.
//
// Spec (customer dashboard):
//   status badge : Requested / Accepted / In Progress / Completed /
//                  Rejected / Cancelled
//   payment badge: Unpaid / Paid
//   Cancel       : ONLY while status === "requested", behind a confirmation
//                  modal that PATCHes the booking to "cancelled"
//   Pay Now      : ONLY when completed + unpaid (Stripe itself is out of scope)
//   Paid         : shows a badge INSTEAD of a button
// ---------------------------------------------------------------------------

export interface Badge {
  label: string;
  className: string;
}

// Brand tokens only — no local hex values.
// One shared palette for EVERY dashboard (admin / customer / technician).
// Requested = blue, Accepted = indigo, In Progress = amber,
// Completed = green, Rejected = red, Cancelled = gray.
const STATUS_META: Record<string, Badge> = {
  requested: { label: "Requested", className: "bg-blue-100 text-blue-700" },
  accepted: { label: "Accepted", className: "bg-indigo-100 text-indigo-700" },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700",
  },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-600" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600" },
};

/** Unknown / missing statuses fall back to "Requested". */
export function statusBadge(status?: string): Badge {
  return (status && STATUS_META[status]) || STATUS_META.requested;
}

export function paymentBadge(payment?: string): Badge {
  return payment === "paid"
    ? { label: "Paid", className: "bg-emerald-100 text-emerald-700" }
    : { label: "Unpaid", className: "bg-brand-orange/10 text-brand-orange-ink" };
}

export function isCancelled(status?: string): boolean {
  return status === "cancelled" || status === "rejected";
}

export type ActionKind = "cancel" | "pay" | "paid" | "rebook" | "status";

export interface BookingAction {
  label: string;
  kind: ActionKind;
}

// ---------------------------------------------------------------------------
// The complete set of actions a customer may see on a booking.
// Returns null when there is nothing to act on (nothing dead is rendered).
// ---------------------------------------------------------------------------
export function bookingAction(booking: {
  status?: string;
  paymentStatus?: string;
}): BookingAction | null {
  const { status, paymentStatus } = booking;

  if (status === "completed") {
    return paymentStatus === "paid"
      ? { label: "Paid", kind: "paid" }
      : { label: "Pay Now", kind: "pay" };
  }

  if (status === "requested") return { label: "Cancel", kind: "cancel" };

  if (isCancelled(status)) {
    return { label: "Find another technician", kind: "rebook" };
  }

  // Informational only — never a button, so no dead clicks.
  if (status === "accepted") return { label: "Awaiting technician", kind: "status" };
  if (status === "in-progress") return { label: "Working on it", kind: "status" };

  return null;
}
