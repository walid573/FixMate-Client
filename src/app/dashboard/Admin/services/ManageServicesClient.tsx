"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { BadgePill } from "@/components/bookings/BookingActionCell";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { updateApprovalStatus } from "@/lib/api/services";
import { useRouter } from "next/navigation";

interface Service {
  _id: string;
  title: string;
  category: string;
  technicianName: string;
  technicianEmail: string;
  basePrice: number;
  createdAt: string;
  approvalStatus: "pending" | "approved" | "rejected";
  serviceMode: string;
}

const PAGE_SIZE = 5;

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-600" },
};

export default function ManageServicesClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);

  // Sync with fresh data when the server pushes a new list
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);
  const [tab, setTab] = useState<string>("pending");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const pushToast = useToast();
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      const matchesTab = tab === "all" ? true : s.approvalStatus === tab;
      if (!matchesTab) return false;
      if (!q) return true;
      return [s.title, s.technicianName, s.technicianEmail]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q));
    });
  }, [services, tab, query]);

  const counts = useMemo(() => {
    const c = (status: string) => services.filter((s) => s.approvalStatus === status).length;
    return {
      all: services.length,
      pending: c("pending"),
      approved: c("approved"),
      rejected: c("rejected"),
    };
  }, [services]);

  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  async function handleReview(service: Service, status: "approved" | "rejected") {
    if (busyId) return;
    setBusyId(service._id);
    try {
      await updateApprovalStatus(service._id, status);
      setServices((prev) =>
        prev.map((s) =>
          s._id === service._id ? { ...s, approvalStatus: status } : s
        )
      );
      pushToast(
        `${service.title} ${status === "approved" ? "approved" : "rejected"}.`,
        "success"
      );
      router.refresh();
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : "Failed to update approval status.",
        "error"
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="border-brand-orange/20 bg-brand-peach/20 text-brand-orange-ink">
        <Info className="size-4" />
        <AlertDescription className="text-xs">
          <strong>{counts.pending} services are waiting for review.</strong> Approved services go live on the public Services page.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "pending", label: "Pending", count: counts.pending },
            { key: "approved", label: "Approved", count: counts.approved },
            { key: "rejected", label: "Rejected", count: counts.rejected },
            { key: "all", label: "All", count: counts.all },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setPage(1); }}
              className={cn("rounded-full px-4 py-1.5 text-xs font-medium transition-colors", tab === t.key ? "bg-brand-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              {t.label} <span className="ml-1 opacity-60">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search services..." className="h-9 rounded-full pl-9 text-xs" />
        </div>
      </div>

      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50">
              <tr className="border-b text-left text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Technician</th>
                <th className="px-6 py-3">Base Price</th>
                <th className="px-6 py-3">Submitted</th>
                <th className="px-6 py-3">Approval</th>
                <th className="px-6 py-3">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/30">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-brand-navy">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.category} • {s.serviceMode}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-navy">{s.technicianName}</p>
                    <p className="text-xs text-slate-400">{s.technicianEmail}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-navy">${s.basePrice}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(s.createdAt)}</td>
                  <td className="px-6 py-4"><BadgePill badge={STATUS_BADGES[s.approvalStatus] ?? STATUS_BADGES.pending} /></td>
                  <td className="px-6 py-4 space-x-2">
                    {s.approvalStatus === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          disabled={busyId === s._id}
                          className="bg-brand-orange text-brand-navy hover:bg-brand-orange/90"
                          onClick={() => handleReview(s, "approved")}
                        >
                          {busyId === s._id ? "Working…" : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === s._id}
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReview(s, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    ) : <span className="text-xs text-slate-400 italic">Reviewed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}