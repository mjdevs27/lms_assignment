"use client";

import * as React from "react";
import { Topbar } from "./Topbar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Topbar />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
