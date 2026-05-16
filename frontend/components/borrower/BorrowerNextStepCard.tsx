import * as React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

interface BorrowerNextStepCardProps {
  profileComplete?: boolean;
  salarySlipUploaded?: boolean;
  loanExists?: boolean;
}

export function BorrowerNextStepCard({
  profileComplete = false,
  salarySlipUploaded = false,
  loanExists = false,
}: BorrowerNextStepCardProps) {
  const getNextStepDetails = () => {
    if (!profileComplete) {
      return {
        title: "Complete Your Profile",
        description: "Submit your personal, PAN, salary, and age details to check eligibility rules.",
        buttonText: "Go to Profile",
        href: `${ROUTES.BORROWER_HOME}/profile`,
      };
    }
    if (!salarySlipUploaded) {
      return {
        title: "Upload Your Salary Slip",
        description: "Your profile is verified. Please upload your recent salary slip PDF to continue.",
        buttonText: "Upload Salary Slip",
        href: `${ROUTES.BORROWER_HOME}/upload-slip`,
      };
    }
    if (!loanExists) {
      return {
        title: "Apply For A Loan",
        description: "Everything is set up. Specify your loan details to request credit validation.",
        buttonText: "Apply Now",
        href: `${ROUTES.BORROWER_HOME}/apply`,
      };
    }
    return {
      title: "Track Your Loan",
      description: "Your loan application is active. Check the current status and repayment details.",
      buttonText: "View My Loan",
      href: `${ROUTES.BORROWER_HOME}/my-loan`,
    };
  };

  const step = getNextStepDetails();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Next Step</h3>
        <p className="text-slate-500 text-xs mt-1">Actions required to progress your application.</p>
      </div>

      <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-3">
        <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
        <p className="text-slate-600 text-xs leading-relaxed">{step.description}</p>
        <div className="pt-1">
          <Link
            href={step.href}
            className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition duration-150 ease-in-out"
          >
            {step.buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
