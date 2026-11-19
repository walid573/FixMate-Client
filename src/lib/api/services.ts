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

// ---------------------------------------------------------------------------
// Convenience view model for the "Featured Services" component on the homepage.
// It maps the raw API shape to the friendly field names that component uses.
// ---------------------------------------------------------------------------


export const getServices = async (): Promise<Service[]> => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/services`, {
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


export const addService = async (serviceData: AddServiceData) => {
  try {
    const res = await fetch(
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
