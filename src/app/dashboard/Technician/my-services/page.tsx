import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getServices } from "@/lib/api/services";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import MyServicesClient from "./MyServicesClient";

// ---------------------------------------------------------------------------
// My Services (technician) — SERVER COMPONENT
//
// Real data only: reads the session, fetches GET /services and keeps the
// services created by THIS technician (they are stored with the creator's
// user id as technicianId). Everything interactive lives in
// MyServicesClient.
// ---------------------------------------------------------------------------
export default async function MyServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const allServices = await getServices(session.user.email, session.user.id);

  // Server-side filtering already returns only this technician's services,
  // but keep a safety fallback in case the backend returns extra data.
  const myServices = allServices.filter(
    (service) =>
      service.technicianId === session.user.id ||
      (service.technicianEmail &&
        String(service.technicianEmail).toLowerCase() ===
          String(session.user.email).toLowerCase())
  );

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Technician", href: "/dashboard/technician" },
          { label: "My Services" },
        ]}
        badge="Technician"
      />

      {/* Heading + primary action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
            My Services
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the services you offer. Unavailable services are hidden
            from public pages.
          </p>
        </div>

        <Button
          render={<Link href="/dashboard/technician/add-service" />}
          className="shrink-0 bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/90"
        >
          <Plus className="size-4" />
          Add New Service
        </Button>
      </div>

      <MyServicesClient
        services={myServices}
        technicianId={session.user.id}
      />
    </div>
  );
}
