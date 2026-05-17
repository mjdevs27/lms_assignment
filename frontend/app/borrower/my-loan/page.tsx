"use client";

import * as React from "react";
import Link from "next/link";
import { getMyLoan } from "@/lib/loan-api";
import type { Loan } from "@/types/loan.types";
import { LoanStatusTimeline } from "@/components/borrower/LoanStatusTimeline";
import { LoanDetailsCard } from "@/components/borrower/LoanDetailsCard";
import { RepaymentSummaryCard } from "@/components/borrower/RepaymentSummaryCard";
import { NoLoanState } from "@/components/borrower/NoLoanState";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ROUTES } from "@/constants/routes.constants";

export default function MyLoanPage() {
  const [loan, setLoan] = React.useState<Loan | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMyLoan();
        setLoan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load loan details.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return <LoadingState message="Loading loan details..." />;

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <PageHeader
          title="My Loan"
          description="Track your loan application and repayment status."
        />
        <Link
          href={`${ROUTES.BORROWER_HOME}/payments`}
          className="text-sm text-slate-600 underline shrink-0"
        >
          Payment History
        </Link>
      </div>

      {error && <Alert type="error" message={error} />}

      {!error && !loan && <NoLoanState />}

      {!error && loan && (
        <div className="space-y-6">
          <LoanStatusTimeline status={loan.status} />
          <LoanDetailsCard loan={loan} />
          <RepaymentSummaryCard loan={loan} />
        </div>
      )}
    </div>
  );
}
