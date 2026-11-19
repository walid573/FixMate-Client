"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Pencil,
  Trash2,
  Wrench,
  Info,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/lib/toast";
import {
  deleteService,
  updateService,
  type Service,
} from "@/lib/api/services";
import DeleteServiceDialog from "./DeleteServiceDialog";

// ---------------------------------------------------------------------------
// My Services (technician)
//
// Shows THIS technician's services with the four summary stats, a search
// box, an approval / availability table and edit / delete actions.
//
//   - Availability toggle  -> PATCH /services { availableForBooking }
//                             (approval status untouched)
//   - Edit                 -> /dashboard/technician/edit-service/:id
//                             saving there resets the service to Pending
//   - Delete               -> DELETE /services/:id?technicianId=...
//                             behind a confirmation modal
//
// Data arrives as props from the server component, then lives in local state
// so toggles and deletes feel instant; props are re-synced whenever the
// server renders again (e.g. coming back from the edit page).
// ---------------------------------------------------------------------------

const PAGE_SIZE = 6;

type ApprovalStatus = "approved" | "pending" | "rejected" | string;

const APPROVAL_META: Record<string, { label: string; className: string }> = {
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-600" },
};

function approvalMeta(status?: ApprovalStatus) {
  return APPROVAL_META[status ?? ""] ?? APPROVAL_META.pending;
}

// The one-line hint shown under the service title.
function subtitleFor(service: Service): string {
  if (service.approvalStatus === "rejected") {
    return "Edit and resubmit for approval";
  }
  if (service.approvalStatus === "pending") {
    return "Awaiting admin review";
  }
  if (!isAvailable(service)) {
    return "Hidden while unavailable";
  }
  return "Live on public pages";
}

function isAvailable(service: Service): boolean {
  if (typeof service.availableForBooking === "boolean") {
    return service.availableForBooking;
  }
  if (typeof service.isAvailable === "boolean") {
    return service.isAvailable;
  }
  return true;
}

function formatPrice(value?: number) {
  const price = Number(value ?? 0);
  return `$${Number.isFinite(price) ? price.toLocaleString() : "0"}`;
}

// Page buttons: everything when short, 1 … current … last when long.
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const wanted = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...wanted]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out: (number | "…")[] = [];
  let previous = 0;

  for (const page of sorted) {
    if (page - previous > 1) out.push("…");
    out.push(page);
    previous = page;
  }

  return out;
}

// Service thumbnail with a wrench fallback when no image was stored.
function ServiceThumb({ service }: { service: Service }) {
  if (service.image) {
    return (
      // Service images come from external hosts, so plain <img> (as used on
      // the public services pages) instead of next/image.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={service.image}
        alt=""
        className="size-10 shrink-0 rounded-lg object-cover"
      />
    );
  }

  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange/15 text-brand-orange">
      <Wrench className="size-5" />
    </span>
  );
}

function ApprovalBadge({ status }: { status?: string }) {
  const meta = approvalMeta(status);
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.className}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

function AvailabilityControl({
  service,
  disabled,
  onToggle,
}: {
  service: Service;
  disabled: boolean;
  onToggle: (service: Service, next: boolean) => void;
}) {
  const available = isAvailable(service);

  return (
    <div className="flex items-center gap-2.5">
      <Switch
        checked={available}
        disabled={disabled}
        onCheckedChange={(next) => onToggle(service, next)}
        aria-label={`Toggle availability for ${service.title}`}
      />
      <span
        className={cn(
          "text-xs font-medium",
          available ? "text-brand-navy" : "text-muted-foreground"
        )}
      >
        {available ? "Available" : "Unavailable"}
      </span>
    </div>
  );
}

