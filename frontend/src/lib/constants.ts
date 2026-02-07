import type {
  CustomerStatus,
  InvoiceStatus,
  OrderStatus,
  Priority,
  QuoteStatus,
} from "@app/shared";

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

/**
 * Mapping of order status to German labels and Tailwind classes
 */
export const orderStatusMap: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PLANNED: {
    label: "Geplant",
    className: "border-blue-500 text-blue-700 bg-blue-50",
  },
  IN_PROGRESS: {
    label: "In Arbeit",
    className: "border-yellow-500 text-yellow-700 bg-yellow-50",
  },
  REVIEW: {
    label: "Überprüfung",
    className: "border-purple-500 text-purple-700 bg-purple-50",
  },
  COMPLETED: {
    label: "Abgeschlossen",
    className: "border-green-500 text-green-700 bg-green-50",
  },
  CANCELLED: {
    label: "Storniert",
    className: "border-gray-500 text-gray-700 bg-gray-50",
  },
} as const;

/**
 * Mapping of quote status to German labels and Tailwind classes
 */
export const quoteStatusMap: Record<
  QuoteStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Entwurf",
    className: "border-gray-500 text-gray-700 bg-gray-50",
  },
  SENT: {
    label: "Versendet",
    className: "border-blue-500 text-blue-700 bg-blue-50",
  },
  ACCEPTED: {
    label: "Angenommen",
    className: "border-green-500 text-green-700 bg-green-50",
  },
  REJECTED: {
    label: "Abgelehnt",
    className: "border-red-500 text-red-700 bg-red-50",
  },
  EXPIRED: {
    label: "Abgelaufen",
    className: "border-orange-500 text-orange-700 bg-orange-50",
  },
} as const;

/**
 * Mapping of invoice status to German labels and Tailwind classes
 */
export const invoiceStatusMap: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Entwurf",
    className: "border-gray-500 text-gray-700 bg-gray-50",
  },
  SENT: {
    label: "Versendet",
    className: "border-blue-500 text-blue-700 bg-blue-50",
  },
  PAID: {
    label: "Bezahlt",
    className: "border-green-500 text-green-700 bg-green-50",
  },
  PARTIAL: {
    label: "Teilbezahlt",
    className: "border-yellow-500 text-yellow-700 bg-yellow-50",
  },
  OVERDUE: {
    label: "Überfällig",
    className: "border-red-500 text-red-700 bg-red-50",
  },
  CANCELLED: {
    label: "Storniert",
    className: "border-gray-500 text-gray-700 bg-gray-50",
  },
} as const;

/**
 * Mapping of priority to German labels and Tailwind classes
 */
export const priorityMap: Record<
  Priority,
  { label: string; className: string }
> = {
  LOW: {
    label: "Niedrig",
    className: "border-gray-500 text-gray-700 bg-gray-50",
  },
  NORMAL: {
    label: "Normal",
    className: "border-blue-500 text-blue-700 bg-blue-50",
  },
  HIGH: {
    label: "Hoch",
    className: "border-orange-500 text-orange-700 bg-orange-50",
  },
  URGENT: {
    label: "Dringend",
    className: "border-red-500 text-red-700 bg-red-50",
  },
} as const;
