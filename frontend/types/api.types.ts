export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
}
