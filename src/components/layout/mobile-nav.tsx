"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/constants/nav";
import { authClient, useSession } from "@/lib/auth-client";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const menuLinkClass =
  "flex w-full items-center rounded-lg px-3 py-2.5 text-base font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange";

const signInClass = cn(
  buttonVariants({ variant: "outline", size: "lg" }),
  "h-11 w-full rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/40",
);

const getStartedClass = cn(
  buttonVariants({ variant: "default", size: "lg" }),
  "h-11 w-full rounded-full bg-brand-orange px-5 font-semibold text-brand-navy hover:bg-brand-orange/90 focus-visible:ring-white/40",
);

export function MobileNav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const pushToast = useToast();

  const user = session?.user;
  const role = user?.role ?? "customer";
  const roleLabel =
    role === "technician"
      ? "Technician"
      : role === "admin"
        ? "Admin"
        : "Customer";

  async function handleSignOut() {
    await authClient.signOut();
    pushToast("You have been signed out.", "success");
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open navigation menu"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-10 rounded-full text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/40 lg:hidden",
        )}
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="border-white/10 bg-brand-navy text-white"
      >
        <SheetHeader className="pt-5">
          <SheetTitle className="text-white">Menu</SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile" className="px-4">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <SheetClose
                  render={<Link href={item.href} className={menuLinkClass} />}
                >
                  {item.label}
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer reflects the session, just like the desktop navbar. */}
        {!isPending && (
          <SheetFooter className="flex-col items-stretch gap-2">
            {user ? (
              <>
                <div className="mb-1 px-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-white/60">{user.email}</p>
                  <p className="mt-1 text-[10px] font-semibold tracking-wide text-brand-orange">
                    {roleLabel}
                  </p>
                </div>

                <SheetClose
                  render={
                    <Link
                      href={`/dashboard/${role}`}
                      className={cn(signInClass, "inline-flex items-center justify-center gap-2")}
                    />
                  }
                >
                  <LayoutDashboard className="size-4" aria-hidden="true" />
                  Dashboard
                </SheetClose>

                <SheetClose
                  render={
                    <Link
                      href="/dashboard/profile"
                      className={cn(signInClass, "inline-flex items-center justify-center gap-2")}
                    />
                  }
                >
                  <UserRound className="size-4" aria-hidden="true" />
                  Update Profile
                </SheetClose>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className={cn(
                    getStartedClass,
                    "inline-flex items-center justify-center gap-2 bg-white/10 text-red-300 hover:bg-white/15 hover:text-red-200",
                  )}
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <SheetClose
                  render={<Link href="/sign-in" className={signInClass} />}
                >
                  Sign In
                </SheetClose>
                <SheetClose
                  render={<Link href="/sign-up" className={getStartedClass} />}
                >
                  Get Started
                  <ArrowRight className="size-4" aria-hidden="true" />
                </SheetClose>
              </>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
