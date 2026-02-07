import { describe, expect, it } from "vitest";
import { CustomerQuoteOutput } from "./quotes";

describe("CustomerQuoteOutput", () => {
  const validQuote = {
    id: "cuid_1",
    quoteNumber: "OF-001",
    title: "Offerte Badezimmer",
    status: "DRAFT" as const,
    issueDate: new Date("2025-01-05"),
    validUntil: new Date("2025-02-05"),
    total: 15000,
    createdAt: new Date("2025-01-05"),
  };

  it("accepts valid quote output", () => {
    const result = CustomerQuoteOutput.parse(validQuote);
    expect(result.quoteNumber).toBe("OF-001");
    expect(result.status).toBe("DRAFT");
    expect(result.total).toBe(15000);
  });

  it("accepts validUntil as null", () => {
    const result = CustomerQuoteOutput.parse({
      ...validQuote,
      validUntil: null,
    });
    expect(result.validUntil).toBeNull();
  });

  it("rejects invalid status", () => {
    expect(() =>
      CustomerQuoteOutput.parse({ ...validQuote, status: "UNKNOWN" }),
    ).toThrow();
  });

  it("accepts all valid statuses", () => {
    for (const status of ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]) {
      const result = CustomerQuoteOutput.parse({ ...validQuote, status });
      expect(result.status).toBe(status);
    }
  });
});
