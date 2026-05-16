import * as React from "react";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "muted" | "info";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  const getStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-amber-100 text-amber-800";
      case "danger":
        return "bg-red-100 text-red-800";
      case "muted":
        return "bg-slate-100 text-slate-600";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "default":
      default:
        return "bg-slate-900 text-white";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStyles()} ${className}`}>
      {children}
    </span>
  );
}
