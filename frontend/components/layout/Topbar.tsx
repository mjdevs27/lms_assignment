"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/routes.constants";

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center">
        <span className="text-lg font-bold text-slate-900 tracking-tight">
          {APP_NAME}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end text-xs">
          <span className="font-semibold text-slate-900">{user?.fullName}</span>
          <span className="text-slate-500">{user?.role}</span>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-hidden transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
