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
import { Booking } from "@/lib/api/bookings";

interface PayRepairDialogProps {
  booking: Booking | null;
  onClose: () => void;
  onPaid: () => void;
}

export default function PayRepairDialog({
  booking,
  onClose,
  onPaid,
}: PayRepairDialogProps) {
  const [busy, setBusy] = useState(false);
  const pushToast = useToast();

  if (!booking) return null;

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay for your repair</DialogTitle>
          <DialogDescription>
            Service: {booking.serviceTitle}
            <br />
            Technician: {booking.technicianName}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setBusy(true);
              // Simulate Stripe payment - in production would create a Checkout session
              setTimeout(() => {
                pushToast(
                  "Payment of $" +
                    booking.finalAmount.toLocaleString() +
                    " processed successfully. FixMate never sees your card details.",
                  "success"
                );
                setBusy(false);
                onPaid();
              }, 1500);
            }}
            disabled={busy}
            className="bg-brand-orange text-brand-navy hover:bg-brand-orange/90"
          >
            {busy ? "Processing…" : "Pay $2,800 with Stripe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}