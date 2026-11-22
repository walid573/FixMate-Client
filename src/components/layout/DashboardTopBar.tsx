"use client";

import Link from "next/link";
import { Home } from "lucide-react";

import { useSessionClient } from "@/lib/Session/client";

export function DashboardTopBar() {
  const { data: session } = useSessionClient();
  const user = session?.user;
  const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="flex flex-1 items-center justify-end gap-3">
      <Link
        href="/"
        className="hidden items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-brand-orange-ink sm:flex"
      >
        <Home className="size-4" aria-hidden="true" />
        Back to Home
      </Link>

      <div className="flex items-center gap-2.5 border-l pl-3">
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            className="size-8 rounded-full object-cover ring-2 ring-slate-200"
          />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
            {initial}
          </span>
        )}

        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-semibold text-brand-navy">
            {user?.name || "User"}
          </p>
          <p className="text-[11px] text-slate-500">{user?.email || ""}</p>
        </div>
      </div>
    </div>
  );
}
