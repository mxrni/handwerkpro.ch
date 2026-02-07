import z from "zod";
import { QuoteStatus } from "./enums";

export const CustomerQuoteOutput = z.object({
  id: z.string(),
  quoteNumber: z.string(),
  title: z.string(),
  status: z.enum(QuoteStatus),
  issueDate: z.date(),
  validUntil: z.date().nullable(),
  total: z.number(),
  createdAt: z.date(),
});
export type CustomerQuoteOutput = z.infer<typeof CustomerQuoteOutput>;
