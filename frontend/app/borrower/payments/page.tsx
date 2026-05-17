"use client";

import * as React from "react";
import { getMyPayments } from "@/lib/payment-api";
import type { Payment } from "@/types/payment.types";
import { PaymentHistoryTable } from "@/components/borrower/PaymentHistoryTable";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMyPayments();
        setPayments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load payment history.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return <LoadingState message="Loading payment history..." />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payment History"
        description="A record of all payments made toward your loan."
      />

      {error && <Alert type="error" message={error} />}

      {!error && <PaymentHistoryTable payments={payments} />}
    </div>
  );
}
