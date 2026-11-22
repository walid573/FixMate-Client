"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/nav";
import { cn } from "@/lib/utils";

// The hook must live in its own component so the Suspense boundary below can
// actually defer it. Calling usePathname() at the top of DesktopNav itself
// would still run during prerender, outside any Suspense boundary.
function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-8">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-md text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange",
                isActive ? "text-white" : "text-white/70 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function DesktopNav() {
  return (
    <nav aria-label="Main">
      <Suspense fallback={<div className="h-5 w-48" aria-hidden="true" />}>
        <NavLinks />
      </Suspense>
    </nav>
  );
}