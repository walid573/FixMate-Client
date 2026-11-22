import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authFetch } from "@/lib/Session/server";
import { redirect } from "next/navigation";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import ManageServicesClient from "./ManageServicesClient";

export default async function ManageServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role !== "admin") redirect("/forbidden");

  // Send the admin token: the public catalogue endpoint only returns
  // approved+available services to anonymous/customer callers.
  const res = await authFetch(`${process.env.BASE_URL}/services`, {
    cache: "no-store",
  });
  const services = res.ok ? await res.json() : [];

  return (
    <div className="space-y-6">
      <div>
        <DashboardBreadcrumb
          items={[
            { label: "Admin", href: "/dashboard/admin" },
            { label: "Services" },
          ]}
          badge="Admin"
        />

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-navy">
          Service Approval
        </h1>
        <p className="text-sm text-muted-foreground">
          Review services from every technician. Pending ones come first.
        </p>
      </div>

      <ManageServicesClient initialServices={services} />
    </div>
  );
}