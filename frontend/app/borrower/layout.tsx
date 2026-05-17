"use client";

import * as React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { BorrowerLayoutShell } from "@/components/layout/BorrowerLayoutShell";

export default function BorrowerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["BORROWER"]}>
      <BorrowerLayoutShell>{children}</BorrowerLayoutShell>
    </ProtectedRoute>
  );
}
