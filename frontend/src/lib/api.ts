import type {
  CreateCustomerInput,
  Customer,
  ListCustomersInput,
  ListCustomersOutput,
  UpdateCustomerInput,
} from "@app/shared";
import { env } from "./env";

const API_BASE = env.VITE_API_URL;

/**
 * Generic API client with error handling
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Build URL search params from an object, filtering out null/undefined values
 */
function buildSearchParams(
  params: Record<string, string | number | null | undefined>,
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  }
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Customers API client
 */
export const customersApi = {
  list: (params: ListCustomersInput): Promise<ListCustomersOutput> =>
    apiClient<ListCustomersOutput>(
      `/api/customers${buildSearchParams(params)}`,
    ),

  getById: (id: string): Promise<Customer> =>
    apiClient<Customer>(`/api/customers/${id}`),

  create: (data: CreateCustomerInput): Promise<Customer> =>
    apiClient<Customer>("/api/customers", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateCustomerInput): Promise<Customer> =>
    apiClient<Customer>(`/api/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    apiClient<void>(`/api/customers/${id}`, { method: "DELETE" }),

  stats: (): Promise<{ active: number; inactive: number; total: number }> =>
    apiClient<{ active: number; inactive: number; total: number }>(
      "/api/customers/stats",
    ),
};
