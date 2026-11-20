"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { statusBadge } from "@/lib/booking-status";
import { BadgePill } from "@/components/bookings/BookingActionCell";
import TechnicianActionCell, {
  type TechnicianAction,
} from "@/components/bookings/TechnicianActionCell";
import TechnicianActionDialog from "@/components/bookings/TechnicianActionDialog";

// ---------------------------------------------------------------------------
// BookingRequestsClient
// ---------------------------------------------------------------------------

type TabKey = "all" | "requested" | "accepted" | "in-progress" | "completed";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BookingRequestsClient({
  bookings,
  technicianEmail,
}: {
  bookings: Booking[];
  technicianEmail: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    booking: Booking;
    action: TechnicianAction;
  } | null>(null);

  function openAction(booking: Booking, action: TechnicianAction) {
    setBusyId(booking._id);
    setActionTarget({ booking, action });
  }

  function closeAction() {
    setBusyId(null);
    setActionTarget(null);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesTab = tab === "all" ? true : b.status === tab;
      if (!matchesTab) return false;
      if (!q) return true;
      return [b.customerName, b.serviceTitle]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q));
    });
  }, [bookings, tab, query]);

  const counts = useMemo(() => {
    const c = (status: string) => bookings.filter((b) => b.status === status).length;
    return {
      all: bookings.length,
      requested: c("requested"),
      accepted: c("accepted"),
      "in-progress": c("in-progress"),
      completed: c("completed"),
    };
  }, [bookings]);

  const newRequests = counts.requested;

  return (
    <div className="space-y-6">
      {newRequests > 0 && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-800">
          <Info className="size-4 text-amber-600" />
          <AlertDescription>
            <strong>{newRequests} new requests</strong> are waiting for your response.
          </AlertDescription>
        </Alert>
      )}

      <Card className="rounded-xl">
        <div className="flex flex-col gap-4 border-b p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    tab === t.key
                      ? "bg-brand-navy text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {t.label}
                  <span className="ml-1.5 opacity-70">({counts[t.key]})</span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customer or service"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service & Problem</TableHead>
                    <TableHead>Date & Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 items-center justify-center rounded-full bg-brand-orange/10 font-bold text-brand-navy">
                            {booking.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                          <div>
                            <p className="font-semibold text-brand-navy">
                              {booking.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.customerPhone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-brand-navy">
                          {booking.serviceTitle}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {booking.problemDescription}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{formatDate(booking.preferredDate)}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {booking.address}
                        </p>
                      </TableCell>
                      <TableCell>
                        <BadgePill badge={statusBadge(booking.status)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <TechnicianActionCell
                          booking={booking}
                          busy={busyId === booking._id}
                          onAction={(b, a) => openAction(b, a)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <TechnicianActionDialog
        booking={actionTarget?.booking ?? null}
        action={actionTarget?.action ?? null}
        technicianEmail={technicianEmail}
        onClose={closeAction}
        onConfirmed={() => {
          closeAction();
          router.refresh();
        }}
      />
    </div>
  );
}
