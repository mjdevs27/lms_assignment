import * as React from "react";
import { formatDateTime } from "@/lib/formatters";
import type { SalarySlipUploadResponse } from "@/types/upload.types";

interface SalarySlipStatusCardProps {
  slip: SalarySlipUploadResponse;
}

export function SalarySlipStatusCard({ slip }: SalarySlipStatusCardProps) {
  const sizeKb = (slip.size / 1024).toFixed(1);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
        Uploaded Salary Slip
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 font-medium">File Name</p>
          <p className="text-sm text-slate-900 font-semibold mt-0.5 break-all">{slip.originalName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Type</p>
          <p className="text-sm text-slate-900 font-semibold mt-0.5">{slip.mimeType}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Size</p>
          <p className="text-sm text-slate-900 font-semibold mt-0.5">{sizeKb} KB</p>
        </div>
        {slip.uploadedAt && (
          <div>
            <p className="text-xs text-slate-500 font-medium">Uploaded At</p>
            <p className="text-sm text-slate-900 font-semibold mt-0.5">{formatDateTime(slip.uploadedAt)}</p>
          </div>
        )}
      </div>

      {slip.url && (
        <a
          href={slip.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-slate-700 underline hover:text-slate-900"
        >
          View File
        </a>
      )}
    </div>
  );
}
