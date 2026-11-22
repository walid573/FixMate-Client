import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/toast";
import {
  updateBookingStatus,
  type Booking,
} from "@/lib/api/bookings";
import { technicianActions, type TechnicianAction } from "@/components/bookings/TechnicianActionCell";

interface TechnicianActionDialogProps {
  booking: Booking | null;
  action: TechnicianAction | null;
  technicianEmail: string;
  onClose: () => void;
  onConfirmed: () => void;
}

export default function TechnicianActionDialog({
  booking,
  action,
  technicianEmail,
  onClose,
  onConfirmed,
}: TechnicianActionDialogProps) {
  const [busy, setBusy] = useState(false);
  const [finalAmount, setFinalAmount] = useState<string>("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const pushToast = useToast();

  const open = Boolean(booking) && Boolean(action);

  // Prefill the amount every time the dialog opens. (This used to run only
  // on first mount, so it could carry a stale or empty value.)
  // A 0 / missing finalAmount falls back to the base price so the technician
  // never starts from an invalid value.
  useEffect(() => {
    if (booking && action?.targetStatus === "completed") {
      const current = Number(booking.finalAmount);
      const fallback = Number(booking.basePrice);
      setFinalAmount(
        String(
          Number.isFinite(current) && current > 0
            ? current
            : Number.isFinite(fallback) && fallback > 0
            ? fallback
            : ""
        )
      );
      setAmountError(null);
    }
  }, [booking, action]);

  // Client-side guard so a $0 / empty / garbage amount never even reaches
  // the server (the server rejects it again anyway — belt and braces).
  function validateAmount(): string | null {
    if (finalAmount.trim() === "") return "Enter a final amount.";
    const value = Number(finalAmount);
    if (!Number.isFinite(value)) return "Enter a valid number.";
    if (value <= 0) return "Final amount must be greater than $0.";
    return null;
  }

  async function handleConfirm() {
    if (!booking || !action || busy) return;

    const needsAmount = action.targetStatus === "completed";
    if (needsAmount) {
      const problem = validateAmount();
      if (problem) {
        setAmountError(problem);
        return;
      }
    }

    setBusy(true);
    try {
      await updateBookingStatus(
        booking._id,
        technicianEmail,
        action.targetStatus,
        action.targetStatus === "completed" ? Number(finalAmount) : undefined
      );
      pushToast(
        `${booking.serviceTitle} moved to ${action.targetStatus}.`,
        "success"
      );
      onConfirmed();
      onClose();
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : "Failed to update the booking.",
        "error"
      );
    } finally {
      setBusy(false);
    }
  }

  function heading() {
    if (!action) return { title: "", description: "" };
    switch (action.targetStatus) {
      case "accepted":
        return {
          title: "Accept this request?",
          description: `${booking?.serviceTitle} will move from Requested to Accepted.`,
        };
      case "rejected":
        return {
          title: "Decline this request?",
          description: `${booking?.serviceTitle} will be marked Rejected and the customer will be notified.`,
        };
      case "in-progress":
        return {
          title: "Start working on this repair?",
          description: `${booking?.serviceTitle} will move from Accepted to In Progress.`,
        };
      case "completed":
        return {
          title: "Mark this job completed?",
          description: `Enter the final amount for ${booking?.serviceTitle}.`,
        };
      default:
        return { title: action.label, description: "" };
    }
  }

  const { title, description } = heading();
  const isReject = action?.targetStatus === "rejected";
  const isCompleted = action?.targetStatus === "completed";

  function formatDate(value?: string) {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) onClose();
      }}
    >
      <DialogContent>
        {isCompleted && (
          <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="size-5" />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>
            {isCompleted ? "Mark as completed" : title}
          </DialogTitle>
          <DialogDescription>
            {isCompleted ? "Enter the final amount for this job." : description}
          </DialogDescription>
        </DialogHeader>

        {isCompleted && (
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3 text-xs">
              <p className="font-semibold text-brand-navy">
                {booking?.serviceTitle}
              </p>
              <p className="mt-0.5 text-muted-foreground">
                {booking?.customerName} • {formatDate(booking?.createdAt)}
              </p>
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-brand-navy">
                Final amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={finalAmount}
                  onChange={(e) => {
                    setFinalAmount(e.target.value);
                    if (amountError) setAmountError(null);
                  }}
                  className="pl-7"
                  placeholder="1500"
                  aria-invalid={Boolean(amountError)}
                />
              </div>
              {amountError ? (
                <p className="text-[11px] font-medium text-red-500">
                  {amountError}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Pre-filled with the base price. Must be greater than $0.
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="mt-2 gap-2">
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant={isReject ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={busy}
            className={
              !isReject
                ? "bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/90"
                : ""
            }
          >
            {busy
              ? "Updating…"
              : isCompleted
              ? "Mark completed"
              : action?.label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { technicianActions };