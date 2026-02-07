import z from "zod";
import { Country, CustomerStatus, CustomerType } from "./enums";
import { CustomerInvoiceOutput } from "./invoices";
import { CustomerOrderOutput } from "./orders";
import { CustomerQuoteOutput } from "./quotes";

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(CustomerType),
  contactName: z.string().nullable().optional(),
  email: z.email().nullable().optional(),
  phone: z.string().nullable().optional(),
  mobile: z.string().nullable().optional(),
  street: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.enum(Country),
  notes: z.string().nullable().optional(),
  status: z.enum(CustomerStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Customer = z.infer<typeof CustomerSchema>;

export const CreateCustomerInput = CustomerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateCustomerInput = z.infer<typeof CreateCustomerInput>;

export const UpdateCustomerInput = CreateCustomerInput.partial()
  .extend({
    id: z.string(),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: "Mindestens ein Feld muss aktualisiert werden",
  });
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInput>;

export const CustomerIDInput = z.object({
  id: z.string(),
});

export const CustomerOutput = CustomerSchema;

export const CustomerListItemOutput = CustomerSchema.extend({
  stats: z.object({
    orderCount: z.number(),
    revenue: z.number(),
    openInvoices: z.number(),
    activeOrders: z.number(),
  }),
});
export type CustomerListItemOutput = z.infer<typeof CustomerListItemOutput>;

export const ListCustomersInput = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),

  search: z.string().nullable().optional(),
  type: z.enum(CustomerType).nullable().optional(),
});
export type ListCustomersInput = z.infer<typeof ListCustomersInput>;

export const ListCustomersOutput = z.object({
  data: z.array(CustomerListItemOutput),
  meta: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
export type ListCustomersOutput = z.infer<typeof ListCustomersOutput>;

export const CustomerStatsOutput = z.object({
  active: z.number(),
  inactive: z.number(),
  archived: z.number(),
  total: z.number(),
});
export type CustomerStatsOutput = z.infer<typeof CustomerStatsOutput>;

export const CustomerDetailOutput = CustomerListItemOutput.extend({
  orders: z.array(CustomerOrderOutput),
  quotes: z.array(CustomerQuoteOutput),
  invoices: z.array(CustomerInvoiceOutput),
});
export type CustomerDetailOutput = z.infer<typeof CustomerDetailOutput>;
