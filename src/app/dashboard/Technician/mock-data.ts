// ---------------------------------------------------------------------------
// MOCK DATA — Technician dashboard overview.
// Replace these with real API calls when the backend is wired up. Kept separate
// from the page component so it's obvious this is not production data.
// ---------------------------------------------------------------------------

export type BookingStatus =
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed";

export interface Booking {
  id: string;
  customer: string;
  phone: string;
  service: string;
  date: string;
  status: BookingStatus;
  finalAmount: string | null;
}

export interface Stat {
  label: string;
  value: string;
}

export interface ServicePerformance {
  service: string;
  jobs: number;
}

export interface ServicePrice {
  service: string;
  price: string;
}

export const stats: Stat[] = [
  { label: "Total Services", value: "6" },
  { label: "Pending Requests", value: "4" },
  { label: "Active Repairs", value: "3" },
  { label: "Completed Jobs", value: "42" },
  { label: "Total Earnings", value: "$84,600" },
];

export const bookings: Booking[] = [
  {
    id: "b1",
    customer: "Arifrul Karim",
    phone: "01700000000",
    service: "Screen Replacement",
    date: "20 Nov 2026",
    status: "requested",
    finalAmount: null,
  },
  {
    id: "b2",
    customer: "Farhana Akter",
    phone: "01700000000",
    service: "Laptop Servicing",
    date: "19 Nov 2026",
    status: "accepted",
    finalAmount: null,
  },
  {
    id: "b3",
    customer: "Jakir Hosain",
    phone: "01700000000",
    service: "AC Servicing",
    date: "18 Nov 2026",
    status: "in-progress",
    finalAmount: "$1,500",
  },
  {
    id: "b4",
    customer: "Sumi Das",
    phone: "01700000000",
    service: "Screen Replacement",
    date: "12 Nov 2026",
    status: "completed",
    finalAmount: "$2,800",
  },
];

export const servicePerformance: ServicePerformance[] = [
  { service: "Smartphone Screen Replacement", jobs: 14 },
  { service: "Laptop Servicing", jobs: 9 },
  { service: "AC Servicing", jobs: 6 },
];

export const myServices: ServicePrice[] = [
  { service: "Screen Replacement", price: "$2,500" },
  { service: "Fridge Compressor Check", price: "$2,000" },
  { service: "Wiring Inspection", price: "$900" },
];
