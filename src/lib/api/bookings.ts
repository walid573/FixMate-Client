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
// Fetch bookings for a customer (server-side) OR a technician.
// The route GET /bookings?email=... OR GET /bookings?technicianEmail=...
// is now implemented.
// ---------------------------------------------------------------------------

export const getBookings = async (
  email?: string,
  technicianEmail?: string
): Promise<Booking[]> => {
  try {
    let url = `${process.env.BASE_URL}/bookings?`;
    if (email) url += `email=${encodeURIComponent(email)}`;
    else if (technicianEmail)
      url += `technicianEmail=${encodeURIComponent(technicianEmail)}`;

    const res = await fetch(url, { cache: "no-store" });

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

// ---------------------------------------------------------------------------
// Technician booking actions.
//
// PATCH /bookings/:id/status with { status, technicianEmail, finalAmount? }
// — the SAME route the customer cancel flow uses, but ownership is checked
// against technicianEmail and the new status walks the transition ladder:
//   requested  -> accepted / rejected
//   accepted   -> in-progress / rejected
//   in-progress-> completed / rejected
//
// `finalAmount` is OPTIONAL — it is only meaningful when marking a job
// "completed" (the technician sets the final price). The server ignores it
// for every other transition.
//
// Terminal states (completed / cancelled / rejected) can never be changed.
//
// Runs in the BROWSER, so it must use NEXT_PUBLIC_API_URL.
// ---------------------------------------------------------------------------
export const updateBookingStatus = async (
  bookingId: string,
  technicianEmail: string,
  status: "accepted" | "in-progress" | "completed" | "rejected",
  finalAmount?: number
): Promise<void> => {
  const body: Record<string, unknown> = { status, technicianEmail };
  if (finalAmount !== undefined) {
    body.finalAmount = finalAmount;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || "Failed to update the booking."
    );
  }
};

// ---------------------------------------------------------------------------
// Edit the final amount of a completed, not-yet-paid booking.
//
// PATCH /bookings/:id/final-amount with { technicianEmail, finalAmount }
// The server rejects $0 / non-numeric amounts, calls from anyone but the
// booking's technician, jobs that aren't completed, and jobs that are
// already paid (the price is locked once the customer settles).
//
// Runs in the BROWSER, so it must use NEXT_PUBLIC_API_URL.
// ---------------------------------------------------------------------------
export const updateFinalAmount = async (
  bookingId: string,
  technicianEmail: string,
  finalAmount: number
): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/final-amount`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ technicianEmail, finalAmount }),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || "Failed to update the amount."
    );
  }
};

