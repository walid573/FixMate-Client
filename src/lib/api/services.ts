'use server';

import { authFetch } from "../Session/server";


export interface AddServiceData {
  title: string;
  category: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  serviceArea: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  technicianName: string;
  technicianId: string;
  image?: string;
  availableForBooking: boolean;
}


export interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  serviceArea: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  technicianName: string;
  technicianId?: string;
  technicianEmail: string;
  image: string;
  isAvailable?: boolean;
  availableForBooking?: boolean;
  approvalStatus: string;
}





export const getFeaturedServices = async (): Promise<Service[]> => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/feature-services`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch services");
    }

    const services: Service[] = await res.json();

    return services;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
};

export interface ServiceFilters {
  technicianEmail?: string;
  technicianId?: string;
  search?: string;
  category?: string;
  mode?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  approvalStatus?: string;
  isAvailable?: boolean;
}

// ---------------------------------------------------------------------------
// Fetch services. ALL searching, filtering and sorting is done by MongoDB on
// the server — the URL params below are passed straight to GET /services and
// no .filter()/.sort() is applied to the result here.
// ---------------------------------------------------------------------------
export const getServicesByQuery = async (
  filters: ServiceFilters = {}
): Promise<Service[]> => {
  try {
    let url = `${process.env.BASE_URL}/services`;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    }
    if (params.toString()) url += `?${params.toString()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch services");
    }
    return (await res.json()) as Service[];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
};

// Technician dashboards need to see their own listings in every status
// (pending/rejected/unavailable), so send the auth token. The server scopes
// technicians to their own services; anonymous/public callers only ever get
// approved + available ones.
export const getServices = async (
  technicianEmail?: string,
  technicianId?: string
): Promise<Service[]> => {
  try {
    const params = new URLSearchParams();
    if (technicianEmail) params.set("technicianEmail", technicianEmail);
    if (technicianId) params.set("technicianId", technicianId);
    const qs = params.toString();
    const res = await authFetch(
      `${process.env.BASE_URL}/services${qs ? `?${qs}` : ""}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return (await res.json()) as Service[];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
};

// Distinct categories of bookable services — used to populate the dropdown
// on /services without fetching the whole catalogue on every keystroke.
export const getServiceCategories = async (): Promise<string[]> => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/services/categories`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return (await res.json()) as string[];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};


export const addService = async (serviceData: AddServiceData) => {
  try {
    const res = await authFetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to submit service");
    }

    return data;
  } catch (error) {
    console.error("API submission error:", error);
    throw error;
  }
};

// Public, non-sensitive technician profile shown on service detail pages.
export interface PublicTechnician {
  _id: string;
  name: string;
  image: string;
  area: string;
  bio: string;
}

export const getTechnicianProfile = async ({
  id,
  email,
}: {
  id?: string;
  email?: string;
}): Promise<PublicTechnician | null> => {
  try {
    const params = new URLSearchParams();
    if (id) params.set("id", id);
    if (email) params.set("email", email);
    if (!params.toString()) return null;

    const res = await fetch(`${process.env.BASE_URL}/technicians?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicTechnician;
  } catch (error) {
    console.error("Failed to fetch technician:", error);
    return null;
  }
};

// ---------------------------------------------------------------------------
// Fetch a single service by id (SERVER-side, used by the edit page).
// Returns null when the id is invalid or the service does not exist, so the
// page can call notFound().
// ---------------------------------------------------------------------------
export const getServiceById = async (
  id: string,
  authenticated = false
): Promise<Service | null> => {
  try {
    const url = `${process.env.BASE_URL}/services/${id}`;
    const res = authenticated
      ? await authFetch(url, { cache: "no-store" })
      : await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as Service;
  } catch (error) {
    console.error("Failed to fetch service:", error);
    return null;
  }
};

// ---------------------------------------------------------------------------
// Update a service (BROWSER-side).
//
// PATCH /services with { id, technicianId, ...updates } — the route has no
// :id, so both ids travel in the body.
//
// Two shapes are supported by the server:
//   - { availableForBooking }  -> availability toggle, approval untouched
//   - { title, category, ... } -> content edit, which RESETS approvalStatus
//     back to "pending" for a fresh admin review.
// ---------------------------------------------------------------------------
export const updateService = async (
  id: string,
  technicianId: string,
  updates: Partial<
    Pick<
      Service,
      | "title"
      | "category"
      | "description"
      | "basePrice"
      | "estimatedDuration"
      | "serviceArea"
      | "serviceMode"
      | "image"
      | "availableForBooking"
    >
  >
): Promise<Service> => {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ technicianId, ...updates }),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || "Failed to update the service."
    );
  }

  return data as Service;
};

// ---------------------------------------------------------------------------
// Delete a service (BROWSER-side).
//
// DELETE /services/:id?technicianId=... — the server re-checks ownership and
// returns 404 when the service belongs to someone else.
// ---------------------------------------------------------------------------
export const deleteService = async (
  id: string,
  technicianId: string
): Promise<void> => {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}` +
      `?technicianId=${encodeURIComponent(technicianId)}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || "Failed to delete the service."
    );
  }
};

// ---------------------------------------------------------------------------
// Approve / reject a service (ADMIN-side).
//
// PATCH /services/:id/approval with { status: "approved" | "rejected" }.
// ---------------------------------------------------------------------------
export const updateApprovalStatus = async (
  id: string,
  status: "approved" | "rejected"
): Promise<Service> => {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}/approval`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || "Failed to update approval status."
    );
  }

  return data as Service;
};
