"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { canAccessDashboardModule } from "@/lib/permissions";
import { getDisbursementLoans } from "@/lib/dashboard-api";
import type { Loan } from "@/types/loan.types";
import type { PaginatedResponse } from "@/types/dashboard.types";
import { DisbursementLoansTable } from "@/components/dashboard/DisbursementLoansTable";
import { DisburseModal } from "@/components/dashboard/DisbursementActionModal";
import { LoanDetailPanel } from "@/components/dashboard/LoanDetailPanel";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { PaginationControls } from "@/components/dashboard/PaginationControls";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ROUTES } from "@/constants/routes.constants";

export default function DisbursementPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = React.useState<PaginatedResponse<Loan>>({ items: [] });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selectedLoan, setSelectedLoan] = React.useState<Loan | null>(null);
  const [disburseTarget, setDisburseTarget] = React.useState<Loan | null>(null);

  React.useEffect(() => {
    if (user && !canAccessDashboardModule(user.role, "disbursement")) {
      router.replace(ROUTES.UNAUTHORIZED);
    }
  }, [user, router]);

  async function loadLoans(currentSearch: string, currentPage: number) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDisbursementLoans({ search: currentSearch || undefined, page: currentPage, limit: 20 });
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

  function handleActionSuccess() {
    setSelectedLoan(null);
    loadLoans(search, page);
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Disbursement" description="Mark sanctioned loans as disbursed." />

      <div className="max-w-sm">
        <SearchBar value={search} onChange={handleSearchChange} placeholder="Search by borrower name..." />
      </div>

      {error && <Alert type="error" message={error} />}

      {isLoading ? (
        <LoadingState message="Loading loans..." />
      ) : (
        <div className="space-y-6">
          <DisbursementLoansTable
            loans={data.items}
            onView={setSelectedLoan}
            onDisburse={setDisburseTarget}
          />
          <PaginationControls page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}

      {selectedLoan && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-xl z-40 overflow-y-auto">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-900 text-sm">Loan Details</span>
            <button
              onClick={() => setSelectedLoan(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <LoanDetailPanel loan={selectedLoan} />
          </div>
        </div>
      )}

      {disburseTarget && (
        <DisburseModal
          loan={disburseTarget}
          isOpen={!!disburseTarget}
          onClose={() => setDisburseTarget(null)}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
}