function RowActions({
  service,
  onDelete,
}: {
  service: Service;
  onDelete: (service: Service) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        className="size-8 p-0"
        render={
          <Link
            href={`/dashboard/technician/edit-service/${service._id}`}
          />
        }
        aria-label={`Edit ${service.title}`}
      >
        <Pencil className="size-3.5" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="size-8 border-red-200 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
        onClick={() => onDelete(service)}
        aria-label={`Delete ${service.title}`}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MyServicesClient
// ---------------------------------------------------------------------------
interface MyServicesClientProps {
  services: Service[];
  technicianId: string;
}

export default function MyServicesClient({
  services,
  technicianId,
}: MyServicesClientProps) {
  const [items, setItems] = useState<Service[]>(services);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const pushToast = useToast();

  // `items` is seeded from props on mount. Navigating away (edit page) and
  // back remounts this segment, so the list always restarts from the fresh
  // server data — no prop-syncing effect needed.

  // Stats always reflect ALL of this technician's services.
  const stats = useMemo(() => {
    const count = (status: string) =>
      items.filter((s) => s.approvalStatus === status).length;

    return [
      { label: "Total services", value: items.length, accent: false },
      { label: "Approved", value: count("approved"), accent: false },
      { label: "Pending review", value: count("pending"), accent: false },
      { label: "Rejected", value: count("rejected"), accent: true },
    ];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((s) =>
      [s.title, s.category, s.description, s.technicianName]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // ---------------------------------------------------------------------
  // Availability toggle — optimistic, rolls back if the server says no.
  // ---------------------------------------------------------------------
  async function handleToggle(service: Service, next: boolean) {
    if (busyId) return;

    const previous = isAvailable(service);
    setBusyId(service._id);
    setItems((prev) =>
      prev.map((s) =>
        s._id === service._id
          ? { ...s, availableForBooking: next, isAvailable: next }
          : s
      )
    );

    try {
      await updateService(service._id, technicianId, {
        availableForBooking: next,
      });
      pushToast(
        `${service.title} is now ${next ? "available" : "unavailable"} for booking.`,
        "success"
      );
    } catch (err) {
      setItems((prev) =>
        prev.map((s) =>
          s._id === service._id
            ? {
                ...s,
                availableForBooking: previous,
                isAvailable: previous,
              }
            : s
        )
      );
      pushToast(
        err instanceof Error
          ? err.message
          : "Failed to update availability.",
        "error"
      );
    } finally {
      setBusyId(null);
    }
  }

  // ---------------------------------------------------------------------
  // Delete — called by the confirmation dialog, which owns the busy state.
  // ---------------------------------------------------------------------
  async function handleDelete(service: Service) {
    await deleteService(service._id, technicianId);
    setItems((prev) => prev.filter((s) => s._id !== service._id));
    pushToast(`${service.title} deleted.`, "success");
  }

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-xl p-4">
            <p className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p
              className={cn(
                "mt-2 text-2xl font-bold",
                stat.accent ? "text-red-600" : "text-brand-navy"
              )}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Rules banner from the mock */}
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <Info className="size-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          Editing a service sends it back to <strong>Pending</strong> until an
          admin approves it again. Only <strong>Approved</strong> and{" "}
          <strong>Available</strong> services appear to customers.
        </AlertDescription>
      </Alert>

      {/* All services */}
      <Card className="rounded-xl">
        <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-brand-navy">
            All services
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search services..."
              className="pl-9"
            />
          </div>
        </div>

        <CardContent className="p-0">
          {items.length === 0 ? (
            // Nothing published yet
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                <Wrench className="size-6" />
              </span>
              <div>
                <p className="font-semibold text-brand-navy">
                  You haven&apos;t added any services yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Publish your first repair service — it goes live after admin
                  approval.
                </p>
              </div>
              <Button
                render={
                  <Link href="/dashboard/technician/add-service" />
                }
                className="mt-1 bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/90"
              >
                <Plus className="size-4" />
                Add New Service
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="px-6 py-14 text-center text-sm text-muted-foreground">
              No services match your search.
            </p>
          ) : (
            <>
              {/* Desktop: table */}
              <div className="hidden md:block">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Approval</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visible.map((service) => (
                      <TableRow key={service._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ServiceThumb service={service} />
                            <div className="min-w-0">
                              <p className="font-semibold text-brand-navy">
                                {service.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {subtitleFor(service)}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {service.category}
                        </TableCell>

                        <TableCell className="font-semibold text-brand-navy">
                          {formatPrice(service.basePrice)}
                        </TableCell>

                        <TableCell>
                          <ApprovalBadge status={service.approvalStatus} />
                        </TableCell>

                        <TableCell>
                          <AvailabilityControl
                            service={service}
                            disabled={busyId === service._id}
                            onToggle={handleToggle}
                          />
                        </TableCell>

                        <TableCell>
                          <RowActions
                            service={service}
                            onDelete={setDeleteTarget}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: cards */}
              <div className="space-y-4 p-4 md:hidden">
                {visible.map((service) => (
                  <Card key={service._id} className="rounded-xl p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <ServiceThumb service={service} />
                          <div className="min-w-0">
                            <p className="font-semibold text-brand-navy">
                              {service.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {subtitleFor(service)}
                            </p>
                          </div>
                        </div>
                        <ApprovalBadge status={service.approvalStatus} />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-muted-foreground">
                        <span>{service.category}</span>
                        <span className="font-semibold text-brand-navy">
                          {formatPrice(service.basePrice)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                        <AvailabilityControl
                          service={service}
                          disabled={busyId === service._id}
                          onToggle={handleToggle}
                        />
                        <RowActions
                          service={service}
                          onDelete={setDeleteTarget}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Footer: count + pagination */}
              <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {visible.length} of {filtered.length} services
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="size-3.5" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {pageList(safePage, totalPages).map((entry, i) =>
                      entry === "…" ? (
                        <span
                          key={`gap-${i}`}
                          className="px-1 text-sm text-muted-foreground"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={entry}
                          type="button"
                          onClick={() => setPage(entry)}
                          className={`size-8 rounded-md text-sm font-medium transition-colors ${
                            entry === safePage
                              ? "bg-brand-navy text-white"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {entry}
                        </button>
                      )
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={safePage >= totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Next
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <DeleteServiceDialog
        service={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}
