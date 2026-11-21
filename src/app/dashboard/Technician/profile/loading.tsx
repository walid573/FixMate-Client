import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">
          Technician Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details.
        </p>
      </div>
      <Card className="rounded-xl">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}