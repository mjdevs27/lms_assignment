import * as React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

export function NoLoanState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-slate-300 rounded-xl bg-slate-50 space-y-4">
      <h3 className="text-base font-bold text-slate-900">No loan application found</h3>
      <p className="text-sm text-slate-500 max-w-xs">
        You have not applied for a loan yet. Configure your loan and apply to get started.
      </p>
      <Link
        href={`${ROUTES.BORROWER_HOME}/apply`}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition duration-150 ease-in-out"
      >
        Apply for a Loan
      </Link>
    </div>
  );
}
