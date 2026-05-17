"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { canAccessDashboardModule } from "@/lib/permissions";
import { getCollectionLoans, getCollectionLoanById, getLoanPayments } from "@/lib/dashboard-api";
import type { Loan } from "@/types/loan.types";
import type { Payment } from "@/types/payment.types";
import type { PaginatedResponse } from "@/types/dashboard.types";
import { CollectionLoansTable } from "@/components/dashboard/CollectionLoansTable";
import { CollectionLoanDetailPanel } from "@/components/dashboard/CollectionLoanDetailPanel";
import { LoanPaymentsTable } from "@/components/dashboard/LoanPaymentsTable";
import { RecordPaymentModal } from "@/components/dashboard/RecordPaymentModal";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { PaginationControls } from "@/components/dashboard/PaginationControls";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ROUTES } from "@/constants/routes.constants";

export default function CollectionPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = React.useState<PaginatedResponse<Loan>>({ items: [] });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selectedLoan, setSelectedLoan] = React.useState<Loan | null>(null);
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = React.useState(false);
  const [paymentTarget, setPaymentTarget] = React.useState<Loan | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user && !canAccessDashboardModule(user.role, "collection")) {
      router.replace(ROUTES.UNAUTHORIZED);
    }
  }, [user, router]);

  async function loadLoans(currentSearch: string, currentPage: number) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCollectionLoans({ search: currentSearch || undefined, page: currentPage, limit: 20 });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load loans.");
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    loadLoans(search, page);
  }, [page]);

  const searchDebounce = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setPage(1);
      loadLoans(value, 1);
    }, 300);
  }

  async function handleSelectLoan(loan: Loan) {
    setSelectedLoan(loan);
    setPaymentsLoading(true);
    setPayments([]);
    try {
      const p = await getLoanPayments(loan.id);
      setPayments(p);
    } catch {
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  }

  async function handlePaymentSuccess() {
    setPaymentTarget(null);
    setSuccessMessage(null);

    await loadLoans(search, page);

    if (selectedLoan) {
      try {
        const refreshed = await getCollectionLoanById(selectedLoan.id);
        setSelectedLoan(refreshed);
        const p = await getLoanPayments(selectedLoan.id);
        setPayments(p);
        if (refreshed.status === "CLOSED") {
          setSuccessMessage("Payment recorded. The loan has been closed by the system.");
        } else {
          setSuccessMessage("Payment recorded successfully.");
        }
      } catch {
        setSuccessMessage("Payment recorded. The loan may have been closed.");
        setSelectedLoan(null);
      }
    } else {
      setSuccessMessage("Payment recorded successfully.");
    }
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collection"
        description="Record borrower repayments for active disbursed loans."
      />

      <div className="max-w-sm">
        <SearchBar value={search} onChange={handleSearchChange} placeholder="Search by borrower name..." />
      </div>

      {error && <Alert type="error" message={error} />}
      {successMessage && <Alert type="success" message={successMessage} />}

      {isLoading ? (
        <LoadingState message="Loading loans..." />
      ) : (
        <div className="space-y-6">
          <CollectionLoansTable
            loans={data.items}
            onView={handleSelectLoan}
            onRecordPayment={(loan) => setPaymentTarget(loan)}
          />
          <PaginationControls page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}

      {selectedLoan && (
        <div className="space-y-4">
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">
                Selected Loan: {selectedLoan.fullName}
              </h3>
              <button
                onClick={() => setSelectedLoan(null)}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CollectionLoanDetailPanel loan={selectedLoan} />
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700">Payment History</h4>
                {paymentsLoading ? (
                  <LoadingState message="Loading payments..." />
                ) : (
                  <LoanPaymentsTable payments={payments} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentTarget && (
        <RecordPaymentModal
          loan={paymentTarget}
          isOpen={!!paymentTarget}
          onClose={() => setPaymentTarget(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
