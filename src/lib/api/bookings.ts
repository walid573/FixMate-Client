// ---------------------------------------------------------------------------
// Bookings API client.
//
// POSTs a repair request to http://localhost:8000/bookings.
//
// The payload shape below is intentionally FLAT — it mirrors exactly what
// the server-side route in FixMate-server/index.js expects:
//   - serviceId, serviceTitle, serviceImage, category, basePrice
//   - technicianName, technicianEmail
//   - customerName, customerEmail, customerPhone, address, preferredDate,
//     problemDescription
//
// The server enforces:
//   - required fields + problemDescription >= 20 chars
//   - preferredDate must be today or a future date
//   - service must exist
//   - no duplicate active booking (status requested/accepted/in-progress)
//     for the same serviceId + customerEmail -> 409 "Active booking already exists."
//
// NOTE: the backend route does exist now; if you change the server payload,
// update this interface too.
// ---------------------------------------------------------------------------

export interface CreateBookingPayload {
  serviceId: string;
  serviceTitle: string;
  serviceImage?: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status?: "requested";
  paymentStatus?: "unpaid";
}

export interface Booking extends Omit<CreateBookingPayload, "status" | "paymentStatus"> {
  _id: string;
  status: string;
  paymentStatus: string;
  finalAmount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBookingResponse {
  success?: boolean;
  message?: string;
  bookingId: string;
  booking?: Booking;
}

// ---------------------------------------------------------------------------
// Fetch bookings for a customer (server-side).
// The server route GET /bookings?email=... is not implemented yet — this
// function is wired up and ready; add the route on the backend first.
// ---------------------------------------------------------------------------

export const getBookings = async (email: string): Promise<Booking[]> => {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/bookings?email=${encodeURIComponent(email)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch bookings");
    }

    const bookings: Booking[] = await res.json();
    return bookings;
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }
};

export const createBooking = async (
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
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

// ---------------------------------------------------------------------------
// Cancel a booking.
//
// PATCH /bookings/:id/status with { status, customerEmail } — a STATUS CHANGE,
// not a delete, so the record survives and still shows on My Bookings with a
// "Cancelled" badge.
//
// The server enforces:
//   - valid ObjectId + status from an allow-list + customerEmail required
//   - the booking must belong to that customerEmail (404 otherwise)
//   - only requested / accepted / in-progress bookings can be cancelled (409)
//
// Runs in the BROWSER, so it must use NEXT_PUBLIC_API_URL (BASE_URL is
// server-only and would be undefined here).
// ---------------------------------------------------------------------------
export const cancelBooking = async (
  bookingId: string,
  customerEmail: string
): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "cancelled", customerEmail }),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || "Failed to cancel the booking."
    );
  }
};


export const deleteBookings = async()=>{
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
    method: "DELETE",
    
  }); 
}

