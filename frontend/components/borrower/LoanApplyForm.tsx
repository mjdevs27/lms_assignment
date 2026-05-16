"use client";

import * as React from "react";
import { LoanAmountSlider } from "./LoanAmountSlider";
import { TenureSlider } from "./TenureSlider";
import { LoanQuoteCard } from "./LoanQuoteCard";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { getLoanQuote, applyForLoan } from "@/lib/loan-api";
import type { LoanQuote } from "@/types/loan.types";
import { FrontendApiError } from "@/lib/api";
import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";
import { useRouter } from "next/navigation";

export function LoanApplyForm() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = React.useState(100000);
  const [tenureDays, setTenureDays] = React.useState(90);
  const [quote, setQuote] = React.useState<LoanQuote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = React.useState(false);
  const [quoteError, setQuoteError] = React.useState<string | null>(null);
  const [applyError, setApplyError] = React.useState<string | null>(null);
  const [isApplying, setIsApplying] = React.useState(false);
  const [activeLoanConflict, setActiveLoanConflict] = React.useState(false);

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchQuote(loanAmount, tenureDays);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [loanAmount, tenureDays]);

  async function fetchQuote(amount: number, tenure: number) {
    setIsQuoteLoading(true);
    setQuoteError(null);
    try {
      const result = await getLoanQuote({ loanAmount: amount, tenureDays: tenure });
      setQuote(result);
    } catch (err) {
      if (err instanceof Error) {
        setQuoteError(err.message);
      } else {
        setQuoteError("Failed to fetch quote.");
      }
      setQuote(null);
    } finally {
      setIsQuoteLoading(false);
    }
  }

  async function handleApply() {
    setIsApplying(true);
    setApplyError(null);
    setActiveLoanConflict(false);
    try {
      await applyForLoan({ loanAmount, tenureDays });
      router.push(`${ROUTES.BORROWER_HOME}/my-loan`);
    } catch (err) {
      if (err instanceof FrontendApiError && err.status === 409) {
        setActiveLoanConflict(true);
      } else if (err instanceof Error) {
        setApplyError(err.message);
      } else {
        setApplyError("Failed to apply for loan. Please try again.");
      }
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
        <LoanAmountSlider
          value={loanAmount}
          onChange={setLoanAmount}
          min={50000}
          max={500000}
          step={10000}
        />

        <TenureSlider
          value={tenureDays}
          onChange={setTenureDays}
          min={30}
          max={365}
          step={1}
        />

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-medium">Interest Rate</span>
          <span className="font-bold text-slate-900">12% p.a. (fixed)</span>
        </div>

        {quoteError && <Alert type="error" message={quoteError} />}

        <LoanQuoteCard quote={quote} isLoading={isQuoteLoading} />
      </div>

      {activeLoanConflict && (
        <Alert
          type="error"
          message="You already have an active loan. View your existing loan before applying again."
        />
      )}

      {activeLoanConflict && (
        <Link
          href={`${ROUTES.BORROWER_HOME}/my-loan`}
          className="text-sm text-slate-700 underline"
        >
          View My Loan
        </Link>
      )}

      {applyError && <Alert type="error" message={applyError} />}

      <Button
        onClick={handleApply}
        disabled={!quote || isQuoteLoading || isApplying}
        isLoading={isApplying}
        size="lg"
      >
        Apply for Loan
      </Button>
    </div>
  );
}
