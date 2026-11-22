import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import UpdateProfileForm from "@/components/profile/UpdateProfileForm";

// ---------------------------------------------------------------------------
// Shared Profile (All Roles) — /dashboard/profile
//
// One route for customer, technician and admin. The breadcrumb adapts to the
// caller's role so the trail still matches their dashboard sidebar.
// ---------------------------------------------------------------------------
const ROLE_HOME: Record<string, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

export default async function SharedProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = session.user;
  const role = (user.role ?? "customer") as keyof typeof ROLE_HOME;
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div>
        <DashboardBreadcrumb
          items={[
            { label: roleLabel, href: ROLE_HOME[role] ?? "/dashboard/customer" },
            { label: "Profile" },
          ]}
          badge={roleLabel}
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
          role: user.role ?? "customer",
          createdAt: (user as any).createdAt ?? null,
        }}
      />
    </div>
  );
}
