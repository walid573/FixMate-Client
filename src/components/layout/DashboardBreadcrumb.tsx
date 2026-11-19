import Link from "next/link";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  /** Omit for the current page (rendered as bold, non-clickable). */
  href?: string;
}

interface DashboardBreadcrumbProps {
  /** Trail from the dashboard root to the current page. */
  items: Crumb[];
  /** Navy pill on the right — the signed-in role, e.g. "Customer". */
  badge?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Page-level breadcrumb used across the dashboard:
//   Customer / My Bookings                      [ Customer ]
// Parent crumbs are muted links, the current page is bold, and an optional
// navy role badge sits on the far right.
// ---------------------------------------------------------------------------
export default function DashboardBreadcrumb({
  items,
  badge,
  className,
}: DashboardBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className
      )}
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 ? (
                <span aria-hidden="true" className="text-muted-foreground/70">
                  /
                </span>
              ) : null}

              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    isLast
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {badge ? (
        <span className="inline-flex items-center rounded-full bg-brand-navy px-4 py-1.5 text-xs font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </nav>
  );
}
