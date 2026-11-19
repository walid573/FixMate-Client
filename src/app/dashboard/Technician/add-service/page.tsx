"use client";

import React, { useState } from "react";

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
import { addService, type AddServiceData } from "@/lib/api/services";
import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

type ServiceMode = "home" | "dropoff";



export default function AddServicePage() {
    const { data: session, isPending } = useSessionClient();

    const [serviceMode, setServiceMode] = useState<ServiceMode>("home");
    const [availableForBooking, setAvailableForBooking] = useState(true);
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [category, setCategory] = useState("");
    const [duration, setDuration] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const resetForm = (form: HTMLFormElement) => {
        form.reset();

        setCategory("");
        setDuration("");
        setServiceMode("home");
        setAvailableForBooking(true);
    };
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
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

            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();

            if (!result.success) {
                throw new Error("Image upload failed.");
            }

            setImage(result.data.url);
            setSuccess("Image uploaded successfully!");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to upload image."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        // Capture the form before the asynchronous operation.
        const form = e.currentTarget;

        if (isPending) return;

        if (!session?.user) {
            setError("Please log in first.");
            return;
        }

        if (!category || !duration) {
            setError("Please select a category and duration.");
            return;
        }

        const formData = new FormData(form);

        const title = String(formData.get("title") || "").trim();
        const description = String(
            formData.get("description") || ""
        ).trim();

        const basePrice = Number(formData.get("basePrice"));

        const serviceArea = String(
            formData.get("serviceArea") || ""
        ).trim();

        const image = String(formData.get("image") || "").trim();

        // Frontend validation
        if (!title || !description || !serviceArea) {
            setError("Please fill in all required fields.");
            return;
        }

        if (description.length < 30 || description.length > 500) {
            setError("Description must be between 30 and 500 characters.");
            return;
        }

        if (!Number.isFinite(basePrice) || basePrice <= 0) {
            setError("Please enter a valid price greater than zero.");
            return;
        }

        const serviceData = {
            title,
            category,
            description,
            basePrice,
            estimatedDuration: duration,
            serviceArea,
            serviceMode: (
                serviceMode === "home" ? "Home Visit" : "Shop Drop-off"
            ),
            technicianName: session.user.name,
            technicianId: session.user.id,
            image,
            availableForBooking,
        };
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await addService(serviceData as AddServiceData);

            setSuccess("Service submitted successfully! Waiting for admin approval.");

            resetForm(form);
        } catch (err) {
            console.error("Service submission error:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to submit service. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-12">

            {/* Page heading */}
            <div>
                <DashboardBreadcrumb
                    items={[
                        { label: "Technician", href: "/dashboard/technician" },
                        { label: "Add New Service" },
                    ]}
                    badge="Technician"
                />

                <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-navy">
                    Add New Service
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Publish a repair service. It goes live after admin approval.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid gap-6 lg:grid-cols-3"
            >
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
                                <Label htmlFor="title">
                                    Title *
                                </Label>

                                <Input
                                    id="title"
                                    name="title"
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

                                    <Select
                                        value={category}
                                        onValueChange={(value) => setCategory(value ?? "")}
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="smartphone">
                                                Smartphone Repair
                                            </SelectItem>

                                            <SelectItem value="laptop">
                                                Laptop Servicing
                                            </SelectItem>

                                            <SelectItem value="ac">
                                                AC Servicing
                                            </SelectItem>

                                            <SelectItem value="tv">
                                                TV Repair
                                            </SelectItem>

                                            <SelectItem value="appliance">
                                                Home Appliance
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Duration */}
                                <div className="space-y-1.5">
                                    <Label>Estimated duration *</Label>

                                    <Select
                                        value={duration}
                                        onValueChange={(value) => setDuration(value ?? "")}
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="30m">
                                                30 minutes
                                            </SelectItem>

                                            <SelectItem value="1h">
                                                1 hour
                                            </SelectItem>

                                            <SelectItem value="2h">
                                                2 hours
                                            </SelectItem>

                                            <SelectItem value="half-day">
                                                Half day
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <Label htmlFor="description">
                                    Description *
                                </Label>

                                <Textarea
                                    id="description"
                                    name="description"
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
                                    <Label htmlFor="basePrice">
                                        Base price *
                                    </Label>

                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                                            $
                                        </span>

                                        <Input
                                            id="basePrice"
                                            name="basePrice"
                                            type="number"
                                            min="1"
                                            step="0.01"
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
                                    <Label htmlFor="serviceArea">
                                        Service area *
                                    </Label>

                                    <Input
                                        id="serviceArea"
                                        name="serviceArea"
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
                                        onClick={() => setServiceMode("home")}
                                        className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${serviceMode === "home"
                                            ? "border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange"
                                            : "border-border hover:bg-muted/50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="serviceMode"
                                            checked={serviceMode === "home"}
                                            onChange={() => setServiceMode("home")}
                                            className="accent-brand-orange"
                                        />

                                        <span className="text-sm font-semibold text-brand-navy">
                                            Home Visit
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setServiceMode("dropoff")}
                                        className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${serviceMode === "dropoff"
                                            ? "border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange"
                                            : "border-border hover:bg-muted/50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="serviceMode"
                                            checked={serviceMode === "dropoff"}
                                            onChange={() => setServiceMode("dropoff")}
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

                    {/* Image URL */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Service photo</CardTitle>

                            <CardDescription>
                                Add an image URL for your service.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-1.5">
                                <Label htmlFor="image">
                                    Image URL (optional)
                                </Label>

                                <Input
                                    id="image"
                                    name="image"
                                    type="url"
                                    placeholder="https://example.com/service-image.jpg"
                                    className="h-10"
                                />

                                <p className="text-[11px] text-muted-foreground">
                                    Paste a publicly accessible image URL.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Messages */}
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">

                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={(e) => {
                                const form = e.currentTarget.form;

                                if (form) {
                                    resetForm(form);
                                    setError("");
                                    setSuccess("");
                                }
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading || isPending}
                            className="bg-brand-orange font-semibold text-brand-navy hover:bg-brand-orange/95"
                        >
                            {loading ? "Submitting..." : "Submit for approval"}
                        </Button>

                    </div>

                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Technician information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Technician</CardTitle>

                            <CardDescription>
                                Filled from your account.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            <div className="space-y-1.5">
                                <Label>Name</Label>

                                <Input
                                    value={session?.user?.name ?? ""}
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
                                    checked={availableForBooking}
                                    onCheckedChange={setAvailableForBooking}
                                />
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <div>
                                    <p className="text-sm font-semibold text-brand-navy">
                                        Approval status
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Set by an admin after review.
                                    </p>
                                </div>

                                <Badge className="bg-amber-100 font-medium text-amber-800">
                                    Pending
                                </Badge>
                            </div>

                        </CardContent>
                    </Card>

                </div>
            </form>
        </div>
    );
}