import type { ApiResponse } from "@/types/api.types";
import type { SalarySlipUploadResponse } from "@/types/upload.types";
import { apiRequest } from "./api";

export async function uploadSalarySlip(file: File): Promise<SalarySlipUploadResponse> {
  const formData = new FormData();
  formData.append("salarySlip", file);

  const res = await apiRequest<ApiResponse<SalarySlipUploadResponse>>("/borrower/upload-salary-slip", {
    method: "POST",
    body: formData,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to upload salary slip");
  }

  return res.data;
}
