"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BadgePill } from "@/components/bookings/BookingActionCell";
import TechnicianActionCell, {
  type TechnicianAction,
} from "@/components/bookings/TechnicianActionCell";
import TechnicianActionDialog from "@/components/bookings/TechnicianActionDialog";
import { statusBadge } from "@/lib/booking-status";
import type { Booking } from "@/lib/api/bookings";

// ---------------------------------------------------------------------------
// OverviewBookings
//
// The "Booking Requests" table on the Technician Overview page. Rendered as a
// client component so each row's action buttons can open the shared
// TechnicianActionDialog and PATCH the booking status, then router.refresh()
// to re-render the server component with fresh data.
// ---------------------------------------------------------------------------

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OverviewBookings({
  bookings,
  technicianEmail,
}: {
  bookings: Booking[];
  technicianEmail: string;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    booking: Booking;
    action: TechnicianAction;
  } | null>(null);

  function openAction(booking: Booking, action: TechnicianAction) {
    setBusyId(booking._id);
    setActionTarget({ booking, action });
  }

  function closeAction() {
    setBusyId(null);
    setActionTarget(null);
  }

  return (
    <>
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
            <tr key={booking._id} className="border-b last:border-0">
              <td className="py-3">
                <p className="font-medium text-brand-navy">
                  {booking.customerName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.customerPhone}
                </p>
              </td>
              <td className="py-3 text-muted-foreground">
                {booking.serviceTitle}
              </td>
              <td className="py-3 text-muted-foreground">
                {formatDate(booking.preferredDate)}
              </td>
              <td className="py-3">
                <BadgePill badge={statusBadge(booking.status)} />
              </td>
              <td className="py-3 font-medium text-brand-navy">
                $
                {(booking.finalAmount ?? booking.basePrice ?? 0).toLocaleString()}
              </td>
              <td className="py-3 text-right">
                {booking.status === "completed" ? (
                  <span className="text-xs text-muted-foreground">
                    Awaiting payment
                  </span>
                ) : (
                  <TechnicianActionCell
                    booking={booking}
                    busy={busyId === booking._id}
                    onAction={(b, a) => openAction(b, a)}
                  />
                )}
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <TechnicianActionDialog
        booking={actionTarget?.booking ?? null}
        action={actionTarget?.action ?? null}
        technicianEmail={technicianEmail}
        onClose={closeAction}
        onConfirmed={() => {
          closeAction();
          router.refresh();
        }}
      />
    </>
  );
}
