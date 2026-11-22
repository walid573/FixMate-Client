import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { authFetch } from "@/lib/Session/server";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";
import ManageUsersClient from "./ManageUsersClient";

// ---------------------------------------------------------------------------
// Manage Users (Admin) — SERVER COMPONENT
//
// Fetches the complete user list from the backend and passes it to the
// client-side manager for filtering, searching, and role updates.
// ---------------------------------------------------------------------------
export default async function ManageUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Note: admin check — adjust to your actual role check.
  // if (session?.user?.role !== "admin") redirect("/");

  const res = await authFetch(`/users`, {
    cache: "no-store",
  });

  const users = res.ok ? await res.json() : [];

  return (
    <div className="space-y-6">
      <div>
        <DashboardBreadcrumb
          items={[
            { label: "Admin", href: "/dashboard/admin" },
            { label: "Users" },
          ]}
          badge="Admin"
        />

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-navy">
          Manage Users
        </h1>
        <p className="text-sm text-muted-foreground">
          Everyone on FixMate. Update a person's role when needed.
        </p>
      </div>

      <ManageUsersClient 
        initialUsers={users} 
        currentUserEmail={session?.user?.email ?? ""} 
      />
    </div>
  );
}