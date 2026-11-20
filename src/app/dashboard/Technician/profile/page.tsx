import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import UpdateProfileForm from "@/components/profile/UpdateProfileForm";

export default async function TechnicianProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div>
        <DashboardBreadcrumb
          items={[
            { label: "Technician", href: "/dashboard/technician" },
            { label: "Profile" },
          ]}
          badge="Technician"
        />

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-navy">
          Update Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Keep your name, email and photo up to date.
        </p>
      </div>

      <UpdateProfileForm
        user={{
          name: user.name ?? "",
          email: user.email,
          image: user.image ?? null,
          phone: user.phone ?? "",
          area: user.area ?? "",
          bio: user.bio ?? "",
          role: user.role ?? "technician",
        }}
      />
    </div>
  );
}
