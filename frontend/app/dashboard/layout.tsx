"use client";

import * as React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayoutShell } from "@/components/layout/DashboardLayoutShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SALES", "SANCTION", "DISBURSEMENT", "COLLECTION"]}>
      <DashboardLayoutShell>{children}</DashboardLayoutShell>
    </ProtectedRoute>
  );
}
