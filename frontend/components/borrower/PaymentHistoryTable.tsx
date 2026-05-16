import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/formatters";
import type { Payment } from "@/types/payment.types";

interface PaymentHistoryTableProps {
  payments: Payment[];
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  if (payments.length === 0) {
    return (
      <EmptyState
        title="No payments found"
        description="No payments have been recorded for your loan yet."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>UTR Number</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Date</TableHead>
          <TableHead>Recorded At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <span className="font-mono text-xs">{p.utrNumber}</span>
            </TableCell>
            <TableCell>{formatCurrency(p.amount)}</TableCell>
            <TableCell>{formatDate(p.paymentDate)}</TableCell>
            <TableCell>{p.createdAt ? formatDateTime(p.createdAt) : "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
