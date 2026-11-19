
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
  image: string;
  approvalStatus: string;
}

export const getFeaturedServices = async (): Promise<Service[]> => {
  try {
    const res = await fetch("http://localhost:8000/feature-services", {
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
    const res = await fetch("http://localhost:8000/services", {
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