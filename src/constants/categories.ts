import type { LucideIcon } from "lucide-react";
import {
  AirVent,
  Laptop,
  Refrigerator,
  Smartphone,
  Tv,
  WashingMachine,
  Zap,
} from "lucide-react";

export interface ServiceCategory {
  /** Display name shown on the card. */
  label: string;
  /** Value sent to /services as the `category` filter. */
  slug: string;
  icon: LucideIcon;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { label: "Smartphone", slug: "smartphone", icon: Smartphone },
  { label: "Laptop & PC", slug: "laptop-pc", icon: Laptop },
  { label: "AC", slug: "ac", icon: AirVent },
  { label: "Refrigerator", slug: "refrigerator", icon: Refrigerator },
  { label: "TV", slug: "tv", icon: Tv },
  { label: "Washing Machine", slug: "washing-machine", icon: WashingMachine },
  { label: "Electrical", slug: "electrical", icon: Zap },
];
