import type { CustomerType } from "@app/shared";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";

export interface CustomerSearchParams {
  page: number;
  pageSize: number;
  search: string | null;
  type: CustomerType | null;
}

const defaultParams: CustomerSearchParams = {
  page: 1,
  pageSize: 6,
  search: null,
  type: null,
};

/**
 * Hook to manage customer search params in URL
 * Syncs filter/pagination state with URL search params
 */
export function useCustomerSearchParams() {
  const navigate = useNavigate();

  // Get search params from the current route
  const searchParams = useSearch({
    strict: false,
  }) as Partial<CustomerSearchParams>;

  const params: CustomerSearchParams = {
    page: searchParams.page ?? defaultParams.page,
    pageSize: searchParams.pageSize ?? defaultParams.pageSize,
    search: searchParams.search ?? defaultParams.search,
    type: searchParams.type ?? defaultParams.type,
  };

  const setParams = useCallback(
    (
      newParams:
        | Partial<CustomerSearchParams>
        | ((prev: CustomerSearchParams) => Partial<CustomerSearchParams>),
    ) => {
      const updates =
        typeof newParams === "function" ? newParams(params) : newParams;

      navigate({
        to: ".",
        search: (prev) => ({
          ...prev,
          ...updates,
        }),
        replace: true,
      });
    },
    [navigate, params],
  );

  return [params, setParams] as const;
}
