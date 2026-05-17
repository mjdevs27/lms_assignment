"use client";

import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import type { Loan } from "@/types/loan.types";

interface CollectionLoansTableProps {
  loans: Loan[];
  onView: (loan: Loan) => void;
  onRecordPayment: (loan: Loan) => void;
}

export function CollectionLoansTable({ loans, onView, onRecordPayment }: CollectionLoansTableProps) {
  if (loans.length === 0) {
    return (
      <EmptyState
        title="No disbursed loans found"
        description="No active disbursed loans are available for collection."
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
          <TableHead>Total Repayment</TableHead>
          <TableHead>Total Paid</TableHead>
          <TableHead>Outstanding</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Disbursed At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.fullName}</TableCell>
            <TableCell><span className="font-mono text-xs">{loan.pan}</span></TableCell>
            <TableCell>{formatCurrency(loan.loanAmount)}</TableCell>
            <TableCell>{formatCurrency(loan.totalRepayment)}</TableCell>
            <TableCell>{formatCurrency(loan.totalPaid)}</TableCell>
            <TableCell>{formatCurrency(loan.outstandingAmount)}</TableCell>
            <TableCell><StatusBadge status={loan.status} /></TableCell>
            <TableCell>{loan.updatedAt ? formatDateTime(loan.updatedAt) : "-"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => onView(loan)}>View</Button>
                <Button size="sm" variant="primary" onClick={() => onRecordPayment(loan)}>Record Payment</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
