import { describe, expect, it } from "vitest";
import { CustomerOrderOutput } from "./orders";

describe("CustomerOrderOutput", () => {
  const validOrder = {
    id: "cuid_1",
    orderNumber: "AU-001",
    title: "Badezimmer Renovation",
    status: "PLANNED" as const,
    priority: "NORMAL" as const,
    startDate: new Date("2025-02-01"),
    endDate: null,
    deadline: new Date("2025-04-01"),
    estimatedCost: 15000,
    actualCost: null,
    createdAt: new Date("2025-01-10"),
  };

  it("accepts valid order output", () => {
    const result = CustomerOrderOutput.parse(validOrder);
    expect(result.orderNumber).toBe("AU-001");
    expect(result.status).toBe("PLANNED");
    expect(result.priority).toBe("NORMAL");
  });

  it("accepts all nullable fields as null", () => {
    const result = CustomerOrderOutput.parse({
      ...validOrder,
      startDate: null,
      endDate: null,
      deadline: null,
      estimatedCost: null,
      actualCost: null,
    });
    expect(result.startDate).toBeNull();
    expect(result.estimatedCost).toBeNull();
  });

  it("rejects invalid status", () => {
    expect(() =>
      CustomerOrderOutput.parse({ ...validOrder, status: "UNKNOWN" }),
    ).toThrow();
  });

  it("rejects invalid priority", () => {
    expect(() =>
      CustomerOrderOutput.parse({ ...validOrder, priority: "EXTREME" }),
    ).toThrow();
  });
});
