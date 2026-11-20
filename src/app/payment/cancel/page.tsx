import Link from "next/link";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md rounded-xl">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-slate-100">
            <XCircle className="size-6 text-slate-500" />
          </span>
          <h1 className="text-xl font-bold text-brand-navy">
            Payment cancelled
          </h1>
          <p className="text-sm text-muted-foreground">
            No money was taken. You can try again whenever you are ready.
          </p>
          <div className="mt-2">
            <Button
              className="bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/90"
              render={<Link href="/dashboard/customer/bookings" />}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}