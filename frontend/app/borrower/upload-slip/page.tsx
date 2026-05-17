"use client";

import * as React from "react";
import Link from "next/link";
import { getBorrowerProfile } from "@/lib/borrower-api";
import type { BorrowerProfile } from "@/types/borrower.types";
import type { SalarySlipUploadResponse } from "@/types/upload.types";
import { SalarySlipUploadForm } from "@/components/borrower/SalarySlipUploadForm";
import { SalarySlipStatusCard } from "@/components/borrower/SalarySlipStatusCard";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ROUTES } from "@/constants/routes.constants";

export default function UploadSlipPage() {
  const [profile, setProfile] = React.useState<BorrowerProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [uploaded, setUploaded] = React.useState<SalarySlipUploadResponse | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const p = await getBorrowerProfile();
        setProfile(p);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  function handleUploaded(result: SalarySlipUploadResponse) {
    setUploaded(result);
    setSuccessMessage("Salary slip uploaded successfully.");
  }

  if (isLoading) return <LoadingState message="Loading..." />;

  return (
    <div className="space-y-8 max-w-xl">
      <PageHeader
        title="Upload Salary Slip"
        description="Upload a recent salary slip to proceed with your loan application."
      />

      {error && <Alert type="error" message={error} />}

      {!error && profile && !profile.isProfileComplete && (
        <div className="space-y-3">
          <Alert
            type="warning"
            message="Your profile is incomplete. Please complete your profile before uploading a salary slip."
          />
          <Link
            href={`${ROUTES.BORROWER_HOME}/profile`}
            className="text-sm text-slate-700 underline"
          >
            Go to Profile
          </Link>
        </div>
      )}

      {!error && profile && profile.isProfileComplete && (
        <div className="space-y-6">
          {profile.salarySlipUrl && !uploaded && (
            <SalarySlipStatusCard
              slip={{
                url: profile.salarySlipUrl,
                originalName: "Uploaded Salary Slip",
                mimeType: "",
                size: 0,
                uploadedAt: profile.salarySlipUploadedAt,
              }}
            />
          )}

          {uploaded && (
            <div className="space-y-4">
              <Alert type="success" message={successMessage || "Upload successful."} />
              <SalarySlipStatusCard slip={uploaded} />
              <Link
                href={`${ROUTES.BORROWER_HOME}/apply`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition duration-150 ease-in-out"
              >
                Continue to Loan Application
              </Link>
            </div>
          )}

          {!uploaded && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                {profile.salarySlipUrl ? "Replace Salary Slip" : "Upload Salary Slip"}
              </h3>
              <SalarySlipUploadForm onUploaded={handleUploaded} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
