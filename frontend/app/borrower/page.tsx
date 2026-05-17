"use client";

import * as React from "react";
import { getBorrowerProfile } from "@/lib/borrower-api";
import { getMyLoan } from "@/lib/loan-api";
import type { BorrowerProfile } from "@/types/borrower.types";
import type { Loan } from "@/types/loan.types";
import { ApplicationProgress } from "@/components/borrower/ApplicationProgress";
import { ProfileSummaryCard } from "@/components/borrower/ProfileSummaryCard";
import { BorrowerNextStepCard } from "@/components/borrower/BorrowerNextStepCard";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";

export default function BorrowerPage() {
  const [profile, setProfile] = React.useState<BorrowerProfile | null>(null);
  const [loan, setLoan] = React.useState<Loan | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [data, loanData] = await Promise.all([getBorrowerProfile(), getMyLoan().catch(() => null)]);
        setProfile(data);
        setLoan(loanData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load profile details.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading your portal..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Borrower Portal"
        description="Complete your loan application step by step."
      />

      {error && <Alert type="error" message={error} />}

      {!error && profile && (
        <div className="grid grid-cols-1 gap-8">
          <ApplicationProgress
            profileComplete={profile.isProfileComplete}
            salarySlipUploaded={!!profile.salarySlipUrl}
            loanApplied={!!loan}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProfileSummaryCard profile={profile} />
            <BorrowerNextStepCard
              profileComplete={profile.isProfileComplete}
              salarySlipUploaded={!!profile.salarySlipUrl}
              loanExists={!!loan}
            />
          </div>
        </div>
      )}
    </div>
  );
}
