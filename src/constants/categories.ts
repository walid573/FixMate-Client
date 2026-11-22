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

// Legacy/alias values written by older versions of the add-service form and
// by seeded data. Map them onto the canonical labels above so the browse
// filter and the dropdown never show duplicates like "ac" and "AC".
const CATEGORY_ALIASES: Record<string, string> = {
  smartphone: "Smartphone",
  smartphonerepair: "Smartphone",
  mobile: "Smartphone",
  laptop: "Laptop & PC",
  laptopservicing: "Laptop & PC",
  laptoppc: "Laptop & PC",
  ac: "AC",
  acservicing: "AC",
  airconditioner: "AC",
  refrigerator: "Refrigerator",
  fridge: "Refrigerator",
  tv: "TV",
  tvrepair: "TV",
  television: "TV",
  washingmachine: "Washing Machine",
  electrical: "Electrical",
  appliance: "Electrical",
  homeappliance: "Electrical",
};

export function canonicalCategory(value?: string | null): string | undefined {
  if (!value) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;

  const key = raw.toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (CATEGORY_ALIASES[key]) return CATEGORY_ALIASES[key];

  const exact = SERVICE_CATEGORIES.find(
    (c) => c.label.toLowerCase() === raw.toLowerCase()
  );
  return exact?.label ?? raw;
}
