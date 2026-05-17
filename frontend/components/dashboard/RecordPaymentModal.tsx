"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { recordLoanPayment } from "@/lib/dashboard-api";
import { FrontendApiError } from "@/lib/api";
import type { Loan } from "@/types/loan.types";

const UTR_REGEX = /^[A-Z0-9-]{6,50}$/;

interface RecordPaymentModalProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RecordPaymentModal({ loan, isOpen, onClose, onSuccess }: RecordPaymentModalProps) {
  const [utrNumber, setUtrNumber] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [paymentDate, setPaymentDate] = React.useState("");
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  function validate(): string | null {
    const utr = utrNumber.trim().toUpperCase();
    if (!utr) return "UTR number is required.";
    if (!UTR_REGEX.test(utr)) return "UTR must be 6-50 uppercase alphanumeric characters or hyphens.";

    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) return "Amount must be greater than 0.";
    if (amt > loan.outstandingAmount) return `Amount cannot exceed outstanding amount of ${loan.outstandingAmount.toFixed(2)}.`;

    if (!paymentDate) return "Payment date is required.";
    const selected = new Date(paymentDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selected > today) return "Payment date cannot be in the future.";

    return null;
  }

  async function handleSubmit() {
    setValidationError(null);
    setSubmitError(null);

    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }

    setIsLoading(true);
    try {
      await recordLoanPayment(loan.id, {
        utrNumber: utrNumber.trim().toUpperCase(),
        amount: parseFloat(amount),
        paymentDate,
      });
      onSuccess();
      onClose();
    } catch (e) {
      if (e instanceof FrontendApiError && e.status === 409) {
        setSubmitError("Duplicate UTR number. This UTR has already been recorded.");
      } else if (e instanceof Error) {
        setSubmitError(e.message);
      } else {
        setSubmitError("Failed to record payment. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal
      isOpen={isOpen}
      title="Record Payment"
      description={`Record a repayment for ${loan.fullName}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>Record Payment</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            UTR Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value.toUpperCase())}
            placeholder="e.g. UTR123456"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 uppercase"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Max: ${loan.outstandingAmount.toFixed(2)}`}
            min="0.01"
            max={loan.outstandingAmount}
            step="0.01"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <p className="text-xs text-slate-400 mt-1">Outstanding: {loan.outstandingAmount.toFixed(2)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Payment Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            max={today}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        {validationError && <Alert type="error" message={validationError} />}
        {submitError && <Alert type="error" message={submitError} />}
      </div>
    </Modal>
  );
}
