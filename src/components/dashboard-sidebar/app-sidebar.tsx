
"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";

import {
  LayoutDashboard,
  UserRound,
  Wrench,
  Plus,
  ClipboardList,
  CalendarDays,
  CreditCard,
  Users,
  BriefcaseBusiness,
  Receipt,
  Home,
  Settings,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useSession } from "@/lib/auth-client";

type Role = "customer" | "technician" | "admin";

interface MenuItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

const menuItemByRole: Record<Role, MenuItem[]> = {
  // CUSTOMER
  customer: [
    {
      name: "Overview",
      url: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      name: "My Bookings",
      url: "/dashboard/customer/bookings",
      icon: CalendarDays,
    },
    {
      name: "Payment History",
      url: "/dashboard/customer/payments",
      icon: CreditCard,
    },
    {
      name: "Profile",
      url: "/dashboard/profile",
      icon: UserRound,
    },
  ],

  // TECHNICIAN
  technician: [
    {
      name: "Overview",
      url: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      name: "Add New Service",
      url: "/dashboard/technician/add-service",
      icon: Plus,
    },
    {
      name: "My Services",
      url: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      name: "Booking Requests",
      url: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
    {
      name: "Profile",
      url: "/dashboard/profile",
      icon: UserRound,
    },
  ],

  // ADMIN
  admin: [
    {
      name: "Overview",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      name: "Manage Services",
      url: "/dashboard/admin/services",
      icon: Wrench,
    },
    {
      name: "Manage Bookings",
      url: "/dashboard/admin/bookings",
      icon: CalendarDays,
    },
    {
      name: "Transactions",
      url: "/dashboard/admin/transactions",
      icon: Receipt,
    },
    {
      name: "Profile",
      url: "/dashboard/profile",
      icon: UserRound,
    },
  ],
};

const roleLabels: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

// The current year is baked in at build time so the prerenderer never sees
// `new Date()` (which would otherwise block the route).
const YEAR = new Date().getFullYear();

export function AppSidebar() {
  const { data: session, isPending } = useSession();

  const userRole = session?.user?.role;

  const sessionRole = userRole as Role | null | undefined;
  const role: Role =
    sessionRole === "admin" || sessionRole === "technician"
      ? sessionRole
      : "customer";

const items = menuItemByRole[role];

  

  const user = session?.user;

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <div className="flex h-11 items-center">
          <Logo variant="light" />
        </div>

        {/* User information */}
        {!isPending && user && (
          <div className="mx-1 mt-3 flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="size-10 shrink-0 rounded-full border-2 border-brand-orange object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-brand-orange ring-2 ring-brand-orange/30 ring-offset-2 ring-offset-sidebar">
                {initial}
              </div>
            )}

            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-sidebar-foreground">
                {user.name}
              </span>

              <span className="text-xs font-medium text-brand-orange">
                {roleLabels[role] ?? "Customer"}
              </span>
            </div>
          </div>
        )}
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {role === "admin" ? "Administration" : "Workspace"}
          </p>

          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  tooltip={item.name}
                  className="h-10 rounded-lg transition-colors hover:bg-brand-orange/10 hover:text-brand-navy"
                >
                  <item.icon className="size-[18px]" />
                  <span className="font-medium">{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Back to website"
            >
              <Home className="size-[18px]" />
              <span>Back to Website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <p className="px-2 pb-1 text-[10px] text-muted-foreground">
          © {YEAR} FixMate
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
