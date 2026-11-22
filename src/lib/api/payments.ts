

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface PaymentMethod {
  brand: string;
  last4: string;
}

export interface Payment {
  _id: string;
  bookingId: string;
  customerName?: string;
  customerEmail: string;
  serviceTitle: string;
  technicianName?: string;
  technicianEmail?: string;

  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  stripePaymentIntentId?: string;
  receiptUrl?: string;
  jobStatus?: string;
  createdAt: string;
  paidAt?: string;
}

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

export interface CreateCheckoutSessionResult {
  url: string;
}

export async function createCheckoutSession(bookingId: string): Promise<CreateCheckoutSessionResult> {
  const res = await fetch("/api/payments/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };

  if (!res.ok || !data.url) {
    throw new Error(data.error || "Could not start checkout.");
  }

  return { url: data.url };
}


export interface VerifyPaymentResult {
  paid: boolean;
  alreadyPaid?: boolean;
  amount?: number;
  transactionId?: string;
  serviceTitle?: string;
  receiptUrl?: string;
}

export async function verifyCheckoutSession(
  sessionId: string
): Promise<VerifyPaymentResult> {
  const res = await fetch(
    `/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`
  );

  const data = (await res.json().catch(() => ({}))) as VerifyPaymentResult & {
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || "Could not verify payment.");
  }

  return data;
}
