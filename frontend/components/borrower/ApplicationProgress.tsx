import * as React from "react";

interface ApplicationProgressProps {
  profileComplete?: boolean;
  salarySlipUploaded?: boolean;
  loanApplied?: boolean;
}

export function ApplicationProgress({
  profileComplete = false,
  salarySlipUploaded = false,
  loanApplied = false,
}: ApplicationProgressProps) {
  const steps = [
    { name: "Profile", status: profileComplete ? "Completed" : "Pending" },
    { name: "Salary Slip", status: salarySlipUploaded ? "Completed" : "Pending" },
    { name: "Loan Application", status: loanApplied ? "Completed" : "Pending" },
    { name: "Loan Status", status: "Pending" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Application Progress
      </h3>
      
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, idx) => (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center flex-1">
              <span className="text-sm font-bold text-slate-900">{step.name}</span>
              <span
                className={`mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  step.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {step.status}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="h-0.5 w-16 bg-slate-200 self-center" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-3">
        {steps.map((step) => (
          <div key={step.name} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-sm font-bold text-slate-900">{step.name}</span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                step.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {step.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
