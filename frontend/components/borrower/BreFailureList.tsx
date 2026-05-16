import * as React from "react";
import type { BreFailure } from "@/types/borrower.types";

interface BreFailureListProps {
  failures: BreFailure[];
}

export function BreFailureList({ failures }: BreFailureListProps) {
  if (!failures || failures.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 space-y-2">
      <p className="font-bold">Eligibility Check Failures:</p>
      <ul className="list-disc list-inside space-y-1 text-xs">
        {failures.map((fail, idx) => (
          <li key={idx}>
            <span className="font-semibold uppercase">{fail.field || "rule"}:</span> {fail.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
