// ---------------------------------------------------------------------------
// Client component for the booking / repair request form.
//
// Handles:
// - Role restrictions (unauthenticated -> redirect to /login; tech/admin ->
//   disabled notice; customer -> opens the request form).
// - Form validation (phone, address, preferredDate >= today, problemDescription >= 20 chars).
// - Submitting via createBooking API, showing success toast with a link to
//   My Bookings, or handling duplicate/validation errors.
// ---------------------------------------------------------------------------

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Phone, FileText, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/toast";
import { createBooking } from "@/lib/api/bookings";
import type { Service } from "@/lib/api/services";

interface RequestRepairSectionProps {
  service: Service;
  session: {
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
      phone?: string;
      area?: string;
    };
  } | null;
}

export default function RequestRepairSection({
  service,
  session,
}: RequestRepairSectionProps) {
  const router = useRouter();
  const pushToast = useToast();

  const [phone, setPhone] = useState(session?.user?.phone || "");
  const [address, setAddress] = useState(session?.user?.area || "");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

  const role = session?.user?.role || "customer";
  const isLoggedIn = !!session?.user;
  const isCustomer = role === "customer";

  const todayStr = new Date().toISOString().split("T")[0];

  const handleRequestClick = () => {
    if (!isLoggedIn) {
      router.push(`/sign-in?callbackUrl=/services/${service._id}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoggedIn || !isCustomer) return;

    setError("");

    if (!phone.trim() || !address.trim() || !preferredDate || !problemDescription.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (problemDescription.trim().length < 20) {
      setError("Problem description must be at least 20 characters long.");
      return;
    }

    if (preferredDate < todayStr) {
      setError("Preferred date must be today or a future date.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        serviceId: service._id,
        serviceTitle: service.title,
        serviceImage: service.image,
        category: service.category,
        basePrice: service.basePrice,
        technicianName: service.technicianName,
        technicianEmail: service.technicianEmail,
        customerName: session.user.name,
        customerEmail: session.user.email,
        customerPhone: phone.trim(),
        address: address.trim(),
        preferredDate,
        problemDescription: problemDescription.trim(),
      };

      const res = await createBooking(payload);

      setSuccessBookingId(res.bookingId || "success");
      pushToast("Repair requested successfully!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit request.";
      setError(msg);
      pushToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-100">
      {/* Price header */}
      <div className="border-b border-slate-100 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Base price
        </p>
        <p className="mt-1 text-3xl font-extrabold text-brand-navy">
          ${service.basePrice.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          You won&apos;t be charged until the job is accepted.
        </p>
      </div>

      {/* Success view */}
      {successBookingId ? (
        <div className="py-6 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-navy">Request Submitted!</h3>
            <p className="mt-1 text-xs text-slate-500">
              The technician has been notified of your repair request.
            </p>
          </div>
          <Button
            className="w-full bg-brand-orange text-brand-navy hover:bg-brand-orange/90 font-semibold"
            render={<Link href="/dashboard/customer" />}
          >
            View My Bookings
          </Button>
        </div>
      ) : !isLoggedIn ? (
        /* Logged out view */
        <div className="py-6 text-center space-y-4">
          <p className="text-sm text-slate-600">
            Log in as a customer to request this repair service.
          </p>
          <Button
            onClick={handleRequestClick}
            className="w-full bg-brand-orange text-brand-navy hover:bg-brand-orange/90 font-semibold"
          >
            Log In to Request Repair
          </Button>
        </div>
      ) : !isCustomer ? (
        /* Technician or Admin view */
        <div className="py-6 text-center space-y-3 rounded-xl bg-amber-50/50 p-4 border border-amber-200/60">
          <p className="text-sm font-semibold text-amber-800">
            Only customers can request a repair
          </p>
          <p className="text-xs text-amber-700">
            You are currently logged in as a <span className="font-bold">{role}</span>.
          </p>
        </div>
      ) : (
        /* Customer form view */
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Your Name</Label>
            <Input value={session.user.name} disabled className="bg-slate-50 text-slate-600" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Your Email</Label>
            <Input value={session.user.email} disabled className="bg-slate-50 text-slate-600" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
              Phone Number *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                required
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-xs font-semibold text-slate-700">
              Customer Address *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, road, area"
                required
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="preferredDate" className="text-xs font-semibold text-slate-700">
              Preferred Date *
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="preferredDate"
                type="date"
                min={todayStr}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="problemDescription" className="text-xs font-semibold text-slate-700">
              Problem Description *
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 size-4 text-slate-400" />
              <Textarea
                id="problemDescription"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe the issue (minimum 20 characters)..."
                required
                className="min-h-[100px] pl-9 resize-y text-sm"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Minimum 20 characters required.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange text-brand-navy hover:bg-brand-orange/90 font-semibold h-11 shadow-sm mt-2"
          >
            {loading ? "Submitting Request..." : "Book Now"}
          </Button>
        </form>
      )}
    </div>
  );
}