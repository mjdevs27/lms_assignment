import * as React from "react";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Loan } from "@/types/loan.types";

interface LoanDetailsCardProps {
  loan: Loan;
}

export function LoanDetailsCard({ loan }: LoanDetailsCardProps) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Status", value: <StatusBadge status={loan.status} /> },
    { label: "Loan Amount", value: formatCurrency(loan.loanAmount) },
    { label: "Tenure", value: `${loan.tenureDays} days` },
    { label: "Interest Rate", value: `${loan.interestRate}% p.a.` },
    { label: "Interest Amount", value: formatCurrency(loan.interestAmount) },
    { label: "Total Repayment", value: formatCurrency(loan.totalRepayment) },
    { label: "Applied", value: loan.createdAt ? formatDateTime(loan.createdAt) : "-" },
  ];

  if (loan.rejectionReason) {
    rows.push({ label: "Rejection Reason", value: <span className="text-red-700">{loan.rejectionReason}</span> });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Loan Details</h3>
        <p className="text-sm text-slate-500 mt-1">{loan.fullName}</p>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-center px-6 py-3">
            <span className="text-sm text-slate-500">{row.label}</span>
            <span className="text-sm font-semibold text-slate-900 text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
