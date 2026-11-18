"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, User, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Session = typeof authClient.$Infer.Session;

export default function ProfileDropdown({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!session?.user) return null;

  const user = session.user;
  const initial = user.name?.trim().charAt(0).toUpperCase() || "U";
  const isTechnician = user.role === "technician";
  const roleLabel = isTechnician ? "Technician" : "Customer";

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="relative">
      {/* Profile trigger */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-full p-1 transition hover:bg-slate-100"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-orange text-lg font-bold text-brand-navy ring-2 ring-brand-orange ring-offset-2 ring-offset-brand-navy">
          {initial}
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-3 w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-white/10 bg-brand-navy shadow-2xl shadow-slate-900/25">
            {/* Header */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-orange text-lg font-bold text-brand-navy">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-md font-bold text-white">
                    {user.name}
                  </h3>
                  <p className="  truncate text-[10px] text-slate-300">
                    {user.email}
                  </p>
                 <span className="my-1 inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-brand-orange">
                {roleLabel}
              </span>
                </div>
              </div>
              
               
            </div>

            {/* Menu */}
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 transition hover:bg-white/5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <LayoutDashboard className="size-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">Dashboard</p>
                  <p className="mt-0.5 text-xs text-slate-300">
                    Go to customer dashboard
                  </p>
                </div>
              </Link>

              <div className="mx-4 border-t border-white/10" />

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 transition hover:bg-white/5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <User className="size-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">
                    Update Profile
                  </p>
                </div>
              </Link>

              <div className="mx-4 border-t border-white/10" />

              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-4 py-2 text-left transition hover:bg-white/5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <LogOut className="size-5 text-red-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-red-400">Sign Out</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Securely leave your account
                  </p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}