import type { CustomerStatus } from "@app/shared";

/**
 * Mapping of customer status to German labels and Tailwind classes
 */
export const customerStatusMap: Record<
  CustomerStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Aktiv",
    className: "border-green-500 text-green-700 bg-green-50",
  },
  INACTIVE: {
    label: "Inaktiv",
    className: "border-gray-500 text-gray-700 bg-gray-50",
  },
  ARCHIVED: {
    label: "Archiviert",
    className: "border-orange-500 text-orange-700 bg-orange-50",
  },
} as const;
