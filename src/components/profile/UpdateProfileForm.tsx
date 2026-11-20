"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useToast } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Matches the pills used on the admin dashboard so the role looks identical.
const ROLE_BADGES: Record<string, { label: string; className: string }> = {
  customer: { label: "Customer", className: "bg-brand-navy text-white" },
  technician: { label: "Technician", className: "bg-blue-50 text-blue-600" },
  admin: { label: "Admin", className: "bg-purple-50 text-purple-600" },
};

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB
const PHOTO_TYPES = ["image/jpeg", "image/png"];

interface UpdateProfileFormProps {
  user: {
    name: string;
    email: string;
    image: string | null;
    phone: string;
    area: string;
    bio: string;
    role?: string | null;
  };
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

// ---------------------------------------------------------------------------
// Update Profile — avatar card on the left, personal information on the right.
//
// Editable: name, phone, area, bio and photo (ImgBB via /api/upload).
// Read-only: email (better-auth rejects it on /update-user) and role
// (admin-only). Saving calls authClient.updateUser(), which re-fetches the
// session atom, so the navbar and dashboard top bar refresh without a logout.
// ---------------------------------------------------------------------------
export default function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const router = useRouter();
  const pushToast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [area, setArea] = useState(user.area);
  const [bio, setBio] = useState(user.bio);
  const [image, setImage] = useState<string | null>(user.image);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // The server pages re-fetch after save, so re-sync when the fresh user lands.
  useEffect(() => {
    setName(user.name);
    setPhone(user.phone);
    setArea(user.area);
    setBio(user.bio);
    setImage(user.image);
  }, [user.name, user.phone, user.area, user.bio, user.image]);

  const badge = ROLE_BADGES[user.role ?? "customer"] ?? ROLE_BADGES.customer;

  const handleFile = async (file: File) => {
    const okType =
      PHOTO_TYPES.includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);

    if (!okType) {
      pushToast("Please choose a JPG or PNG image.", "error");
      return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
      pushToast("Image must be 2 MB or smaller.", "error");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Image upload failed.");
      }

      setImage(result.imageUrl);
      pushToast("Photo uploaded — save changes to apply it.", "success");
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : "Image upload failed.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      pushToast("Please enter your full name.", "error");
      return;
    }

    if (!trimmedPhone) {
      pushToast("Please enter your phone number.", "error");
      return;
    }

    try {
      setSaving(true);

      // email and role are deliberately omitted — both are read-only here.
      const { error } = await authClient.updateUser({
        name: trimmedName,
        phone: trimmedPhone,
        area: area.trim(),
        bio: bio.trim(),
        image,
      });

      if (error) {
        throw new Error(error.message || "Could not save your profile.");
      }

      pushToast("Profile updated successfully.", "success");
      router.refresh();
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : "Could not save your profile.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setPhone(user.phone);
    setArea(user.area);
    setBio(user.bio);
    setImage(user.image);
  };

  return (
    <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />

      {/* ---- Avatar card ---- */}
      <Card className="rounded-xl lg:col-span-1">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="relative">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name || "Profile photo"}
                className="size-24 rounded-full object-cover ring-4 ring-brand-orange/20"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full bg-brand-orange text-2xl font-bold text-brand-navy ring-4 ring-brand-orange/20">
                {initialsOf(name)}
              </div>
            )}

            <button
              type="button"
              aria-label="Change photo"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-brand-navy text-white ring-4 ring-white transition hover:bg-brand-navy/90 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}
            </button>
          </div>

          <div className="space-y-1">
            <p className="truncate text-base font-semibold text-brand-navy">
              {user.name || "—"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
            <span
              className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "Uploading..." : "Upload photo"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!image || uploading}
              onClick={() => setImage(null)}
            >
              Remove
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            JPG or PNG, up to 2 MB. Square photos look best.
          </p>
        </CardContent>
      </Card>

      {/* ---- Personal information ---- */}
      <Card className="rounded-xl lg:col-span-2">
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>
            Update your contact details and photo.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">Full name</Label>

            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              maxLength={100}
              required
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-email">Email address</Label>

            <Input
              id="profile-email"
              value={user.email}
              disabled
              className="h-10 bg-muted/50"
            />

            <p className="text-[11px] text-muted-foreground">
              Contact support to change your email address.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="profile-phone">Phone number</Label>

              <Input
                id="profile-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="e.g. +1 555 123 4567"
                maxLength={30}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-area">Service area</Label>

              <Input
                id="profile-area"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder="e.g. Dhaka, Gulshan"
                maxLength={100}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-bio">Short bio</Label>

            <Textarea
              id="profile-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Tell customers what you specialize in"
              maxLength={300}
              className="min-h-[90px] resize-y"
            />

            <p className="text-[11px] text-muted-foreground">
              {bio.length}/300 characters.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-role">Role</Label>

            <Input
              id="profile-role"
              value={badge.label}
              disabled
              className="h-10 bg-muted/50"
            />

            <p className="text-[11px] text-muted-foreground">
              Your role can only be changed by an admin.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={saving || uploading}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving || uploading}
              className="bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/95"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
