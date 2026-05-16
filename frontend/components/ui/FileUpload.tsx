"use client";

import * as React from "react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeBytes?: number;
  error?: string;
  onFileSelect: (file: File | null) => void;
}

export function FileUpload({
  label,
  accept,
  maxSizeBytes,
  error: propError,
  onFileSelect,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    const file = files[0];

    if (maxSizeBytes && file.size > maxSizeBytes) {
      const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
      const errorMsg = `File size exceeds the limit of ${maxSizeMB}MB.`;
      setValidationError(errorMsg);
      setSelectedFile(null);
      onFileSelect(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setValidationError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayError = propError || validationError;

  return (
    <div className="w-full">
      {label && (
        <span className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3">
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg shadow-xs text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-hidden transition duration-150 ease-in-out">
          Choose File
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
        </label>
        {selectedFile ? (
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="truncate max-w-[200px] font-medium">{selectedFile.name}</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-200 transition duration-150 ease-in-out"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <span className="text-sm text-slate-400">No file chosen</span>
        )}
      </div>
      {displayError && <p className="mt-1 text-xs text-red-600">{displayError}</p>}
    </div>
  );
}
