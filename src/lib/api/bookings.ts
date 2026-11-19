// ---------------------------------------------------------------------------
// Bookings API client.
//
// POSTs a repair request to http://localhost:8000/bookings.
//
// NOTE: the backend route does not exist yet (the running server returns
// "Cannot POST /bookings"). This module is wired up and ready; the matching
// Express route needs to be added to FixMate-server/index.js before requests
// can actually be persisted. The payload shape below matches what the
// server-side duplicate-prevention check would need:
//   - status: "requested" | "accepted" | "in-progress" | "completed" | "cancelled"
//   - paymentStatus: "unpaid" | "paid" | "refunded"
//   - service + technician snapshots copied onto the booking document.
// ---------------------------------------------------------------------------

export interface BookingServiceSnapshot {
  serviceId: string;
  title: string;
  category: string;
  basePrice: number;
  estimatedDuration: string;
  serviceArea: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
}

export interface BookingTechnicianSnapshot {
  technicianId: string;
  technicianName: string;
  technicianArea: string;
}

export interface CreateBookingPayload {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  service: BookingServiceSnapshot;
  technician: BookingTechnicianSnapshot;
  status: "requested";
  paymentStatus: "unpaid";
}

export interface Booking extends CreateBookingPayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
  booking?: Booking;
}

export const createBooking = async (
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> => {
  const res = await fetch(`${process.env.BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Server-side duplicate-prevention failures come back here.
    throw new Error(
      (data as { message?: string }).message ||
        "Failed to submit your repair request. Please try again."
    );
  }

  return data as CreateBookingResponse;
};