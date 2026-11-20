"use client";

import { useMemo, useState } from "react";
import { Search, Info, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import { BadgePill } from "@/components/bookings/BookingActionCell";
import { useUpdateUserRole } from "@/hooks/use-update-user-role";
import { useToast } from "@/lib/toast";

// ---------------------------------------------------------------------------
// ManageUsersClient
// ---------------------------------------------------------------------------

interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
  createdAt: string;
}

const PAGE_SIZE = 6;

const ROLE_BADGES: Record<string, { label: string; className: string }> = {
  customer: { label: "Customer", className: "bg-brand-navy text-white" },
  technician: { label: "Technician", className: "bg-blue-50 text-blue-600" },
  admin: { label: "Admin", className: "bg-purple-50 text-purple-600" },
};

export default function ManageUsersClient({
  initialUsers,
  currentUserEmail,
}: {
  initialUsers: User[];
  currentUserEmail: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [tab, setTab] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pushToast = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesTab = tab === "all" ? true : u.role === tab;
      if (!matchesTab) return false;
      if (!q) return true;
      return [u.name, u.email]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q));
    });
  }, [users, tab, query]);

  const counts = useMemo(() => {
    const c = (role: string) => users.filter((u) => u.role === role).length;
    return {
      all: users.length,
      customer: c("customer"),
      technician: c("technician"),
      admin: c("admin"),
    };
  }, [users]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  async function handleRoleChange(userId: string, nextRole: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/role`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      }
    );
    if (!res.ok) throw new Error("Failed to update role");
    pushToast(`Role updated to ${nextRole}.`, "success");
  } catch (err) {
    pushToast("Failed to update role.", "error");
  }
}

  function formatDate(value: string) {
    const d = new Date(value);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      <Alert className="border-brand-orange/20 bg-brand-peach/20 text-brand-orange-ink">
        <Info className="size-4" />
        <AlertDescription className="text-xs">
          Role changes apply immediately. You cannot change your own role.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All", count: counts.all },
            { key: "customer", label: "Customers", count: counts.customer },
            { key: "technician", label: "Technicians", count: counts.technician },
            { key: "admin", label: "Admins", count: counts.admin },
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
              {t.label} <span className="ml-1 opacity-60">{t.count.toLocaleString()}</span>
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
            placeholder="Search by name or email"
            className="h-9 rounded-full pl-9 text-xs"
          />
        </div>
      </div>

      <Card className="overflow-hidden rounded-xl border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50 text-left text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3">Change role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((user) => {
                  const isSelf = user.email === currentUserEmail;
                  return (
                    <tr key={user._id} className="hover:bg-slate-50/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-peach font-bold text-brand-navy">
                            {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-brand-navy">{user.name}</span>
                            {isSelf && (
                              <span className="rounded-full bg-brand-navy px-2 py-0.5 text-[10px] font-bold text-white">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{user.email}</td>
                      <td className="px-6 py-4 text-slate-500 uppercase">
                        <BadgePill badge={ROLE_BADGES[user.role] ?? ROLE_BADGES.customer} />
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <NativeSelect
                            size="sm"
                            disabled={isSelf}
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="h-8 w-32 rounded-md text-xs"
                          >
                            <NativeSelectOption value="customer">Customer</NativeSelectOption>
                            <NativeSelectOption value="technician">Technician</NativeSelectOption>
                            <NativeSelectOption value="admin">Admin</NativeSelectOption>
                          </NativeSelect>
                          {isSelf && (
                            <div className="flex items-center gap-1 text-[10px] leading-tight text-slate-400">
                              <Lock className="size-3 shrink-0" />
                              <span>You cannot change your<br/>own role</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} users
            </p>
            <div className="flex gap-2">
              <button
                disabled={safePage === 1}
                onClick={() => setPage(p => p - 1)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="size-3.5" /> Previous
              </button>
              <button
                disabled={safePage === totalPages}
                onClick={() => setPage(p => p + 1)}
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