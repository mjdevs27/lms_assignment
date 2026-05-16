import * as React from "react";
import { APP_NAME } from "@/constants/app.constants";
import { Card } from "../ui/Card";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <h1 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          {APP_NAME}
        </h1>
        <h2 className="mt-6 text-center text-xl font-bold text-slate-700">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card>
          {children}
        </Card>
      </div>
    </div>
  );
}
