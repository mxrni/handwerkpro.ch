import { describe, expect, it } from "vitest";
import { CustomerInvoiceOutput } from "./invoices";

describe("CustomerInvoiceOutput", () => {
  const validInvoice = {
    id: "cuid_1",
    invoiceNumber: "RE-001",
    title: "Rechnung Januar",
    status: "DRAFT" as const,
    issueDate: new Date("2025-01-15"),
    dueDate: new Date("2025-02-15"),
    paidDate: null,
    total: 1500,
    paidAmount: null,
    createdAt: new Date("2025-01-15"),
  };

  it("accepts valid invoice output", () => {
    const result = CustomerInvoiceOutput.parse(validInvoice);
    expect(result.invoiceNumber).toBe("RE-001");
    expect(result.status).toBe("DRAFT");
    expect(result.total).toBe(1500);
  });

  it("accepts all nullable fields as null", () => {
    const result = CustomerInvoiceOutput.parse({
      ...validInvoice,
      dueDate: null,
      paidDate: null,
      paidAmount: null,
    });
    expect(result.dueDate).toBeNull();
    expect(result.paidDate).toBeNull();
    expect(result.paidAmount).toBeNull();
  });

  it("accepts paid invoice with paidAmount and paidDate", () => {
    const result = CustomerInvoiceOutput.parse({
      ...validInvoice,
      status: "PAID",
      paidDate: new Date("2025-01-20"),
      paidAmount: 1500,
    });
    expect(result.paidAmount).toBe(1500);
    expect(result.paidDate).toEqual(new Date("2025-01-20"));
  });

  it("rejects invalid status", () => {
    expect(() =>
      CustomerInvoiceOutput.parse({ ...validInvoice, status: "UNKNOWN" }),
    ).toThrow();
  });

  it("accepts all valid statuses", () => {
    for (const status of [
      "DRAFT",
      "SENT",
      "PAID",
      "PARTIAL",
      "OVERDUE",
      "CANCELLED",
    ]) {
      const result = CustomerInvoiceOutput.parse({ ...validInvoice, status });
      expect(result.status).toBe(status);
    }
  });
});
