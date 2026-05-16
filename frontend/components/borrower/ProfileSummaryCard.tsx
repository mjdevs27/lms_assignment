import * as React from "react";
import type { BorrowerProfile } from "@/types/borrower.types";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/LoadingState";

interface ProfileSummaryCardProps {
  profile: BorrowerProfile | null;
  isLoading?: boolean;
}

export function ProfileSummaryCard({ profile, isLoading = false }: ProfileSummaryCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <LoadingState message="Loading profile summary..." />
      </div>
    );
  }

  if (!profile) return null;

  const {
    fullName,
    email,
    pan,
    dob,
    monthlySalary,
    employmentMode,
    isProfileComplete,
  } = profile;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Profile Summary</h3>
          <p className="text-slate-500 text-xs mt-1">Your registered personal details.</p>
        </div>
        <Badge variant={isProfileComplete ? "success" : "warning"}>
          {isProfileComplete ? "Complete" : "Incomplete"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
        <div>
          <span className="block text-slate-500 font-medium text-xs">Full Name</span>
          <span className="font-semibold text-slate-900">{fullName}</span>
        </div>
        <div>
          <span className="block text-slate-500 font-medium text-xs">Email</span>
          <span className="font-semibold text-slate-900">{email || "-"}</span>
        </div>
        <div>
          <span className="block text-slate-500 font-medium text-xs">PAN Number</span>
          <span className="font-semibold text-slate-900 uppercase">{pan || "-"}</span>
        </div>
        <div>
          <span className="block text-slate-500 font-medium text-xs">Date of Birth</span>
          <span className="font-semibold text-slate-900">{dob || "-"}</span>
        </div>
        <div>
          <span className="block text-slate-500 font-medium text-xs">Monthly Salary</span>
          <span className="font-semibold text-slate-900">
            {monthlySalary !== undefined ? formatCurrency(monthlySalary) : "-"}
          </span>
        </div>
        <div>
          <span className="block text-slate-500 font-medium text-xs">Employment Mode</span>
          <span className="font-semibold text-slate-900">{employmentMode || "-"}</span>
        </div>
      </div>
    </div>
  );
}
