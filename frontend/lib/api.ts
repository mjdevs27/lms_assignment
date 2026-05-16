import { env } from "./env";
import { getToken, removeToken } from "./token-storage";

export class FrontendApiError extends Error {
  status: number;
  errors?: unknown[];

  constructor(message: string, status: number, errors?: unknown[]) {
    super(message);
    this.name = "FrontendApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = env.apiBaseUrl;
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${cleanBaseUrl}${cleanPath}`;

  const headers = new Headers(options?.headers);

  // Attach Authorization header when token exists
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Attach JSON Content-Type unless body is FormData
  const isFormData = options?.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let responseData: any = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    }

    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
      }

      const errorMessage = responseData?.message || responseData?.error || `Request failed with status ${response.status}`;
      const errors = responseData?.errors || responseData?.data?.failures || responseData?.failures;
      throw new FrontendApiError(errorMessage, response.status, errors);
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof FrontendApiError) {
      throw error;
    }
    throw new FrontendApiError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      500
    );
  }
}
