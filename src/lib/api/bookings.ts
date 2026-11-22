'use server'
import { revalidatePath } from "next/cache";
import { authFetch } from "../Session/server";




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


export const getBookings = async (
  email?: string,
  technicianEmail?: string
): Promise<Booking[]> => {
  try {
    // Dedicated, role-protected routes derive the identity from the JWT, so
    // changing the email in a URL can never expose another user's bookings.
    const path = technicianEmail
      ? "/bookings/technician"
      : "/bookings/my";

    const res = await authFetch(path);

    if (!res.ok) {
      throw new Error(`Failed to fetch bookings (HTTP ${res.status} from ${res.url})`);
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
  const res = await authFetch(`/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message ||
        "Failed to submit your repair request. Please try again."
    );
  }

  // Drop cached dashboard pages so the new booking shows up immediately.
  revalidatePath("/dashboard", "layout");

  return data as CreateBookingResponse;
};

export const cancelBooking = async (
  bookingId: string,
  customerEmail: string
): Promise<void> => {
  // The protected customer-only endpoint derives the email from the session;
  // the argument is kept for backwards compatibility with existing callers.
  void customerEmail;
  const res = await authFetch(`/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || "Failed to cancel the booking."
    );
  }

  revalidatePath("/dashboard", "layout");
};


export const deleteBookings = async()=>{
const res = await authFetch(`/bookings`, {
    method: "DELETE",
    
  }); 
}



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

  const res = await authFetch(
    `/bookings/${bookingId}/status`,
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

  revalidatePath("/dashboard", "layout");
};

