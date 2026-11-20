// ---------------------------------------------------------------------------
// Payments API client.
//
// GET /payments?email=... returns a JSON array of Payment, newest first.
//
// The backend currently DERIVES payment records from the bookings collection
// (there is no `payments` collection until Stripe is wired up).
// `stripePaymentIntentId` and `paymentMethod` come back as MOCK values, but
// ONLY for bookings that are actually paid — a pending payment has no card or
// PaymentIntent yet, so those fields are undefined and the table renders "—".
// `receiptUrl` stays empty until Stripe can issue real receipts. The shape is
// already correct, so swapping the server over to real Stripe data needs no
// client changes.
//
// On any failure we return [] so the page degrades to a clean empty state
// instead of crashing (same pattern as getBookings).
// ---------------------------------------------------------------------------

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface PaymentMethod {
  /** Card brand as shown on the receipt, e.g. "visa". */
  brand: string;
  /** Last 4 digits, e.g. "4242". */
  last4: string;
}

export interface Payment {
  _id: string;
  /** Booking this payment settles. */
  bookingId: string;
  customerName?: string;
  customerEmail: string;
  serviceTitle: string;
  technicianName?: string;
  technicianEmail?: string;
  /** Amount in the charging currency (USD). */
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  /** Stripe PaymentIntent id, e.g. "pi_3P...". Empty until charged. */
  stripePaymentIntentId?: string;
  /** Stripe receipt / invoice URL for the Receipt button. */
  receiptUrl?: string;
  /**
   * Status of the underlying booking (requested / accepted / in-progress /
   * completed). Used to decide whether a payment is genuinely "due" — a job
   * only becomes payable once it is completed.
   */
  jobStatus?: string;
  /** When the booking was completed (drives "Payment due" copy). */
  completedAt?: string;
  createdAt: string;
  paidAt?: string;
}

// ---------------------------------------------------------------------------
// Derived summary shown in the stat row.
//
// "Awaiting payment" only counts jobs that are COMPLETED but still unpaid —
// a booking that is only requested or in progress is not payable yet, so it
// must not appear in the Payment due banner or the awaiting total.
// ---------------------------------------------------------------------------
export interface PaymentSummary {
  totalSpent: number;
  paidJobs: number;
  awaitingAmount: number;
  awaitingCount: number;
}

export function summarize(payments: Payment[]): PaymentSummary {
  const paid = payments.filter((p) => p.status === "paid");
  const awaiting = payments.filter(
    (p) => p.status === "pending" && p.jobStatus === "completed"
  );

  return {
    totalSpent: paid.reduce((sum, p) => sum + (p.amount || 0), 0),
    paidJobs: paid.length,
    awaitingAmount: awaiting.reduce((sum, p) => sum + (p.amount || 0), 0),
    awaitingCount: awaiting.length,
  };
}

// ---------------------------------------------------------------------------
// Fetch payments for a customer (server-side).
// ---------------------------------------------------------------------------
export const getPayments = async (email: string): Promise<Payment[]> => {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/payments?email=${encodeURIComponent(email)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch payments");
    }

    const payments: Payment[] = await res.json();
    return Array.isArray(payments) ? payments : [];
  } catch (error) {
    // Route not implemented yet (404) or backend down — render empty state.
    console.error("Failed to fetch payments:", error);
    return [];
  }
};
