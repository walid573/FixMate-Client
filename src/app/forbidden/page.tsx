import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

// Shown when a signed-in user has no valid role, or is sent to a route they
// cannot access. Normal cross-role dashboard access redirects to the user's
// own dashboard in proxy.ts instead.
export default function ForbiddenPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F4F7FB] px-4 py-12">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 size-96 rounded-full bg-[#FFE5CC] opacity-70 blur-[100px]"
      />

      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/80">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50">
          <ShieldAlert className="size-8" aria-hidden="true" />
        </span>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange-ink">
          403 · Access denied
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">
          You don&apos;t have access to this page
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Your account may be missing a role, or this area is reserved for a
          different account type. Head back to a public page or sign in again.
        </p>

        <div className="mt-7 flex flex-col gap-2.5">
          <Button
            className="h-11 w-full rounded-full bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/90"
            render={<Link href="/" />}
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            className="h-11 w-full rounded-full"
            render={<Link href="/services" />}
          >
            Browse Services
          </Button>
        </div>
      </div>
    </main>
  );
}
