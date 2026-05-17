"use client";

import * as React from "react";
import Link from "next/link";
import { getBorrowerProfile } from "@/lib/borrower-api";
import { getMyLoan } from "@/lib/loan-api";
import type { BorrowerProfile } from "@/types/borrower.types";
import type { Loan } from "@/types/loan.types";
import { LoanApplyForm } from "@/components/borrower/LoanApplyForm";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes.constants";

const ACTIVE_STATUSES: Loan["status"][] = ["APPLIED", "SANCTIONED", "DISBURSED"];

export default function ApplyPage() {
  const [profile, setProfile] = React.useState<BorrowerProfile | null>(null);
  const [existingLoan, setExistingLoan] = React.useState<Loan | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [p, loan] = await Promise.all([getBorrowerProfile(), getMyLoan()]);
        setProfile(p);
        setExistingLoan(loan);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return <LoadingState message="Loading..." />;

  const hasActiveLoan = existingLoan && ACTIVE_STATUSES.includes(existingLoan.status);

  return (
    <div className="space-y-8 max-w-xl">
      <PageHeader
        title="Apply for a Loan"
        description="Configure your loan amount and tenure to get started."
      />

      {error && <Alert type="error" message={error} />}

      {!error && profile && !profile.isProfileComplete && (
        <div className="space-y-3">
          <Alert type="warning" message="Your profile is incomplete. Please complete your profile first." />
          <Link href={`${ROUTES.BORROWER_HOME}/profile`} className="text-sm text-slate-700 underline">
            Go to Profile
          </Link>
        </div>
      )}

      {!error && profile && profile.isProfileComplete && !profile.salarySlipUrl && (
        <div className="space-y-3">
          <Alert type="warning" message="Please upload your salary slip before applying for a loan." />
          <Link href={`${ROUTES.BORROWER_HOME}/upload-slip`} className="text-sm text-slate-700 underline">
            Upload Salary Slip
          </Link>
        </div>
      )}

      {!error && profile && profile.isProfileComplete && profile.salarySlipUrl && hasActiveLoan && (
        <div className="space-y-4">
          <Alert type="info" message="You already have an active loan application." />
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Loan Status</span>
              <StatusBadge status={existingLoan.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Amount</span>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(existingLoan.loanAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Applied</span>
              <span className="text-sm text-slate-700">{formatDateTime(existingLoan.createdAt || "")}</span>
            </div>
          </div>
          <Link
            href={`${ROUTES.BORROWER_HOME}/my-loan`}
            className="text-sm text-slate-700 underline"
          >
            View My Loan
          </Link>
        </div>
      )}

      {!error && profile && profile.isProfileComplete && profile.salarySlipUrl && !hasActiveLoan && (
        <LoanApplyForm />
      )}
    </div>
  );
}
