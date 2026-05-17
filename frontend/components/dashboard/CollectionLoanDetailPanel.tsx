import * as React from "react";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OutstandingAmountCard } from "./OutstandingAmountCard";
import type { Loan } from "@/types/loan.types";

interface CollectionLoanDetailPanelProps {
  loan: Loan;
}

export function CollectionLoanDetailPanel({ loan }: CollectionLoanDetailPanelProps) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Borrower", value: loan.fullName },
    { label: "PAN", value: <span className="font-mono text-xs">{loan.pan}</span> },
    { label: "Status", value: <StatusBadge status={loan.status} /> },
    { label: "Loan Amount", value: formatCurrency(loan.loanAmount) },
    { label: "Interest Amount", value: formatCurrency(loan.interestAmount) },
    { label: "Total Repayment", value: formatCurrency(loan.totalRepayment) },
    { label: "Disbursed At", value: loan.updatedAt ? formatDateTime(loan.updatedAt) : "-" },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Loan Details</h3>
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
      <OutstandingAmountCard loan={loan} />
    </div>
  );
}
