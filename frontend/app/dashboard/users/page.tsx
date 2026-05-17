"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";
import { getAdminUsers, createAdminUser, toggleAdminUserActive } from "@/lib/admin-api";
import type { AdminUser, CreateStaffUserPayload } from "@/lib/admin-api";
import type { UserRole } from "@/types/user.types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { FrontendApiError } from "@/lib/api";

const STAFF_ROLES: Exclude<UserRole, "BORROWER">[] = ["ADMIN", "SALES", "SANCTION", "DISBURSEMENT", "COLLECTION"];

const ROLE_BADGE_COLORS: Record<string, "gray" | "blue" | "green" | "yellow" | "red"> = {
  ADMIN: "red",
  SALES: "blue",
  SANCTION: "green",
  DISBURSEMENT: "yellow",
  COLLECTION: "gray",
  BORROWER: "gray",
};

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

interface CreateUserForm {
  fullName: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "BORROWER">;
}

const DEFAULT_FORM: CreateUserForm = {
  fullName: "",
  email: "",
  password: "",
  role: "SALES",
};

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState<CreateUserForm>(DEFAULT_FORM);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace(ROUTES.UNAUTHORIZED);
    }
  }, [user, router]);

  const loadUsers = React.useCallback(async (currentPage: number, currentSearch: string, currentRole: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAdminUsers({
        page: currentPage,
        limit: 20,
        search: currentSearch || undefined,
        role: currentRole || undefined,
      });
      setUsers(result.users);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadUsers(page, search, roleFilter);
  }, [page, roleFilter, loadUsers]);

  const searchDebounce = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setPage(1);
      loadUsers(1, value, roleFilter);
    }, 300);
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    try {
      const payload: CreateStaffUserPayload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      };
      await createAdminUser(payload);
      setShowModal(false);
      setForm(DEFAULT_FORM);
      setSuccessMessage(`Staff user "${form.fullName}" created successfully.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      loadUsers(1, search, roleFilter);
      setPage(1);
    } catch (err) {
      if (err instanceof FrontendApiError) {
        setFormError(err.message);
      } else {
        setFormError(err instanceof Error ? err.message : "Failed to create user.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleActive(u: AdminUser) {
    setTogglingId(u.id);
    try {
      const updated = await toggleAdminUserActive(u.id);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user.");
    } finally {
      setTogglingId(null);
    }
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="User Management"
          description={`${total} user${total !== 1 ? "s" : ""} in the system`}
        />
        <Button onClick={() => { setShowModal(true); setFormError(null); setForm(DEFAULT_FORM); }}>
          + Create Staff User
        </Button>
      </div>

      {successMessage && <Alert type="success" message={successMessage} />}
      {error && <Alert type="error" message={error} />}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="w-64">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div className="w-48">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="">All Roles</option>
            {["ADMIN", "SALES", "SANCTION", "DISBURSEMENT", "COLLECTION", "BORROWER"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <LoadingState message="Loading users..." />
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No users found.</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Role</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Created</th>
                <th className="text-right px-4 py-3 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{u.fullName}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        u.role === "ADMIN"
                          ? "bg-red-100 text-red-700"
                          : u.role === "SALES"
                          ? "bg-blue-100 text-blue-700"
                          : u.role === "SANCTION"
                          ? "bg-green-100 text-green-700"
                          : u.role === "DISBURSEMENT"
                          ? "bg-yellow-100 text-yellow-700"
                          : u.role === "COLLECTION"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== user.id && (
                      <Button
                        variant={u.isActive ? "danger" : "secondary"}
                        size="sm"
                        isLoading={togglingId === u.id}
                        disabled={togglingId === u.id}
                        onClick={() => handleToggleActive(u)}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages} · {total} users
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Staff User Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Staff User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          {formError && <Alert type="error" message={formError} />}

          <Input
            label="Full Name"
            id="fullName"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Email Address"
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Password"
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            disabled={isSubmitting}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Exclude<UserRole, "BORROWER"> }))}
              disabled={isSubmitting}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            >
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
              Create User
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
