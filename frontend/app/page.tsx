"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APP_NAME, APP_DESCRIPTION } from "@/constants/app.constants";
import { ROUTES } from "@/constants/routes.constants";
import { useAuth } from "@/hooks/useAuth";
import { getDefaultRouteForRole } from "@/lib/role-redirect";

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(getDefaultRouteForRole(user.role));
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-slate-50 font-sans p-6">
      <main className="w-full max-w-md bg-white border border-slate-200 shadow-xs rounded-xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {APP_NAME}
        </h1>
        <p className="mt-4 text-slate-600 text-sm leading-relaxed">
          {APP_DESCRIPTION}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={ROUTES.LOGIN}
            className="flex items-center justify-center w-full py-2.5 px-4 rounded-md shadow-xs text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition duration-150 ease-in-out"
          >
            Login
          </Link>
          <Link
            href={ROUTES.SIGNUP}
            className="flex items-center justify-center w-full py-2.5 px-4 rounded-md shadow-xs text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition duration-150 ease-in-out"
          >
            Signup
          </Link>
        </div>
      </main>
    </div>
  );
}
