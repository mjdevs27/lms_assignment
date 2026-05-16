"use client";

import * as React from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { uploadSalarySlip } from "@/lib/upload-api";
import type { SalarySlipUploadResponse } from "@/types/upload.types";
import { FrontendApiError } from "@/lib/api";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

interface SalarySlipUploadFormProps {
  onUploaded: (result: SalarySlipUploadResponse) => void;
  disabled?: boolean;
}

export function SalarySlipUploadForm({ onUploaded, disabled }: SalarySlipUploadFormProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  function handleFileSelect(selected: File | null) {
    setValidationError(null);
    setUploadError(null);
    setFile(null);

    if (!selected) return;

    if (!ALLOWED_MIME_TYPES.includes(selected.type)) {
      setValidationError(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
      return;
    }

    const ext = selected.name.toLowerCase().substring(selected.name.lastIndexOf("."));
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setValidationError(`Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
      return;
    }

    setFile(selected);
  }

  async function handleUpload() {
    if (!file) {
      setValidationError("Please select a file before uploading.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await uploadSalarySlip(file);
      onUploaded(result);
    } catch (err) {
      if (err instanceof FrontendApiError) {
        setUploadError(err.message);
      } else if (err instanceof Error) {
        setUploadError(err.message);
      } else {
        setUploadError("Failed to upload salary slip. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <FileUpload
        label="Salary Slip"
        accept=".pdf,.jpg,.jpeg,.png"
        maxSizeBytes={MAX_FILE_SIZE_BYTES}
        onFileSelect={handleFileSelect}
        error={validationError || undefined}
      />

      <p className="text-xs text-slate-500">
        Accepted types: PDF, JPG, PNG. Maximum size: 5 MB.
      </p>

      {uploadError && <Alert type="error" message={uploadError} />}

      <Button
        onClick={handleUpload}
        disabled={!file || disabled}
        isLoading={isUploading}
      >
        Upload Salary Slip
      </Button>
    </div>
  );
}
