"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardModulesForRole } from "@/lib/permissions";
import { ROUTES } from "@/constants/routes.constants";
import { LoadingState } from "@/components/ui/LoadingState";

const MODULE_META = {
  sales: {
    title: "Sales Lead Module",
    description: "View and progress loan applications inside the sales pipeline.",
    href: ROUTES.DASHBOARD_SALES,
  },
  sanction: {
    title: "Sanction Module",
    description: "Assess borrower profiles and decide loan sanctioning limits.",
    href: ROUTES.DASHBOARD_SANCTION,
  },
  disbursement: {
    title: "Disbursement Module",
    description: "Manage loan disbursements, documents upload, and payment triggers.",
    href: ROUTES.DASHBOARD_DISBURSEMENT,
  },
  collection: {
    title: "Collection Module",
    description: "Track outstanding EMI payments, collection dates, and borrower status.",
    href: ROUTES.DASHBOARD_COLLECTION,
  },
} as const;

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <LoadingState message="Loading dashboard..." />;
  }

  const modules = getDashboardModulesForRole(user.role);
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isAdmin ? "Admin Dashboard Overview" : "Dashboard"}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isAdmin
            ? "Access and manage the internal operations modules."
            : "Access your assigned module below."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const meta = MODULE_META[mod];
          return (
            <Link
              key={mod}
              href={meta.href}
              className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition duration-150 ease-in-out"
            >
              <h2 className="text-lg font-bold text-slate-950">{meta.title}</h2>
              <p className="text-slate-500 text-sm mt-2">{meta.description}</p>
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href={ROUTES.DASHBOARD_USERS}
            className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition duration-150 ease-in-out"
          >
            <h2 className="text-lg font-bold text-slate-950">User Management</h2>
            <p className="text-slate-500 text-sm mt-2">
              Create and manage staff accounts for Sales, Sanction, Disbursement, and Collection roles.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
