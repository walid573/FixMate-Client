import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function FieldSkeleton({ height = "h-11" }: { height?: string }) {
  return (
    <div className="space-y-1.5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className={`${height} w-full rounded-md`} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Breadcrumb + header */}
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>

        <Skeleton className="mt-4 h-8 w-52" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[360px_1fr]">
        {/* Avatar card */}
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center px-8 py-8">
            <Skeleton className="size-32 rounded-full" />

            <Skeleton className="mt-6 h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-48" />
            <Skeleton className="mt-3 h-6 w-16 rounded-full" />
            <Skeleton className="mt-4 h-4 w-36" />

            <Skeleton className="mt-7 h-12 w-full rounded-full" />
            <Skeleton className="mt-3 h-12 w-full rounded-full" />
            <Skeleton className="mt-5 h-3 w-52" />
          </CardContent>
        </Card>

        {/* Personal information card */}
        <Card className="rounded-2xl">
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>

          <CardContent className="space-y-5">
            <FieldSkeleton />

            <div className="space-y-1.5">
              <FieldSkeleton />
              <Skeleton className="h-3 w-56" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton />
            </div>

            <div className="space-y-1.5">
              <FieldSkeleton height="h-[110px]" />
              <Skeleton className="h-3 w-28" />
            </div>

            <div className="space-y-1.5">
              <FieldSkeleton />
              <Skeleton className="h-3 w-52" />
            </div>

            <div className="flex items-center justify-end gap-3 border-t pt-5">
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}