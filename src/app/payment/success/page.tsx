import Link from "next/link";
import { headers } from "next/headers";
import { XCircle } from "lucide-react";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PaymentSuccessVerifier from "./PaymentSuccessVerifier";


const backToBookings = (
  <Button
    variant="outline"
    render={<Link href="/dashboard/customer/bookings" />}
  >
    Back to My Bookings
  </Button>
);

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-md rounded-xl">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-slate-100">
              <XCircle className="size-6 text-slate-500" />
            </span>
            <h1 className="text-xl font-bold text-brand-navy">
              Sign in to confirm
            </h1>
            <p className="text-sm text-muted-foreground">
              Your payment will show up in My Bookings once you sign in.
            </p>
            <div className="mt-2 flex flex-col gap-2">
              <Button render={<Link href="/login" />}>Sign in</Button>
              {backToBookings}
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!session_id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-md rounded-xl">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-slate-100">
              <XCircle className="size-6 text-slate-500" />
            </span>
            <h1 className="text-xl font-bold text-brand-navy">
              Missing payment reference
            </h1>
            <p className="text-sm text-muted-foreground">
              Open My Bookings to see the status of your latest payment.
            </p>
            <div className="mt-2">{backToBookings}</div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <PaymentSuccessVerifier sessionId={session_id} />;
}