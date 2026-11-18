import type { ComponentType, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";
import { AirVent, Laptop, Smartphone, Tv, WashingMachine } from "lucide-react";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/icons/social";

export interface FooterLink {
  label: string;
  href: string;
}

interface FooterCategory extends FooterLink {
  icon: LucideIcon;
}

interface SocialLink extends FooterLink {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const QUICK_LINKS: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

export const POPULAR_CATEGORIES: FooterCategory[] = [
  { label: "Smartphone Repair", href: "/services?category=smartphone", icon: Smartphone },
  { label: "Laptop Repair", href: "/services?category=laptop-pc", icon: Laptop },
  { label: "AC Servicing", href: "/services?category=ac", icon: AirVent },
  { label: "TV Repair", href: "/services?category=tv", icon: Tv },
  {
    label: "Washing Machine Repair",
    href: "/services?category=washing-machine",
    icon: WashingMachine,
  },
];

/** Placeholder details — replace with the real support contacts. */
export const CONTACT = {
  email: "support@fixmate.com",
  phone: "+880 1712 345678",
  address: "Dhaka, Bangladesh",
} as const;

/** Placeholder profile URLs — swap for the real FixMate accounts. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "X", href: "https://x.com/fixmate", icon: XIcon },
  { label: "Facebook", href: "https://facebook.com/fixmate", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com/fixmate", icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com/@fixmate", icon: YoutubeIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/fixmate", icon: LinkedinIcon },
];
