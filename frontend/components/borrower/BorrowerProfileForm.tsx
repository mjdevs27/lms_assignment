"use client";

import * as React from "react";
import type { BorrowerProfile, BorrowerProfilePayload, BreFailure, EmploymentMode } from "@/types/borrower.types";
import { checkEligibility, saveBorrowerProfile } from "@/lib/borrower-api";
import { Input, Select, Button, Alert } from "@/components/ui";
import { BreFailureList } from "./BreFailureList";
import { FrontendApiError } from "@/lib/api";

interface BorrowerProfileFormProps {
  initialProfile: BorrowerProfile | null;
  onSuccess?: (updatedProfile: BorrowerProfile) => void;
}

export function BorrowerProfileForm({ initialProfile, onSuccess }: BorrowerProfileFormProps) {
  const [fullName, setFullName] = React.useState(initialProfile?.fullName || "");
  const [pan, setPan] = React.useState(initialProfile?.pan || "");
  const [dob, setDob] = React.useState(initialProfile?.dob || "");
  const [monthlySalary, setMonthlySalary] = React.useState(
    initialProfile?.monthlySalary !== undefined ? String(initialProfile.monthlySalary) : ""
  );
  const [employmentMode, setEmploymentMode] = React.useState<string>(
    initialProfile?.employmentMode || "SALARIED"
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [breFailures, setBreFailures] = React.useState<BreFailure[]>([]);

  const validateForm = () => {
    if (!fullName.trim()) return "Full name is required.";
    if (!pan.trim()) return "PAN number is required.";
    if (!dob.trim()) return "Date of birth is required.";
    if (!monthlySalary.trim()) return "Monthly salary is required.";
    
    const salaryVal = Number(monthlySalary);
    if (isNaN(salaryVal) || salaryVal < 0) {
      return "Monthly salary must be a positive number.";
    }

    return null;
  };

  const getPayload = (): BorrowerProfilePayload => {
    return {
      fullName: fullName.trim(),
      pan: pan.trim().toUpperCase(),
      dob: dob.trim(),
      monthlySalary: Number(monthlySalary),
      employmentMode: employmentMode as EmploymentMode,
    };
  };

  const handleCheckEligibility = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setBreFailures([]);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const payload = getPayload();
      const result = await checkEligibility(payload);
      if (result.eligible) {
        setSuccessMessage("Applicant is eligible. You can now save your profile.");
      } else {
        setBreFailures(result.failures || []);
        setErrorMessage("Eligibility check failed. Please review the failures below.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An error occurred during eligibility check.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setBreFailures([]);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const payload = getPayload();
      const updated = await saveBorrowerProfile(payload);
      setSuccessMessage("Profile saved successfully.");
      if (onSuccess) {
        onSuccess(updated);
      }
    } catch (err: unknown) {
      if (err instanceof FrontendApiError && err.status === 400 && err.errors) {
        setBreFailures(err.errors as BreFailure[]);
        setErrorMessage("Profile save blocked. Applicant is not eligible.");
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An error occurred while saving profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const employmentOptions = [
    { label: "Salaried", value: "SALARIED" },
    { label: "Self-Employed", value: "SELF_EMPLOYED" },
    { label: "Unemployed", value: "UNEMPLOYED" },
  ];

  return (
    <form onSubmit={handleSaveProfile} className="space-y-6">
      {errorMessage && <Alert type="error" message={errorMessage} />}
      {successMessage && <Alert type="success" message={successMessage} />}
      <BreFailureList failures={breFailures} />

      <div className="space-y-4">
        <Input
          label="Full Name"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
          required
        />

        <Input
          label="PAN Number"
          id="pan"
          value={pan}
          onChange={(e) => setPan(e.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
          disabled={isLoading}
          required
        />

        <Input
          label="Date of Birth"
          id="dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          disabled={isLoading}
          required
        />

        <Input
          label="Monthly Salary (INR)"
          id="monthlySalary"
          type="number"
          value={monthlySalary}
          onChange={(e) => setMonthlySalary(e.target.value)}
          disabled={isLoading}
          required
        />

        <Select
          label="Employment Mode"
          id="employmentMode"
          options={employmentOptions}
          value={employmentMode}
          onChange={(e) => setEmploymentMode(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleCheckEligibility}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Check Eligibility
        </Button>
        <Button
          type="submit"
          className="flex-1"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Save Profile
        </Button>
      </div>
    </form>
  );
}
