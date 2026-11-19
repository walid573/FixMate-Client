import React from "react";

import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

const BookingRequestPage = () => {
  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Technician", href: "/dashboard/technician" },
          { label: "Booking Requests" },
        ]}
        badge="Technician"
      />

      <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
        Booking Requests
      </h1>
    </div>
  );
};

export default BookingRequestPage;
