import * as React from "react";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import type { SalesLead } from "@/types/dashboard.types";

interface LeadDetailsPanelProps {
  lead: SalesLead;
}

export function LeadDetailsPanel({ lead }: LeadDetailsPanelProps) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Name", value: lead.fullName },
    { label: "Email", value: lead.email },
    { label: "PAN", value: lead.pan ? <span className="font-mono text-xs">{lead.pan}</span> : "-" },
    { label: "Monthly Salary", value: lead.monthlySalary ? formatCurrency(lead.monthlySalary) : "-" },
    { label: "Employment", value: lead.employmentMode || "-" },
    {
      label: "Profile Status",
      value: (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${lead.isProfileComplete ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>
          {lead.isProfileComplete ? "Complete" : "Incomplete"}
        </span>
      ),
    },
    {
      label: "Salary Slip",
      value: lead.salarySlipUploaded ? (
        lead.salarySlipUrl ? (
          <a href={lead.salarySlipUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline text-slate-700">
            View
          </a>
        ) : (
          "Uploaded"
        )
      ) : "Not Uploaded",
    },
    { label: "Registered", value: lead.createdAt ? formatDateTime(lead.createdAt) : "-" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-900">Lead Details</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-center px-5 py-2.5">
            <span className="text-xs text-slate-500">{row.label}</span>
            <span className="text-xs font-semibold text-slate-900 text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
