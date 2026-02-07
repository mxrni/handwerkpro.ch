import z from "zod";
import { InvoiceStatus } from "./enums";

export const CustomerInvoiceOutput = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  title: z.string(),
  status: z.enum(InvoiceStatus),
  issueDate: z.date(),
  dueDate: z.date().nullable(),
  paidDate: z.date().nullable(),
  total: z.number(),
  paidAmount: z.number().nullable(),
  createdAt: z.date(),
});
export type CustomerInvoiceOutput = z.infer<typeof CustomerInvoiceOutput>;
