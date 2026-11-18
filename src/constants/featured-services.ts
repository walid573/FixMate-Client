/**
 * MOCK DATA — placeholder content for the homepage.
 * Replace with the services API response when that endpoint is available.
 */
export type ServiceMode = "Home Visit" | "Shop Drop-off";

export interface FeaturedService {
  /** Route segment for /service/[id]. */
  id: string;
  category: string;
  title: string;
  technician: string;
  location: string;
  duration: string;
  /** Price in BDT, formatted at render time. */
  price: number;
  mode: ServiceMode;
  /**
   * Path to a photo inside /public, e.g. "/images/services/iphone.jpg".
   * Leave undefined to render the grey placeholder.
   */
  image?: string;
  /** Placeholder label shown while `image` is undefined. */
  photoLabel: string;
}

export const FEATURED_SERVICES: FeaturedService[] = [
  {
    id: "iphone-screen-replacement",
    category: "Smartphone",
    title: "iPhone Screen Replacement",
    technician: "Rafiq Hasan",
    location: "Nasirabad, Chattogram",
    duration: "45 min",
    price: 2500,
    mode: "Home Visit",
    photoLabel: "iPhone photo",
  },
  {
    id: "laptop-keyboard-battery-repair",
    category: "Laptop & PC",
    title: "Laptop Keyboard & Battery Repair",
    technician: "Nusrat Jahan",
    location: "GEC Circle, Chattogram",
    duration: "2 hrs",
    price: 1800,
    mode: "Shop Drop-off",
    photoLabel: "Laptop photo",
  },
  {
    id: "ac-gas-refill-servicing",
    category: "AC",
    title: "AC Gas Refill & Servicing",
    technician: "Tamvir Ahmed",
    location: "Khulshi, Chattogram",
    duration: "1.5 hrs",
    price: 1500,
    mode: "Home Visit",
    photoLabel: "AC photo",
  },
  {
    id: "refrigerator-compressor-check",
    category: "Refrigerator",
    title: "Refrigerator Compressor Check",
    technician: "Sajid Karim",
    location: "Nasirabad, Chattogram",
    duration: "2 hrs",
    price: 2000,
    mode: "Home Visit",
    photoLabel: "Refrigerator photo",
  },
  {
    id: "led-tv-panel-diagnosis",
    category: "TV",
    title: "LED TV Panel Diagnosis",
    technician: "Imran Hossain",
    location: "Halishahar, Chattogram",
    duration: "1 hr",
    price: 1200,
    mode: "Shop Drop-off",
    photoLabel: "LED photo",
  },
  {
    id: "washing-machine-drum-repair",
    category: "Washing Machine",
    title: "Washing Machine Drum Repair",
    technician: "Mizanur Rahman",
    location: "Pahartali, Chattogram",
    duration: "2 hrs",
    price: 1600,
    mode: "Home Visit",
    photoLabel: "Washing photo",
  },
];
