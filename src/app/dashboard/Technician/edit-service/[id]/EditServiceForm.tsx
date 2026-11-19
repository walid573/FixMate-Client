"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSessionClient } from "@/lib/Session/client";
import { updateService, type Service } from "@/lib/api/services";
import { useToast } from "@/lib/toast";

// ---------------------------------------------------------------------------
// EditServiceForm
//
// Pre-filled twin of the Add New Service form. Saving PATCHes the service
// (which resets approvalStatus back to "pending" on the server), so the
// technician always sees the Pending badge again on My Services.
// ---------------------------------------------------------------------------

type ServiceMode = "home" | "dropoff";

const CATEGORY_OPTIONS = [
  { value: "smartphone", label: "Smartphone Repair" },
  { value: "laptop", label: "Laptop Servicing" },
  { value: "ac", label: "AC Servicing" },
  { value: "tv", label: "TV Repair" },
  { value: "appliance", label: "Home Appliance" },
];

const DURATION_OPTIONS = [
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "half-day", label: "Half day" },
];

interface EditServiceFormProps {
  service: Service;
  technicianId: string;
}

export default function EditServiceForm({
  service,
  technicianId,
}: EditServiceFormProps) {
  const router = useRouter();
  const { data: session } = useSessionClient();
  const pushToast = useToast();

  const [title, setTitle] = useState(service.title ?? "");
  const [category, setCategory] = useState(service.category ?? "");
  const [description, setDescription] = useState(service.description ?? "");
  const [price, setPrice] = useState(String(service.basePrice ?? ""));
  const [serviceArea, setServiceArea] = useState(service.serviceArea ?? "");
  const [duration, setDuration] = useState(service.estimatedDuration ?? "");
  const [mode, setMode] = useState<ServiceMode>(
    service.serviceMode === "Shop Drop-off" ? "dropoff" : "home"
  );
  const [image, setImage] = useState(service.image ?? "");
  const [available, setAvailable] = useState(
    typeof service.availableForBooking === "boolean"
      ? service.availableForBooking
      : (service.isAvailable ?? true)
  );
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // The stored category / duration may not be one of the presets (seed data
  // uses free-form values like "Electrical" or "1-2 hours"), so the current
  // value is appended as an extra option instead of being lost.
  const categoryOptions = useMemo(() => {
    const options = [...CATEGORY_OPTIONS];
    if (category && !options.some((o) => o.value === category)) {
      options.push({ value: category, label: category });
    }
    return options;
  }, [category]);

  const durationOptions = useMemo(() => {
    const options = [...DURATION_OPTIONS];
    if (duration && !options.some((o) => o.value === duration)) {
      options.push({ value: duration, label: duration });
    }
    return options;
  }, [duration]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed.");
      }

      setImage(result.imageUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    // Frontend validation — same rules as the add form and the server.
    if (!title.trim() || !category || !duration || !serviceArea.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (description.trim().length < 30 || description.trim().length > 500) {
      setError("Description must be between 30 and 500 characters.");
      return;
    }

    const basePrice = Number(price);

    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateService(service._id, technicianId, {
        title: title.trim(),
        category,
        description: description.trim(),
        basePrice,
        estimatedDuration: duration,
        serviceArea: serviceArea.trim(),
        serviceMode: mode === "home" ? "Home Visit" : "Shop Drop-off",
        image: image.trim(),
        availableForBooking: available,
      });

      pushToast(
        "Service updated. It is now Pending admin review.",
        "success"
      );
      router.push("/dashboard/technician/my-services");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update the service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* Main form */}
      <div className="space-y-6 lg:col-span-2">
        {/* Service details */}
        <Card>
          <CardHeader>
            <CardTitle>Service details</CardTitle>
            <CardDescription>
              What customers see on the service card.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. iPhone screen replacement"
                required
                maxLength={100}
                className="h-10"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Category */}
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <Label>Estimated duration *</Label>
                <Select value={duration} onValueChange={(v) => setDuration(v ?? "")}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the repair, parts used and any warranty."
                className="min-h-[120px] resize-y"
                minLength={30}
                maxLength={500}
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Minimum 30 characters. Maximum 500.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing and availability</CardTitle>
            <CardDescription>
              Set what you charge and where you work.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Price */}
              <div className="space-y-1.5">
                <Label htmlFor="basePrice">Base price *</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="basePrice"
                    type="number"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2500"
                    className="h-10 pl-7"
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Starting price in USD.
                </p>
              </div>

              {/* Area */}
              <div className="space-y-1.5">
                <Label htmlFor="serviceArea">Service area *</Label>
                <Input
                  id="serviceArea"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  placeholder="e.g. Agrabad, Chattogram"
                  required
                  className="h-10"
                />
              </div>
            </div>

            {/* Service mode */}
            <div className="space-y-2 pt-2">
              <Label>Service mode *</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("home")}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                    mode === "home"
                      ? "border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="serviceMode"
                    checked={mode === "home"}
                    onChange={() => setMode("home")}
                    className="accent-brand-orange"
                  />
                  <span className="text-sm font-semibold text-brand-navy">
                    Home Visit
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("dropoff")}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                    mode === "dropoff"
                      ? "border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="serviceMode"
                    checked={mode === "dropoff"}
                    onChange={() => setMode("dropoff")}
                    className="accent-brand-orange"
                  />
                  <span className="text-sm font-semibold text-brand-navy">
                    Shop Drop-off
                  </span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle>Service Photo</CardTitle>
            <CardDescription>
              Upload a photo of your repair service.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUpload">Choose Service Image</Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="cursor-pointer"
              />
            </div>

            {uploading && (
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            )}

            {image && (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Service preview"
                  className="h-40 w-full rounded-xl object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImage("")}
                >
                  Remove Image
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Maximum image size: 5MB.
            </p>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            render={<Link href="/dashboard/technician/my-services" />}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading || uploading}
            className="bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/95"
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Technician */}
        <Card>
          <CardHeader>
            <CardTitle>Technician</CardTitle>
            <CardDescription>Filled from your account.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={session?.user?.name ?? service.technicianName ?? ""}
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                value={session?.user?.email ?? ""}
                disabled
                className="bg-muted/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">
                  Available for booking
                </p>
                <p className="text-xs text-muted-foreground">
                  Customers can request this service.
                </p>
              </div>

              <Switch
                checked={available}
                onCheckedChange={setAvailable}
                aria-label="Available for booking"
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm font-semibold text-brand-navy">
                  Approval status
                </p>
                <p className="text-xs text-muted-foreground">
                  Saving sends it back to admin review.
                </p>
              </div>

              <ApprovalBadgeFor status={service.approvalStatus} />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

// Small badge helper kept local to this form.
function ApprovalBadgeFor({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    approved: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-600",
  };

  const label =
    status === "approved"
      ? "Approved"
      : status === "rejected"
        ? "Rejected"
        : "Pending";

  return (
    <Badge
      className={`font-medium ${styles[status ?? ""] ?? styles.pending}`}
    >
      {label}
    </Badge>
  );
}
