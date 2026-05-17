import * as React from "react";
import Link from "next/link";

interface DashboardModuleCardProps {
  title: string;
  description: string;
  href: string;
}

export function DashboardModuleCard({ title, description, href }: DashboardModuleCardProps) {
  return (
    <Link
      href={href}
      className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition duration-150 ease-in-out block"
    >
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <p className="text-slate-500 text-sm mt-2">{description}</p>
    </Link>
  );
}
