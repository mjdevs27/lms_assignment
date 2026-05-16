"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";
import { canAccessDashboardModule } from "@/lib/permissions";

export function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const modules = [
    { name: "Overview", href: ROUTES.DASHBOARD_HOME, show: true },
    {
      name: "Sales Lead Module",
      href: ROUTES.DASHBOARD_SALES,
      show: !!(user && canAccessDashboardModule(user.role, "sales")),
    },
    {
      name: "Sanction Module",
      href: ROUTES.DASHBOARD_SANCTION,
      show: !!(user && canAccessDashboardModule(user.role, "sanction")),
    },
    {
      name: "Disbursement Module",
      href: ROUTES.DASHBOARD_DISBURSEMENT,
      show: !!(user && canAccessDashboardModule(user.role, "disbursement")),
    },
    {
      name: "Collection Module",
      href: ROUTES.DASHBOARD_COLLECTION,
      show: !!(user && canAccessDashboardModule(user.role, "collection")),
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-16 h-[calc(100vh-4rem)]">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {modules
          .filter((mod) => mod.show)
          .map((mod) => {
            const isActive = pathname === mod.href;
            return (
              <Link
                key={mod.name}
                href={mod.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition duration-150 ease-in-out ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {mod.name}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
