import React from "react";

import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

const MyServicePage = () => {
  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Technician", href: "/dashboard/technician" },
          { label: "My Services" },
        ]}
        badge="Technician"
      />

      <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
        My Services
      </h1>
    </div>
  );
};

export default MyServicePage;
