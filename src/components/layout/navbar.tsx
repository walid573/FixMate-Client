import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DesktopNav } from "@/components/layout/desktop-nav";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const signInClass = cn(
  buttonVariants({ variant: "outline", size: "lg" }),
  "hidden h-10 rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/40 sm:inline-flex",
);

const getStartedClass = cn(
  buttonVariants({ variant: "default", size: "lg" }),
  "hidden h-10 rounded-full bg-brand-orange px-5 font-semibold text-brand-navy hover:bg-brand-orange/90 focus-visible:ring-white/40 sm:inline-flex",
);

export async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})
  console.log(session?.user);
  


  return (
    <header className="sticky top-0 z-50 bg-brand-navy">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Logo />

        <div className="hidden justify-self-center lg:block">
          <DesktopNav />
        </div>

        <div className="flex items-center justify-end gap-2">
          {
            session?.user ? <>
             <img
              src={session.user.image || session.user.name?.charAt(0) }
              alt={ session.user.name?.trim().charAt(0)}
              className="size-10 rounded-full border border-border object-cover"
            />
            </> :<>
            <Link href="/login" className={signInClass}>
            Sign In
          </Link>
          <Link href="/register" className={getStartedClass}>
            Get Started
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link></>
          }
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
