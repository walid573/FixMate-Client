"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { cancelBooking, type Booking } from "@/lib/api/bookings";

// ---------------------------------------------------------------------------
// CancelBookingDialog
//
// Confirmation modal shown before a booking is cancelled. Shared by the
// customer Overview and the My Bookings page so the cancel flow exists once.
//
//   booking      — the booking to cancel; null keeps the dialog closed
//   onClose      — clears the selection (back to the list)
//   onCancelled  — called after the server accepted the change; the caller
//                  does router.refresh() so the server-rendered list refetches
//                  while tab / search state is preserved.
// ---------------------------------------------------------------------------
interface CancelBookingDialogProps {
  booking: Booking | null;
  onClose: () => void;
  onCancelled: () => void;
}

export default function CancelBookingDialog({
  booking,
  onClose,
  onCancelled,
}: CancelBookingDialogProps) {
  const [busy, setBusy] = useState(false);
  const pushToast = useToast();

  async function handleConfirm() {
    if (!booking || busy) return;

    setBusy(true);
    try {
      await cancelBooking(booking._id, booking.customerEmail);
      pushToast(`${booking.serviceTitle} cancelled.`, "success");
      onCancelled();
      onClose();
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : "Failed to cancel the booking.",
        "error"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={Boolean(booking)}
      onOpenChange={(open) => {
        // Ignore dismissal while the request is in flight.
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogDescription>
            {booking
              ? `${booking.serviceTitle} with ${booking.technicianName} will be cancelled. This cannot be undone.`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Keep booking
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={busy}>
            {busy ? "Cancelling…" : "Yes, cancel booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
