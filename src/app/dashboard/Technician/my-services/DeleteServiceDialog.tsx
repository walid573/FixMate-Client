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
import type { Service } from "@/lib/api/services";

// ---------------------------------------------------------------------------
// DeleteServiceDialog
//
// Confirmation modal shown before a service is removed. Deleting is
// permanent, so the technician has to confirm explicitly — the same pattern
// used by the customer cancel-booking dialog.
//
//   service    — the service to delete; null keeps the dialog closed
//   onClose    — clears the selection
//   onDelete   — performs the API call; resolves when the server accepted,
//                rejects with an error message that is shown as a toast
// ---------------------------------------------------------------------------
interface DeleteServiceDialogProps {
  service: Service | null;
  onClose: () => void;
  onDelete: (service: Service) => Promise<void>;
}

export default function DeleteServiceDialog({
  service,
  onClose,
  onDelete,
}: DeleteServiceDialogProps) {
  const [busy, setBusy] = useState(false);
  const pushToast = useToast();

  async function handleConfirm() {
    if (!service || busy) return;

    setBusy(true);
    try {
      await onDelete(service);
      onClose();
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : "Failed to delete the service.",
        "error"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={Boolean(service)}
      onOpenChange={(open) => {
        // Ignore dismissal while the request is in flight.
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this service?</DialogTitle>
          <DialogDescription>
            {service
              ? `${service.title} will be permanently removed. Customers will no longer be able to find or book it. This cannot be undone.`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Keep service
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={busy}>
            {busy ? "Deleting…" : "Yes, delete service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
