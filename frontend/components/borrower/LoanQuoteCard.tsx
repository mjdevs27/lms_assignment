import * as React from "react";
import { formatCurrency } from "@/lib/formatters";
import type { LoanQuote } from "@/types/loan.types";

interface LoanQuoteCardProps {
  quote: LoanQuote | null;
  isLoading: boolean;
}

export function LoanQuoteCard({ quote, isLoading }: LoanQuoteCardProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loan Summary</h4>

      {isLoading && (
        <p className="text-sm text-slate-400">Calculating...</p>
      )}

      {!isLoading && !quote && (
        <p className="text-sm text-slate-400">Adjust the sliders to see loan details.</p>
      )}

      {!isLoading && quote && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-500">Loan Amount</p>
            <p className="text-sm font-bold text-slate-900">{formatCurrency(quote.loanAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Tenure</p>
            <p className="text-sm font-bold text-slate-900">{quote.tenureDays} days</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Interest Rate</p>
            <p className="text-sm font-bold text-slate-900">{quote.interestRate}% p.a.</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Interest Amount</p>
            <p className="text-sm font-bold text-slate-900">{formatCurrency(quote.interestAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Repayment</p>
            <p className="text-sm font-bold text-slate-900">{formatCurrency(quote.totalRepayment)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Outstanding</p>
            <p className="text-sm font-bold text-slate-900">{formatCurrency(quote.outstandingAmount)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
