"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Wrench,
  CheckCircle2,
  Clock,
  Banknote,
  MapPin,
  CalendarDays,
  User,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import type { Booking } from "@/lib/api/bookings";
import { isCancelled, paymentBadge, statusBadge } from "@/lib/booking-status";
import BookingActionCell, { BadgePill } from "@/components/bookings/BookingActionCell";
import CancelBookingDialog from "@/components/bookings/CancelBookingDialog";
import PayRepairDialog from "./PayRepairDialog";

// ---------------------------------------------------------------------------
// My Bookings (customer)
//
// Spec:
//   - TABLE on desktop, CARDS on mobile
//   - service image & title, technician, preferred date, base price / final
//     amount, status badge (Requested / Accepted / In Progress / Completed /
//     Rejected / Cancelled) and a separate payment badge (Unpaid / Paid)
//   - Cancel only when status === "requested", behind a confirmation modal
//   - Pay Now only when completed + unpaid; a paid booking shows a Paid badge
// ---------------------------------------------------------------------------

const STEPS = ["Requested", "Accepted", "In Progress", "Completed", "Paid"] as const;

type TabKey = "all" | "requested" | "active" | "completed" | "cancelled";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const ACTIVE_STATUSES = ["accepted", "in-progress"];

function stepIndex(booking: Booking): number {
  switch (booking.status) {
    case "requested":
      return 0;
    case "accepted":
      return 1;
    case "in-progress":
      return 2;
    case "completed":
      return booking.paymentStatus === "paid" ? 4 : 3;
    default:
      return 0;
  }
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

// ---------------------------------------------------------------------------
// Base price / final amount. When the technician quoted a different final
// amount the base price is shown struck through above it.
// ---------------------------------------------------------------------------
function Amount({ booking }: { booking: Booking }) {
  const base = booking.basePrice ?? 0;
  const final = booking.finalAmount ?? base;
  const adjusted =
    typeof booking.finalAmount === "number" && booking.finalAmount !== base;

  return (
    <span className="inline-flex flex-col leading-tight">
      {adjusted ? (
        <span className="text-xs text-muted-foreground line-through">
          ${base.toLocaleString()}
        </span>
      ) : null}
      <span className="font-semibold text-brand-navy">
        ${final.toLocaleString()}
      </span>
    </span>
  );
}

// Service thumbnail with a wrench fallback when no image was stored.
function ServiceThumb({
  booking,
  className,
}: {
  booking: Booking;
  className?: string;
}) {
  if (booking.serviceImage) {
    return (
      // Service images come from the API host, so plain <img> (as used on the
      // services pages) instead of next/image, which would need domain config.
      <img
        src={booking.serviceImage}
        alt=""
        className={cn("shrink-0 rounded-lg object-cover", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-brand-orange/15 text-brand-orange",
        className
      )}
    >
      <Wrench className="size-5" />
    </span>
  );
}

function ProgressStepper({ current }: { current: number }) {
  // current < 0 (cancelled / rejected) -> nothing filled in.
  const pct = Math.max(0, Math.min(1, current / (STEPS.length - 1))) * 100;

  return (
    <div className="w-full">
      <div className="relative flex items-start justify-between">
        {/* connecting line */}
        <div className="absolute top-3.5 right-0 left-0 h-0.5 bg-slate-200" />
        <div
          className="absolute top-3.5 left-0 h-0.5 bg-brand-orange transition-all"
          style={{ width: `${pct}%` }}
        />
        {STEPS.map((step, i) => {
          const done = i <= current;
          return (
            <div
              key={step}
              className="relative z-10 flex w-1/5 flex-col items-center gap-1.5"
            >
              <span
                className={`flex size-7 items-center justify-center rounded-full text-[11px] font-semibold ring-4 ring-white ${
                  done
                    ? "bg-brand-orange text-brand-navy"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? <CheckCircle2 className="size-4" /> : i + 1}
              </span>
              <span
                className={`text-center text-[10px] leading-tight sm:text-[11px] ${
                  done ? "font-semibold text-brand-navy" : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function useStats(bookings: Booking[]) {
  return useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status)).length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const awaiting = bookings.filter(
      (b) => b.status === "completed" && b.paymentStatus === "unpaid"
    ).length;
    return [
      { label: "Total Bookings", value: String(total), icon: Wrench },
      { label: "Active Bookings", value: String(active), icon: Clock },
      { label: "Completed", value: String(completed), icon: CheckCircle2 },
      { label: "Awaiting payment", value: String(awaiting), icon: Banknote },
    ];
  }, [bookings]);
}

// ---------------------------------------------------------------------------
// Booking card — rendered below md only.
// ---------------------------------------------------------------------------
function BookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (b: Booking) => void;
}) {
  const cancelled = isCancelled(booking.status);

  return (
    <Card className="rounded-xl md:hidden">
      <CardContent className="space-y-5 p-5">
        {cancelled ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {booking.status === "rejected"
                ? "This request was declined by the technician."
                : "This booking was cancelled."}
            </p>
            <BookingActionCell booking={booking} onCancel={onCancel} />
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ServiceThumb booking={booking} className="size-11" />
            <div>
              <h3 className="text-sm font-bold text-brand-navy sm:text-base">
                {booking.serviceTitle}
              </h3>
              <p className="text-xs text-muted-foreground">{booking.category}</p>
            </div>
          </div>

          {/* Status badge + payment badge, kept separate per spec */}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <BadgePill badge={statusBadge(booking.status)} />
            <BadgePill badge={paymentBadge(booking.paymentStatus)} />
          </div>
        </div>

        <ProgressStepper current={cancelled ? -1 : stepIndex(booking)} />

        <div className="grid gap-3 border-t border-slate-100 pt-4 text-xs text-muted-foreground sm:grid-cols-2">
          <span className="flex items-center gap-2">
            <User className="size-3.5 text-brand-orange" />
            {booking.technicianName}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-3.5 text-brand-orange" />
            {booking.address || "—"}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays className="size-3.5 text-brand-orange" />
            {formatDate(booking.preferredDate)}
          </span>
          <span className="flex items-center justify-between gap-2 sm:justify-start">
            <Amount booking={booking} />
          </span>
        </div>

        {!cancelled ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-muted-foreground">
              Booking ID: {booking._id}
            </p>
            <BookingActionCell booking={booking} onCancel={onCancel} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// BookingsClient
// ---------------------------------------------------------------------------
export default function BookingsClient({ bookings }: { bookings: Booking[] }) {
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const router = useRouter();

  const stats = useStats(bookings);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesTab =
        tab === "all"
          ? true
          : tab === "active"
            ? ACTIVE_STATUSES.includes(b.status)
            : tab === "cancelled"
              ? isCancelled(b.status)
              : b.status === tab;

      if (!matchesTab) return false;
      if (!q) return true;

      return [b.serviceTitle, b.technicianName, b.category, b.address]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    });
  }, [bookings, tab, query]);

  const counts = useMemo(() => {
    return {
      all: bookings.length,
      requested: bookings.filter((b) => b.status === "requested").length,
      active: bookings.filter((b) => ACTIVE_STATUSES.includes(b.status)).length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => isCancelled(b.status)).length,
    };
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <stat.icon className="size-4 text-brand-orange" />
            </div>
            <p className="mt-2 text-2xl font-bold text-brand-navy">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-navy text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
                <span
                  className={`ml-1.5 text-xs ${
                    active ? "text-white/70" : "text-slate-400"
                  }`}
                >
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bookings..."
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {bookings.length === 0
              ? "No bookings yet. Request a repair to get started."
              : "No bookings match your search."}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop: table */}
          <Card className="hidden rounded-xl md:block">
            <CardContent className="p-0">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Preferred date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ServiceThumb booking={booking} className="size-10" />
                          <div className="min-w-0">
                            <p className="font-semibold text-brand-navy">
                              {booking.serviceTitle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {booking.technicianName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(booking.preferredDate)}
                      </TableCell>
                      <TableCell>
                        <Amount booking={booking} />
                      </TableCell>
                      <TableCell>
                        <BadgePill badge={statusBadge(booking.status)} />
                      </TableCell>
                      <TableCell>
                        <BadgePill badge={paymentBadge(booking.paymentStatus)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <BookingActionCell
                          booking={booking}
                          onCancel={setCancelTarget}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mobile: cards */}
          <div className="space-y-4 md:hidden">
            {filtered.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={setCancelTarget}
              />
            ))}
          </div>
        </>
      )}

      <CancelBookingDialog
        booking={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onCancelled={() => router.refresh()}
      />
    </div>
  );
}
