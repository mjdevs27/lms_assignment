import * as React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-xs placeholder-slate-400 focus:outline-hidden focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition duration-150 ease-in-out ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-slate-500 focus:ring-slate-500"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
