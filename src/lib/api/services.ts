
export const getServices = async () => {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/feature-services`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch services");
    }

    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data.map((service) => ({
      id: service._id,
      category: service.category,
      title: service.title,
      technician: service.technicianName,
      location: service.serviceArea,
      duration: service.estimatedDuration,
      price: Number(service.basePrice) || 0,
      mode: service.serviceMode,
      image: service.image || undefined,
      photoLabel: `${service.category} photo`,
    }));

  } catch (error) {
    console.error("Get services error:", error);
    return [];
  }
};
