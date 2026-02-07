import z from "zod";
import { OrderStatus, Priority } from "./enums";

export const CustomerOrderOutput = z.object({
  id: z.string(),
  orderNumber: z.string(),
  title: z.string(),
  status: z.enum(OrderStatus),
  priority: z.enum(Priority),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  deadline: z.date().nullable(),
  estimatedCost: z.number().nullable(),
  actualCost: z.number().nullable(),
  createdAt: z.date(),
});
export type CustomerOrderOutput = z.infer<typeof CustomerOrderOutput>;
