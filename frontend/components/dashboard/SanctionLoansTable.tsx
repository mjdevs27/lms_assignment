"use client";

import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import type { Loan } from "@/types/loan.types";

interface SanctionLoansTableProps {
  loans: Loan[];
  onView: (loan: Loan) => void;
  onApprove: (loan: Loan) => void;
  onReject: (loan: Loan) => void;
}

export function SanctionLoansTable({ loans, onView, onApprove, onReject }: SanctionLoansTableProps) {
  if (loans.length === 0) {
    return (
      <EmptyState
        title="No loans pending sanction"
        description="No applied loans are currently awaiting review."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Borrower</TableHead>
          <TableHead>PAN</TableHead>
          <TableHead>Loan Amount</TableHead>
          <TableHead>Tenure</TableHead>
          <TableHead>Total Repayment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.fullName}</TableCell>
            <TableCell><span className="font-mono text-xs">{loan.pan}</span></TableCell>
            <TableCell>{formatCurrency(loan.loanAmount)}</TableCell>
            <TableCell>{loan.tenureDays} days</TableCell>
            <TableCell>{formatCurrency(loan.totalRepayment)}</TableCell>
            <TableCell><StatusBadge status={loan.status} /></TableCell>
            <TableCell>{loan.createdAt ? formatDateTime(loan.createdAt) : "-"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => onView(loan)}>View</Button>
                <Button size="sm" variant="primary" onClick={() => onApprove(loan)}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => onReject(loan)}>Reject</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
