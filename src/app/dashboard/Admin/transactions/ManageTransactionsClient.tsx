"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Lock, Download, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BadgePill } from "@/components/bookings/BookingActionCell";

interface Payment {
  _id: string;
  bookingId: string;
  customerName?: string;
  customerEmail: string;
  serviceTitle: string;
  technicianName?: string;
  technicianEmail?: string;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId?: string;
  paymentMethod?: {
    brand: string;
    last4: string;
  };
  receiptUrl?: string;
  jobStatus?: string;
  completedAt?: string;
  createdAt: string;
  paidAt?: string;
}

const PAGE_SIZE = 8;

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  failed: { label: "Failed", className: "bg-red-100 text-red-600" },
  refunded: { label: "Refunded", className: "bg-slate-100 text-slate-600" },
};

export default function ManageTransactionsClient({
  initialPayments,
}: {
  initialPayments: Payment[];
}) {
  const [payments, setPayments] = useState(initialPayments);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Sync state when server data updates
  useEffect(() => {
    setPayments(initialPayments);
  }, [initialPayments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payments.filter((p) => {
      if (!q) return true;
      return [
        p.serviceTitle,
        p.customerName,
        p.customerEmail,
        p.technicianName,
        p.technicianEmail,
        p.stripePaymentIntentId,
      ]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q));
    });
  }, [payments, query]);

  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  function formatMoney(amount: number) {
    return `$${amount.toLocaleString()}`;
  }

  function formatDate(value?: string) {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function shortId(id?: string) {
    if (!id) return "—";
    return id.length > 14 ? `${id.slice(0, 13)}…` : id;
  }

  function formatPaymentMethod(method?: { brand: string; last4: string }) {
    if (!method) return "—";
    return `${method.brand.toUpperCase()} •••• ${method.last4}`;
  }

  const summary = useMemo(() => {
    const paid = payments.filter((p) => p.status === "paid");
    const totalSpent = paid.reduce((sum, p) => sum + (p.amount || 0), 0);
    return {
      totalSpent,
      paidJobs: paid.length,
      averagePayment: paid.length > 0 ? Math.round(totalSpent / paid.length) : 0,
    };
  }, [payments]);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Total revenue</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">
            {formatMoney(summary.totalSpent)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            From {summary.paidJobs} successful payments
          </p>
        </Card>

        <Card className="rounded-xl p-5">
          <p className="text-sm text-muted-foreground">This month</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">
            ${summary.totalSpent.toLocaleString()}
          </p>
        </Card>

        <Card className="rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Average payment</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">
            ${summary.averagePayment.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Table header and search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-brand-navy">All payments</h2>
          <span className="text-sm text-muted-foreground">Last 90 days</span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search transactions..."
            className="h-9 rounded-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Payments table */}
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50 text-left text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Technician</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">Payment date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-xs text-muted-foreground"
                    >
                      No transactions match your filter.
                    </td>
                  </tr>
                ) : (
                  visible.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/30">
                      <td className="px-6 py-4">
                        {p.customerName || p.customerEmail}
                      </td>
                      <td className="px-6 py-4">
                        {p.technicianName || p.technicianEmail}
                      </td>
                      <td className="px-6 py-4 font-semibold text-brand-navy">
                        {p.serviceTitle}
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-navy">
                        {formatMoney(p.amount)}
                      </td>
                      <td className="px-6 py-4">
                        {shortId(p.stripePaymentIntentId)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(p.paidAt || p.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <BadgePill badge={STATUS_BADGES[p.status] ?? STATUS_BADGES.pending} />
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => window.open(p.receiptUrl, "_blank", "noopener,noreferrer")}
                        >
                          <Download className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} payments
            </p>
            <div className="flex gap-2">
              <button
                disabled={safePage === 1}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="size-3.5" /> Previous
              </button>
              <button
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                Next <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}