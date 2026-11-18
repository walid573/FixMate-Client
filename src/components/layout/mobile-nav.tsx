"use client";

import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";

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

        <SheetFooter>
          <SheetClose
            render={<Link href="/login" className={signInClass} />}
          >
            Sign In
          </SheetClose>
          <SheetClose
            render={<Link href="/register" className={getStartedClass} />}
          >
            Get Started
            <ArrowRight className="size-4" aria-hidden="true" />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
