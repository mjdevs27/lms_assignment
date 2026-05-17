"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { disburseLoan } from "@/lib/dashboard-api";
import { FrontendApiError } from "@/lib/api";
import type { Loan } from "@/types/loan.types";

interface DisburseModalProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DisburseModal({ loan, isOpen, onClose, onSuccess }: DisburseModalProps) {
  const [remarks, setRemarks] = React.useState("");
  const [reference, setReference] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleDisburse() {
    setIsLoading(true);
    setError(null);
    try {
      await disburseLoan(loan.id, {
        remarks: remarks.trim() || undefined,
        disbursementReference: reference.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof FrontendApiError || err instanceof Error ? (err as Error).message : "Failed to disburse loan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Mark Loan as Disbursed"
      description={`Confirm disbursement for ${loan.fullName}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="primary" onClick={handleDisburse} isLoading={isLoading}>Confirm Disbursement</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Disbursement Reference (optional)</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. NEFT/RTGS reference number"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Remarks (optional)</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            placeholder="Add disbursement remarks..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
          />
        </div>
        {error && <Alert type="error" message={error} />}
      </div>
    </Modal>
  );
}
