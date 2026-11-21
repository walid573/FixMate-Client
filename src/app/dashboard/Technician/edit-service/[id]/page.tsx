export const dynamic = "force-dynamic";

import React from "react";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getServiceById } from "@/lib/api/services";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import EditServiceForm from "./EditServiceForm";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }


  if (service.technicianId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <DashboardBreadcrumb
        items={[
          { label: "Technician", href: "/dashboard/technician" },
          { label: "My Services", href: "/dashboard/technician/my-services" },
          { label: "Edit Service" },
        ]}
        badge="Technician"
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
          Edit Service
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the details of your service. Saving sends it back to Pending
          for admin review.
        </p>
      </div>

      <EditServiceForm service={service} technicianId={session.user.id} />
    </div>
  );
}
