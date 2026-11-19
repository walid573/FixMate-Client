// ---------------------------------------------------------------------------
// Service Details Page (Server Component)
//
// Fetches service by ID from http://localhost:8000/services.
// Enforces that the service must exist and be approved/available;
// otherwise calls notFound().
//
// Displays:
// - Large image banner
// - Category badge, title, technician summary card
// - About this service description
// - Duration, service area, service mode
// - Request repair sidebar / form
// ---------------------------------------------------------------------------

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Wrench, ArrowLeft, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getServices, type Service } from "@/lib/api/services";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import RequestRepairSection from "./RequestRepairSection";

// Shape returned by auth.api.getSession — we only need the user object.
interface SessionUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  area?: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch session on the server
  const authSession = await auth.api.getSession({
    headers: await headers(),
  });

  // Pass only the user object to the client component, matching its prop type.
  const session = authSession
    ? { user: authSession.user as SessionUser }
    : null;

  // Fetch all services and find the matching one
  const services = await getServices();
  const service = services.find((s) => s._id === id);

  // If service does not exist, or is not approved, or is not available, show Not Found
  if (
    !service ||
    service.approvalStatus !== "approved" ||
    service.isAvailable === false
  ) {
    notFound();
  }

  // Generate technician initials for the avatar
  const techName = service.technicianName || "FixMate Technician";
  const techInitials = techName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
    
      <div>
        <Button
          variant="ghost"
          className="gap-2 text-slate-600 hover:text-brand-navy pl-0"
          render={<Link href="/services" />}
        >
          <ArrowLeft className="size-4" />
          Back to all services
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
     
        <div className="space-y-6 lg:col-span-2">
  
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-[#e8eef5] shadow-sm">
            {service.image && service.image.startsWith("http") ? (
              <img
                src={service.image}
                alt={service.title}
                className="h-[360px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[360px] w-full items-center justify-center text-slate-400 font-medium text-base">
                [ {service.category} service gallery ]
              </div>
            )}
          </div>

        
          <div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {service.category}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              {service.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 ring-2 ring-slate-200 text-lg">
              {techInitials}
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy">{techName}</h3>
              <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1.5">
                <span className="inline-flex items-center text-amber-500 font-semibold">
                  <Star className="size-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                  4.9
                </span>
                <span>·</span>
                <span className="text-slate-600 font-medium">Verified technician</span>
              </p>
              {service.serviceArea && (
                <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="size-3" />
                  {service.serviceArea}
                </p>
              )}
            </div>
          </div>

   
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-brand-navy">About this service</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {service.description}
            </p>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-5">
              <div>
                <p className="text-xs font-medium text-slate-400">Duration</p>
                <p className="mt-1 text-sm font-semibold text-brand-navy flex items-center gap-1.5">
                  <Clock className="size-4 text-slate-400" />
                  {service.estimatedDuration}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Service area</p>
                <p className="mt-1 text-sm font-semibold text-brand-navy flex items-center gap-1.5">
                  <MapPin className="size-4 text-slate-400" />
                  {service.serviceArea}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Mode</p>
                <p className="mt-1 text-sm font-semibold text-brand-navy flex items-center gap-1.5">
                  <Wrench className="size-4 text-slate-400" />
                  {service.serviceMode}
                </p>
              </div>
            </div>
          </div>
        </div>

       
        <div className="lg:sticky lg:top-8">
          <RequestRepairSection service={service} session={session} />
        </div>
      </div>
    </div>
  );
}