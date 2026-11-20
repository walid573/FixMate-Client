"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  verifyCheckoutSession,
  type VerifyPaymentResult,
} from "@/lib/api/payments";


function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md rounded-xl">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          {children}
        </CardContent>
      </Card>
    </main>
  );
}

export default function PaymentSuccessVerifier({
  sessionId,
}: {
  sessionId: string;
}) {
  const [result, setResult] = useState<VerifyPaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    verifyCheckoutSession(sessionId)
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not verify payment."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const backToBookings = (
    <Button
      variant="outline"
      render={<Link href="/dashboard/customer/bookings" />}
    >
      Back to My Bookings
    </Button>
  );


  if (!result && !error) {
    return (
      <Shell>
        <Loader2 className="size-10 animate-spin text-brand-orange" />
        <h1 className="text-xl font-bold text-brand-navy">
          Confirming your payment…
        </h1>
        <p className="text-sm text-muted-foreground">
          This only takes a moment — please don&apos;t close this tab.
        </p>
      </Shell>
    );
  }


  if (error || !result?.paid) {
    return (
      <Shell>
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-100">
          <XCircle className="size-6 text-slate-500" />
        </span>
        <h1 className="text-xl font-bold text-brand-navy">
          {error ? "Could not confirm payment" : "Payment not completed"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {error
            ? "Check My Bookings — if you were charged, the payment will show there."
            : "No money was taken. You can try again whenever you are ready."}
        </p>
        <div className="mt-2">{backToBookings}</div>
      </Shell>
    );
  }


  return (
    <Shell>
      <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="size-6 text-emerald-600" />
      </span>
      <h1 className="text-xl font-bold text-brand-navy">Payment successful</h1>
      <p className="text-sm text-muted-foreground">
        Thank you! Your payment
        {result.serviceTitle ? ` for ${result.serviceTitle}` : ""} has been
        received.
      </p>

      <div className="mt-2 w-full rounded-lg bg-slate-50 px-4 py-3 text-left text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-bold text-brand-navy">
            ${(result.amount ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="shrink-0 text-muted-foreground">Transaction ID</span>
          <span className="font-mono text-xs break-all text-brand-navy">
            {result.transactionId ?? "—"}
          </span>
        </div>
      </div>

      <div className="mt-2">{backToBookings}</div>
    </Shell>
  );
}