import * as React from "react";
import { formatCurrency } from "@/lib/formatters";
import type { Loan } from "@/types/loan.types";

interface RepaymentSummaryCardProps {
  loan: Loan;
}

export function RepaymentSummaryCard({ loan }: RepaymentSummaryCardProps) {
  const raw = loan.totalRepayment > 0 ? (loan.totalPaid / loan.totalRepayment) * 100 : 0;
  const progress = Math.min(100, Math.max(0, raw));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Repayment Summary</h3>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-slate-500">Total Repayment</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{formatCurrency(loan.totalRepayment)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Paid</p>
          <p className="text-sm font-bold text-green-700 mt-0.5">{formatCurrency(loan.totalPaid)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Outstanding</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{formatCurrency(loan.outstandingAmount)}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-slate-900 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
