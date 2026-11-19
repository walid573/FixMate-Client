// ---------------------------------------------------------------------------
// MOCK DATA — Customer dashboard overview.
// Replace these with real API calls when the backend is wired up. Kept separate
// from the page component so it's obvious this is not production data.
// ---------------------------------------------------------------------------

export interface Stat {
  label: string;
  value: string;
}

export interface Booking {
  id: string;
  service: string;
  technician: string;
  date: string;
  status: "completed" | "in-progress" | "requested";
  payment: "unpaid" | "paid";
  amount: string;
}

export const stats: Stat[] = [
  { label: "Total Bookings", value: "18" },
  { label: "Active Bookings", value: "3" },
  { label: "Completed", value: "14" },
  { label: "Total Spent", value: "$32,400" },
];

export const bookings: Booking[] = [
  {
    id: "b1",
    service: "iPhone Screen Replacement",
    technician: "Rafiq Hasan",
    date: "12 Nov 2026",
    status: "completed",
    payment: "unpaid",
    amount: "$2,800",
  },
  {
    id: "b2",
    service: "AC Gas Refill & Servicing",
    technician: "Tanvir Ahmed",
    date: "08 Nov 2026",
    status: "in-progress",
    payment: "unpaid",
    amount: "Pending",
  },
  {
    id: "b3",
    service: "LED TV Panel Diagnosis",
    technician: "Imran Hossain",
    date: "30 Oct 2026",
    status: "completed",
    payment: "paid",
    amount: "$1,200",
  },
  {
    id: "b4",
    service: "Laptop Keyboard Repair",
    technician: "Nusrat Jahan",
    date: "21 Oct 2026",
    status: "requested",
    payment: "unpaid",
    amount: "Pending",
  },
];