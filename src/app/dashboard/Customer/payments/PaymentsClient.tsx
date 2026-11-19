"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Lock,
  Download,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import { useToast } from "@/lib/toast";
import {
  summarize,
  type Payment,
  type PaymentStatus,
} from "@/lib/api/payments";

const PAGE_SIZE = 6;

const RANGES = [
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 12 months" },
  { value: "all", label: "All time" },
] as const;

const statusStyles: Record<PaymentStatus, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-600",
  refunded: "bg-slate-100 text-slate-600",
};

const statusLabels: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

function formatMoney(amount: number) {
  return `$${amount.toLocaleString()}`;
}

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

// "p1_IqV9.a1f2" style id — shortened for the table column.
function shortId(id?: string) {
  if (!id) return "—";
  return id.length > 14 ? `${id.slice(0, 13)}…` : id;
}

// ---------------------------------------------------------------------------
// PaymentsClient
// ---------------------------------------------------------------------------
export default function PaymentsClient({ payments }: { payments: Payment[] }) {
  const [range, setRange] = useState<string>("90");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Captured once so the range filter stays stable across re-renders
  // (react-hooks/purity forbids calling Date.now() directly during render).
  const [now] = useState(() => Date.now());

  const pushToast = useToast();

  const summary = useMemo(() => summarize(payments), [payments]);

  // Time range filter. Paid rows are filtered by their PAYMENT date;
  // unpaid rows have no paidAt yet, so they fall back to the booking date.
  const inRange = useMemo(() => {
    if (range === "all") return payments;
    const cutoff = now - Number(range) * 24 * 60 * 60 * 1000;
    return payments.filter(
      (p) => new Date(p.paidAt ?? p.createdAt).getTime() >= cutoff
    );
  }, [payments, range, now]);

  // Text search across service, technician, amount and transaction id
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inRange;

    return inRange.filter((p) =>
      [p.serviceTitle, p.technicianName, p.stripePaymentIntentId]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [inRange, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // The next COMPLETED-but-unpaid booking — drives the "Payment due" banner.
  // Jobs that are still requested / in progress are not payable yet.
  const duePayment = payments.find(
    (p) => p.status === "pending" && p.jobStatus === "completed"
  );

  // ---- stubbed handlers: wire to Stripe when the backend route exists ----
  function handlePayNow() {
    pushToast("Stripe checkout coming soon.", "info");
  }

  function handleReceipt(payment: Payment) {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, "_blank", "noopener,noreferrer");
      return;
    }
    pushToast("Receipt not available yet.", "info");
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
          Payment History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every payment you have made, with receipts.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Total spent</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">
            {formatMoney(summary.totalSpent)}
          </p>
        </Card>

        <Card className="rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Paid jobs</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">
            {summary.paidJobs}
          </p>
        </Card>

        <Card className="rounded-xl border-brand-orange/40 bg-brand-peach/60 p-5">
          <p className="text-sm text-muted-foreground">Awaiting payment</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">
            {formatMoney(summary.awaitingAmount)}
          </p>
          <p className="mt-1 text-xs font-medium text-brand-orange-ink">
            {summary.awaitingCount} job{summary.awaitingCount === 1 ? "" : "s"}{" "}
            ready to pay
          </p>
        </Card>
      </div>

    
      {duePayment ? (
        <Card className="rounded-xl border-l-4 border-l-brand-orange p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-peach text-brand-orange-ink">
                <Lock className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-brand-navy">
                  Payment due · {duePayment.serviceTitle}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {duePayment.completedAt
                    ? `Completed ${formatDate(duePayment.completedAt)}`
                    : "Job completed"}{" "}
                  by {duePayment.technicianName}. Pay securely with Stripe.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-brand-navy">
                {formatMoney(duePayment.amount)}
              </span>
              <Button
                onClick={handlePayNow}
                className="gap-2 bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/90"
              >
                <Lock className="size-4" />
                Pay Now
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Transactions */}
      <Card className="rounded-xl">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Transactions</CardTitle>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <NativeSelect
              size="sm"
              value={range}
              onChange={(e) => {
                setRange(e.target.value);
                setPage(1);
              }}
              aria-label="Date range"
            >
              {RANGES.map((r) => (
                <NativeSelectOption key={r.value} value={r.value}>
                  {r.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>

            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search payments"
                className="h-8 pl-8"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {visible.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {payments.length === 0
                ? "No payments yet. Your receipts will appear here."
                : "No payments match your search."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Technician</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3">Transaction ID</th>
                    <th className="pb-3">Payment date</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((payment) => (
                    <tr key={payment._id} className="border-b last:border-0">
                      <td className="py-3.5 pr-4 font-semibold text-brand-navy">
                        {payment.serviceTitle}
                      </td>

                      <td className="py-3.5 pr-4 text-muted-foreground">
                        {payment.technicianName}
                      </td>

                      <td className="py-3.5 text-right font-semibold text-brand-navy">
                        {formatMoney(payment.amount)}
                      </td>

                      <td className="py-3.5 font-mono text-xs text-muted-foreground">
                        {shortId(payment.stripePaymentIntentId)}
                      </td>

                      {/* paidAt — "—" until the payment actually settles */}
                      <td className="py-3.5 whitespace-nowrap text-muted-foreground">
                        {formatDate(payment.paidAt)}
                      </td>

                      <td className="py-3.5">
                        {payment.paymentMethod ? (
                          <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <span className="rounded bg-brand-navy px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                              {payment.paymentMethod.brand}
                            </span>
                            •••• {payment.paymentMethod.last4}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CreditCard className="size-3.5" />
                            —
                          </span>
                        )}
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusStyles[payment.status] ?? statusStyles.pending
                          }`}
                        >
                          {statusLabels[payment.status] ?? payment.status}
                        </span>
                      </td>

                      <td className="py-3.5 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => handleReceipt(payment)}
                        >
                          <Download className="size-3.5" />
                          Receipt
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination footer */}
          {filtered.length > 0 ? (
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} payment{filtered.length === 1 ? "" : "s"}
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
