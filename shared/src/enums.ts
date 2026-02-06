export const CustomerType = ["PRIVATE", "BUSINESS"] as const;
export type CustomerType = (typeof CustomerType)[number];

export const CustomerStatus = ["ACTIVE", "INACTIVE", "ARCHIVED"] as const;
export type CustomerStatus = (typeof CustomerStatus)[number];

export const Country = ["CH", "DE", "AT", "LI"] as const;
export type Country = (typeof Country)[number];
