import React from "react";

import DashboardBreadcrumb from "@/components/layout/DashboardBreadcrumb";

const AdminPage = () => {
  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[{ label: "Admin" }, { label: "Overview" }]}
        badge="Admin"
      />

      <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
        Admin Overview
      </h1>
    </div>
  );
};

export default AdminPage;
