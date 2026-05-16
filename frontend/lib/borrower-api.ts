import type { ApiResponse } from "@/types/api.types";
import type { BorrowerProfile, BorrowerProfilePayload, EligibilityResult, BreFailure } from "@/types/borrower.types";
import { apiRequest, FrontendApiError } from "./api";

interface RawBorrowerProfile {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  pan?: string;
  dob?: string;
  monthlySalary?: number;
  employmentMode?: "SALARIED" | "SELF_EMPLOYED" | "UNEMPLOYED";
  isProfileComplete?: boolean;
  eligibilityStatus?: string;
  salarySlipUrl?: string;
  salarySlipUploadedAt?: string;
}

function normalizeProfile(user: RawBorrowerProfile): BorrowerProfile {
  if (!user) {
    throw new Error("Profile details not found.");
  }
  const profileId = user.id || user._id;
  return {
    id: profileId,
    fullName: user.fullName || "",
    email: user.email || "",
    pan: user.pan || "",
    dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    monthlySalary: user.monthlySalary || 0,
    employmentMode: user.employmentMode || "UNEMPLOYED",
    isProfileComplete: user.isProfileComplete || false,
    eligibilityStatus: user.eligibilityStatus || "PENDING",
    salarySlipUrl: user.salarySlipUrl || "",
    salarySlipUploadedAt: user.salarySlipUploadedAt || "",
  };
}

export async function getBorrowerProfile(): Promise<BorrowerProfile> {
  const res = await apiRequest<ApiResponse<{ user: RawBorrowerProfile }>>("/borrower/profile");
  if (!res.success || !res.data?.user) {
    throw new Error(res.message || "Failed to fetch profile");
  }
  return normalizeProfile(res.data.user);
}

export async function checkEligibility(payload: BorrowerProfilePayload): Promise<EligibilityResult> {
  try {
    const res = await apiRequest<ApiResponse<{ eligible: boolean; failures: BreFailure[] }>>("/borrower/eligibility-check", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return {
      eligible: res.data?.eligible ?? true,
      failures: res.data?.failures || [],
    };
  } catch (error: unknown) {
    if (error instanceof FrontendApiError && error.status === 400 && error.errors) {
      return {
        eligible: false,
        failures: error.errors as BreFailure[],
      };
    }
    throw error;
  }
}

export async function saveBorrowerProfile(payload: BorrowerProfilePayload): Promise<BorrowerProfile> {
  const res = await apiRequest<ApiResponse<{ user: RawBorrowerProfile }>>("/borrower/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.success || !res.data?.user) {
    throw new Error(res.message || "Failed to save profile");
  }
  return normalizeProfile(res.data.user);
}
