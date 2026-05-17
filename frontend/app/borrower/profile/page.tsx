"use client";

import * as React from "react";
import { getBorrowerProfile } from "@/lib/borrower-api";
import type { BorrowerProfile } from "@/types/borrower.types";
import { BorrowerProfileForm } from "@/components/borrower/BorrowerProfileForm";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";

export default function BorrowerProfilePage() {
  const [profile, setProfile] = React.useState<BorrowerProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProfile = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBorrowerProfile();
      setProfile(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load profile details.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    const run = async () => {
      await Promise.resolve();
      if (!active) return;
      fetchProfile();
    };
    run();
    return () => {
      active = false;
    };
  }, [fetchProfile]);

  const handleSuccess = (updatedProfile: BorrowerProfile) => {
    setProfile(updatedProfile);
  };

  if (isLoading) {
    return <LoadingState message="Loading your profile form..." />;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="Borrower Profile"
        description="Verify your details and validate loan rules eligibility."
      />

      {error && <Alert type="error" message={error} />}

      {!error && (
        <Card>
          <CardContent>
            <BorrowerProfileForm
              key={profile?.id || "empty"}
              initialProfile={profile}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
