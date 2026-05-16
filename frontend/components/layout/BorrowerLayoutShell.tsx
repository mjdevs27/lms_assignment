"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/routes.constants";

export function BorrowerLayoutShell({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const navLinks = [
    { name: "Home", href: ROUTES.BORROWER_HOME },
    { name: "Profile", href: `${ROUTES.BORROWER_HOME}/profile` },
    { name: "Upload Slip", href: `${ROUTES.BORROWER_HOME}/upload-slip` },
    { name: "Apply", href: `${ROUTES.BORROWER_HOME}/apply` },
    { name: "My Loan", href: `${ROUTES.BORROWER_HOME}/my-loan` },
    { name: "Payments", href: `${ROUTES.BORROWER_HOME}/payments` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href={ROUTES.BORROWER_HOME} className="text-xl font-bold text-slate-900 tracking-tight">
                {APP_NAME}
              </Link>
              <nav className="hidden md:flex space-x-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out ${
                        isActive
                          ? "bg-slate-100 text-slate-900 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-semibold text-slate-900">{user?.fullName}</span>
                <span className="text-slate-500">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-hidden transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Nav Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 overflow-x-auto flex space-x-2 px-4 py-2 sticky top-16 z-10">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`whitespace-nowrap px-3 py-1 text-xs font-medium rounded-md transition duration-150 ease-in-out ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
