export const CustomerType = ["PRIVATE", "BUSINESS"] as const;
export type CustomerType = (typeof CustomerType)[number];

export const CustomerStatus = ["ACTIVE", "INACTIVE", "ARCHIVED"] as const;
export type CustomerStatus = (typeof CustomerStatus)[number];

export const Country = ["CH", "DE", "AT", "LI"] as const;
export type Country = (typeof Country)[number];

export const OrderStatus = [
  "PLANNED",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof OrderStatus)[number];

export const QuoteStatus = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
] as const;
export type QuoteStatus = (typeof QuoteStatus)[number];

export const InvoiceStatus = [
  "DRAFT",
  "SENT",
  "PAID",
  "PARTIAL",
  "OVERDUE",
  "CANCELLED",
] as const;
export type InvoiceStatus = (typeof InvoiceStatus)[number];

export const Priority = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
export type Priority = (typeof Priority)[number];
