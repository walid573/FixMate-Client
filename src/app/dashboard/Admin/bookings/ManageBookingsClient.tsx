"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { BadgePill } from "@/components/bookings/BookingActionCell";
import { statusBadge, paymentBadge } from "@/lib/booking-status";

interface BookingItem {
  _id: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  preferredDate: string;
  status: string;
  paymentStatus: string;
  basePrice: number;
  finalAmount?: number;
  createdAt: string;
}

const PAGE_SIZE = 8;

export default function ManageBookingsClient({
  initialBookings,
}: {
  initialBookings: BookingItem[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [tab, setTab] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Sync state when server data updates
  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesTab = tab === "all" ? true : b.status === tab;
      if (!matchesTab) return false;
      if (!q) return true;
      return [
        b.serviceTitle,
        b.customerName,
        b.customerEmail,
        b.technicianName,
        b.technicianEmail,
      ]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q));
    });
  }, [bookings, tab, query]);

  const counts = useMemo(() => {
    const c = (status: string) =>
      bookings.filter((b) => b.status === status).length;
    return {
      all: bookings.length,
      requested: c("requested"),
      accepted: c("accepted"),
      "in-progress": c("in-progress"),
      completed: c("completed"),
      rejected: c("rejected"),
      cancelled: c("cancelled"),
    };
  }, [bookings]);

  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  function formatDate(value: string) {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatAmount(booking: BookingItem) {
    const amount = booking.finalAmount ?? booking.basePrice ?? 0;
    return `$${amount.toLocaleString()}`;
  }

  return (
    <div className="space-y-6">
      {/* Read-only info alert */}
      <Alert className="border-slate-200 bg-slate-50 text-slate-700">
        <Lock className="size-4 shrink-0 text-slate-500" />
        <AlertDescription className="text-xs font-medium">
          Read only. Admins can view bookings but not change them.
        </AlertDescription>
      </Alert>

      {/* Tabs and search bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All", count: counts.all },
            { key: "requested", label: "Requested", count: counts.requested },
            { key: "accepted", label: "Accepted", count: counts.accepted },
            { key: "in-progress", label: "In Progress", count: counts["in-progress"] },
            { key: "completed", label: "Completed", count: counts.completed },
            { key: "rejected", label: "Rejected", count: counts.rejected },
            { key: "cancelled", label: "Cancelled", count: counts.cancelled },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                tab === t.key
                  ? "bg-brand-navy text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {t.label}{" "}
              <span className="ml-1 opacity-60">
                {t.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search bookings..."
            className="h-9 rounded-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Bookings table */}
      <Card className="overflow-hidden rounded-xl border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50 text-left text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Technician</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-xs text-muted-foreground"
                    >
                      No bookings match your filter.
                    </td>
                  </tr>
                ) : (
                  visible.map((b) => {
                    const isTerminalCancelled =
                      b.status === "rejected" || b.status === "cancelled";
                    return (
                      <tr key={b._id} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4 font-semibold text-brand-navy">
                          {b.serviceTitle}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {b.customerName || b.customerEmail}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {b.technicianName || b.technicianEmail}
                        </td>
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                          {formatDate(b.preferredDate || b.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <BadgePill badge={statusBadge(b.status)} />
                        </td>
                        <td className="px-6 py-4">
                          {isTerminalCancelled ? (
                            <span className="text-xs text-slate-400">—</span>
                          ) : (
                            <BadgePill badge={paymentBadge(b.paymentStatus)} />
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-brand-navy whitespace-nowrap">
                          {formatAmount(b)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              {filtered.length === 0
                ? 0
                : (safePage - 1) * PAGE_SIZE + 1}
              –{Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length.toLocaleString()} bookings
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