import * as React from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, helperText, children }: FormFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <span className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </span>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
