import * as React from "react";
import type { LoanStatus } from "@/types/loan.types";

interface LoanStatusTimelineProps {
  status: LoanStatus;
}

const STAGES = ["Applied", "Sanctioned", "Disbursed", "Closed"] as const;

const STATUS_STAGE_MAP: Record<LoanStatus, number> = {
  APPLIED: 0,
  SANCTIONED: 1,
  DISBURSED: 2,
  CLOSED: 3,
  REJECTED: -1,
};

export function LoanStatusTimeline({ status }: LoanStatusTimelineProps) {
  const currentStage = STATUS_STAGE_MAP[status];

  if (status === "REJECTED") {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Application Status</h3>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
          <span className="text-sm font-medium text-slate-700">Applied</span>
          <div className="h-0.5 flex-1 bg-slate-200" />
          <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
          <span className="text-sm font-medium text-red-700">Rejected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Application Status</h3>
      <div className="flex items-center">
        {STAGES.map((stage, idx) => {
          const isComplete = idx < currentStage;
          const isActive = idx === currentStage;
          return (
            <React.Fragment key={stage}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    isComplete || isActive ? "bg-slate-900" : "bg-slate-200"
                  }`}
                />
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    isActive ? "text-slate-900 font-bold" : isComplete ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {stage}
                </span>
              </div>
              {idx < STAGES.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 mb-4 ${idx < currentStage ? "bg-slate-900" : "bg-slate-200"}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
