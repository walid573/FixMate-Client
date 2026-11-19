import type { LucideIcon } from "lucide-react";
import { CalendarDays, House, Lock, ShieldCheck, Tag } from "lucide-react";

export interface WhyChooseUsItem {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Renders the navy hero card (wide, dark). */
  featured?: boolean;
  /** Small pills shown under the description. */
  tags?: string[];
  /** Rating text if present, e.g. "Rated ★ 4.9" */
  rating?: string;
}

export const WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    title: "Verified Technicians",
    description: "Every professional is reviewed before approval.",
    icon: ShieldCheck,
    featured: true,
    tags: ["Reviewed", "Approved"],
    rating: "Rated ★ 4.9",
  },
  {
    title: "Transparent Pricing",
    description: "See the starting price before you book.",
    icon: Tag,
    tags: ["From $1,200", "No surprises"],
  },
  {
    title: "Easy Online Booking",
    description: "Schedule in a minute, from any device.",
    icon: CalendarDays,
  },
  {
    title: "Secure Payments",
    description: "Pay online with protected checkout.",
    icon: Lock,
  },
  {
    title: "Convenient Options",
    description: "Home visit or shop drop-off.",
    icon: House,
  },
];
