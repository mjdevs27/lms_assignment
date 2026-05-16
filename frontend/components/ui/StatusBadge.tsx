import * as React from "react";
import { Badge } from "./Badge";

interface StatusBadgeProps {
  status: "APPLIED" | "SANCTIONED" | "REJECTED" | "DISBURSED" | "CLOSED" | string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getVariant = (): "default" | "success" | "warning" | "danger" | "muted" | "info" => {
    switch (status) {
      case "CLOSED":
        return "success";
      case "APPLIED":
        return "warning";
      case "REJECTED":
        return "danger";
      case "SANCTIONED":
        return "info";
      case "DISBURSED":
        return "default";
      default:
        return "muted";
    }
  };

  return (
    <Badge
      variant={getVariant()}
      className={className}
    >
      {status}
    </Badge>
  );
}
