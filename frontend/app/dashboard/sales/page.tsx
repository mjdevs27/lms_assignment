"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { canAccessDashboardModule } from "@/lib/permissions";
import { getSalesLeads } from "@/lib/dashboard-api";
import type { SalesLead, PaginatedResponse } from "@/types/dashboard.types";
import { SalesLeadsTable } from "@/components/dashboard/SalesLeadsTable";
import { LeadDetailsPanel } from "@/components/dashboard/LeadDetailsPanel";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { PaginationControls } from "@/components/dashboard/PaginationControls";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ROUTES } from "@/constants/routes.constants";

export default function SalesLeadPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = React.useState<PaginatedResponse<SalesLead>>({ items: [] });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selectedLead, setSelectedLead] = React.useState<SalesLead | null>(null);

  React.useEffect(() => {
    if (user && !canAccessDashboardModule(user.role, "sales")) {
      router.replace(ROUTES.UNAUTHORIZED);
    }
  }, [user, router]);

  async function loadLeads(currentSearch: string, currentPage: number) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSalesLeads({ search: currentSearch || undefined, page: currentPage, limit: 20 });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads.");
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    loadLeads(search, page);
  }, [page]);

  const searchDebounce = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setPage(1);
      loadLeads(value, 1);
    }, 300);
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Sales Leads" description="Borrowers who have registered but not yet applied for a loan." />

      <div className="max-w-sm">
        <SearchBar value={search} onChange={handleSearchChange} placeholder="Search by name or email..." />
      </div>

      {error && <Alert type="error" message={error} />}

      {isLoading ? (
        <LoadingState message="Loading leads..." />
      ) : (
        <div className="space-y-6">
          <SalesLeadsTable leads={data.items} onViewDetails={setSelectedLead} />
          <PaginationControls page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-xl z-40 overflow-y-auto">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-900 text-sm">Lead Details</span>
            <button
              onClick={() => setSelectedLead(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <LeadDetailsPanel lead={selectedLead} />
          </div>
        </div>
      )}
    </div>
  );
}
