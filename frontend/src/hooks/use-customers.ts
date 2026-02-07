import { customersApi } from "@/lib/api";
import type {
  CreateCustomerInput,
  ListCustomersInput,
  UpdateCustomerInput,
} from "@app/shared";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCustomerSearchParams } from "./use-customer-search-params";

/**
 * Hook to fetch paginated customer list
 */
export function useCustomers() {
  const [params] = useCustomerSearchParams();

  const queryParams: ListCustomersInput = {
    page: params.page,
    pageSize: params.pageSize,
    ...(params.search?.trim() && { search: params.search }),
    ...(params.type && { type: params.type }),
  };

  return useSuspenseQuery({
    queryKey: ["customers", "list", queryParams],
    queryFn: () => customersApi.list(queryParams),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch a single customer by ID
 */
export function useCustomer(id: string) {
  return useSuspenseQuery({
    queryKey: ["customers", "detail", id],
    queryFn: () => customersApi.getById(id),
  });
}

/**
 * Hook to fetch customer stats
 */
export function useCustomersStats() {
  return useSuspenseQuery({
    queryKey: ["customers", "stats"],
    queryFn: () => customersApi.stats(),
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to create a new customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerInput) => customersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
      queryClient.invalidateQueries({ queryKey: ["customers", "stats"] });
    },
  });
}

/**
 * Hook to update an existing customer
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerInput }) =>
      customersApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customers", "detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
      queryClient.invalidateQueries({ queryKey: ["customers", "stats"] });
    },
  });
}

/**
 * Hook to delete a customer
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
      queryClient.invalidateQueries({ queryKey: ["customers", "stats"] });
    },
  });
}
