// ---------------------------------------------------------------------------
// TechnicianActionCell
//
// The action buttons shown on the technician Manage Requests page:
//   requested            -> Accept + Reject
//   accepted             -> Start Work
//   in-progress          -> Mark Completed
//   completed / rejected / cancelled -> "—" (terminal states)
//
// Status actions PATCH the same route the customer cancel flow uses
// (`PATCH /bookings/:id/status`), with `technicianEmail` as the ownership
// key. The route enforces the transition ladder, so a completed job can
// never be un-completed.
// ---------------------------------------------------------------------------

import { Button } from "@/components/ui/button";
import type { Booking } from "@/lib/api/bookings";

export interface TechnicianAction {
  label: string;
  /** Target status the route will be asked to move the booking to. */
  targetStatus: "accepted" | "in-progress" | "completed" | "rejected";
}

/**
 * The set of actions the technician may take on a booking right now.
 * Returns an empty list for terminal states — nothing dead is rendered.
 */
export function technicianActions(booking: {
  status?: string;
}): TechnicianAction[] {
  switch (booking.status) {
    case "requested":
      return [
        { label: "Accept", targetStatus: "accepted" },
        { label: "Reject", targetStatus: "rejected" },
      ];
    case "accepted":
      return [{ label: "Start Work", targetStatus: "in-progress" }];
    case "in-progress":
      return [{ label: "Mark Completed", targetStatus: "completed" }];
    case "completed":
    case "rejected":
    case "cancelled":
    default:
      // Terminal states — the payment badge is shown instead of any action.
      return [];
  }
}

interface TechnicianActionCellProps {
  booking: Booking;
  busy: boolean;
  onAction: (booking: Booking, action: TechnicianAction) => void;
}

export default function TechnicianActionCell({
  booking,
  busy,
  onAction,
}: TechnicianActionCellProps) {
  const actions = technicianActions(booking);

  if (actions.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {actions.map((action) => (
        <Button
          key={action.label}
          size="sm"
          disabled={busy}
          className={
            action.targetStatus === "rejected"
              ? "border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
              : "bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/90"
          }
          variant={action.targetStatus === "rejected" ? "outline" : "default"}
          onClick={() => onAction(booking, action)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}