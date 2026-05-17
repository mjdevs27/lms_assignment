"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { approveLoan, rejectLoan } from "@/lib/dashboard-api";
import { FrontendApiError } from "@/lib/api";
import type { Loan } from "@/types/loan.types";

interface ApproveModalProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApproveModal({ loan, isOpen, onClose, onSuccess }: ApproveModalProps) {
  const [remarks, setRemarks] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleApprove() {
    setIsLoading(true);
    setError(null);
    try {
      await approveLoan(loan.id, remarks.trim() || undefined);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof FrontendApiError || err instanceof Error ? (err as Error).message : "Failed to approve loan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Approve Loan"
      description={`Approve loan application for ${loan.fullName}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="primary" onClick={handleApprove} isLoading={isLoading}>Confirm Approval</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Remarks (optional)</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            placeholder="Add approval remarks..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
          />
        </div>
        {error && <Alert type="error" message={error} />}
      </div>
    </Modal>
  );
}

interface RejectModalProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RejectModal({ loan, isOpen, onClose, onSuccess }: RejectModalProps) {
  const [reason, setReason] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  async function handleReject() {
    setValidationError(null);
    if (reason.trim().length < 5) {
      setValidationError("Rejection reason must be at least 5 characters.");
      return;
    }
    if (reason.trim().length > 500) {
      setValidationError("Rejection reason must be at most 500 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await rejectLoan(loan.id, reason.trim());
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof FrontendApiError || err instanceof Error ? (err as Error).message : "Failed to reject loan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Reject Loan"
      description={`Reject loan application for ${loan.fullName}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="danger" onClick={handleReject} isLoading={isLoading}>Confirm Rejection</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rejection Reason <span className="text-red-500">*</span></label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Enter the reason for rejection..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">{reason.length}/500 characters</p>
        </div>
        {validationError && <Alert type="error" message={validationError} />}
        {error && <Alert type="error" message={error} />}
      </div>
    </Modal>
  );
}
