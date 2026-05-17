"use client";

import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import type { SalesLead } from "@/types/dashboard.types";

interface SalesLeadsTableProps {
  leads: SalesLead[];
  onViewDetails: (lead: SalesLead) => void;
}

export function SalesLeadsTable({ leads, onViewDetails }: SalesLeadsTableProps) {
  if (leads.length === 0) {
    return (
      <EmptyState
        title="No leads found"
        description="No borrower leads match the current filter."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>PAN</TableHead>
          <TableHead>Salary</TableHead>
          <TableHead>Employment</TableHead>
          <TableHead>Profile</TableHead>
          <TableHead>Salary Slip</TableHead>
          <TableHead>Registered</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">{lead.fullName}</TableCell>
            <TableCell>{lead.email}</TableCell>
            <TableCell>
              <span className="font-mono text-xs">{lead.pan || "-"}</span>
            </TableCell>
            <TableCell>{lead.monthlySalary ? formatCurrency(lead.monthlySalary) : "-"}</TableCell>
            <TableCell>{lead.employmentMode || "-"}</TableCell>
            <TableCell>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${lead.isProfileComplete ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>
                {lead.isProfileComplete ? "Complete" : "Incomplete"}
              </span>
            </TableCell>
            <TableCell>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${lead.salarySlipUploaded ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>
                {lead.salarySlipUploaded ? "Uploaded" : "Missing"}
              </span>
            </TableCell>
            <TableCell>{lead.createdAt ? formatDateTime(lead.createdAt) : "-"}</TableCell>
            <TableCell>
              <Button size="sm" variant="secondary" onClick={() => onViewDetails(lead)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
