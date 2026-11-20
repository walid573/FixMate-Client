import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ManageServicesClient from "./ManageServicesClient";

export default async function ManageServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Admin guard (commented out for demo — enable in production)
  // if (session?.user?.role === "admin") {
  //   redirect("/");
  // }

  const res = await fetch(`${process.env.BASE_URL}/services`, { cache: "no-store" });
  const services = res.ok ? await res.json() : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
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