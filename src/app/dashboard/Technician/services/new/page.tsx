"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";

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

export default function AddServicePage() {
  const [serviceMode, setServiceMode] = useState<"home" | "dropoff">("home");
  const [availableForBooking, setAvailableForBooking] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[stub] Submit service for approval");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
          Add New Service
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish a repair service. It goes live after admin approval.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
   
        <div className="space-y-6 lg:col-span-2">
  
          <Card>
            <CardHeader>
              <CardTitle>Service details</CardTitle>
              <CardDescription>
                What customers see on the service card.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-brand-navy">
                  Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. iPhone screen replacement"
                  required
                  className="h-10"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 ">
                  <Label className="text-xs font-semibold text-brand-navy">
                    Category *
                  </Label>
                  <Select >
                    <SelectTrigger className="h-10! min-h-0 w-full  ">
                      <SelectValue placeholder="Select a category"  />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smartphone">Smartphone Repair</SelectItem>
                      <SelectItem value="laptop">Laptop Servicing</SelectItem>
                      <SelectItem value="ac">AC Servicing</SelectItem>
                      <SelectItem value="tv">TV Repair</SelectItem>
                      <SelectItem value="appliance">Home Appliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-brand-navy">
                    Estimated duration *
                  </Label>
                  <Select>
                    <SelectTrigger className=" h-10! min-h-0 w-full ">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30m">30 minutes</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="2h">2 hours</SelectItem>
                      <SelectItem value="half-day">Half day</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Typical time to finish the job.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold text-brand-navy">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the repair, parts used and any warranty."
                  className="min-h-[120px] resize-y"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  At least 30 characters. Up to 500.
                </p>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Pricing and availability</CardTitle>
              <CardDescription>
                Set what you charge and where you work.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-xs font-semibold text-brand-navy">
                    Base price *
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground text-sm">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      placeholder="2500"
                      className="pl-7 h-10"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Starting price in USD.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="area" className="text-xs font-semibold text-brand-navy">
                    Service area *
                  </Label>
                  <Input
                    id="area"
                    placeholder="e.g. Agrabad, Chattogram"
                    required
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-semibold text-brand-navy">
                  Service mode *
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceMode("home")}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                      serviceMode === "home"
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
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">
                        Home Visit
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceMode("dropoff")}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                      serviceMode === "dropoff"
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
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">
                        Shop Drop-off
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Photo</CardTitle>
              <CardDescription>
                A clear photo gets more bookings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label className="text-xs font-semibold text-brand-navy">
                Service image *
              </Label>
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center transition hover:border-brand-orange hover:bg-brand-orange/5 cursor-pointer">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange mb-3">
                  <Upload className="size-5" />
                </div>
                <p className="text-sm font-semibold text-brand-navy">
                  Upload a service image
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG or JPG, up to 5 MB. Stored securely.
                </p>
                <Button type="button" variant="outline" size="sm" className="mt-4 pointer-events-none">
                  Choose file
                </Button>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-orange text-brand-navy hover:bg-brand-orange/95 font-semibold">
              Submit for approval
            </Button>
          </div>
        </div>


        <div className="space-y-6">
  
          <Card>
            <CardHeader>
              <CardTitle>Technician</CardTitle>
              <CardDescription>Filled from your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Name
                </Label>
                <Input value="Rafiq Hasan" disabled className="bg-muted/50" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Email
                </Label>
                <Input value="rafiq@example.com" disabled className="bg-muted/50" />
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
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

              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">
                    Approval status
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Set by an admin after review.
                  </p>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 font-medium">
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
