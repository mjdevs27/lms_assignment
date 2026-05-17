import * as React from "react";
import { Button } from "@/components/ui/Button";

interface PaginationControlsProps {
  page: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ page, totalPages, onPageChange }: PaginationControlsProps) {
  const hasPrev = page > 1;
  const hasNext = totalPages ? page < totalPages : true;

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-slate-600">
        Page {page}{totalPages ? ` of ${totalPages}` : ""}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
