import { describe, expect, it } from "vitest";
import {
  CreateCustomerInput,
  ListCustomersInput,
  UpdateCustomerInput,
} from "./customers";

describe("CreateCustomerInput", () => {
  const validInput = {
    name: "Muster AG",
    type: "BUSINESS" as const,
    country: "CH" as const,
    status: "ACTIVE" as const,
  };

  it("accepts minimal valid input (only required fields)", () => {
    const result = CreateCustomerInput.parse(validInput);
    expect(result.name).toBe("Muster AG");
    expect(result.type).toBe("BUSINESS");
    expect(result.country).toBe("CH");
    expect(result.status).toBe("ACTIVE");
  });

  it("accepts full valid input with all optional fields", () => {
    const full = {
      ...validInput,
      contactName: "Hans Muster",
      email: "hans@muster.ch",
      phone: "+41 44 123 45 67",
      mobile: "+41 79 123 45 67",
      street: "Bahnhofstrasse 1",
      postalCode: "8001",
      city: "Zürich",
      notes: "Stammkunde",
    };
    const result = CreateCustomerInput.parse(full);
    expect(result.email).toBe("hans@muster.ch");
    expect(result.city).toBe("Zürich");
  });

  it("allows nullable optional fields to be null", () => {
    const result = CreateCustomerInput.parse({
      ...validInput,
      email: null,
      phone: null,
      contactName: null,
    });
    expect(result.email).toBeNull();
    expect(result.phone).toBeNull();
  });

  it("rejects empty name", () => {
    expect(() =>
      CreateCustomerInput.parse({ ...validInput, name: "" }),
    ).toThrow();
  });

  it("rejects missing name", () => {
    const { name: _, ...noName } = validInput;
    expect(() => CreateCustomerInput.parse(noName)).toThrow();
  });

  it("rejects invalid email format", () => {
    expect(() =>
      CreateCustomerInput.parse({ ...validInput, email: "not-an-email" }),
    ).toThrow();
  });

  it("rejects invalid customer type", () => {
    expect(() =>
      CreateCustomerInput.parse({ ...validInput, type: "GOVERNMENT" }),
    ).toThrow();
  });

  it("rejects invalid country", () => {
    expect(() =>
      CreateCustomerInput.parse({ ...validInput, country: "US" }),
    ).toThrow();
  });

  it("rejects invalid status", () => {
    expect(() =>
      CreateCustomerInput.parse({ ...validInput, status: "DELETED" }),
    ).toThrow();
  });

  it("strips id, createdAt, updatedAt (omitted from schema)", () => {
    const withExtra = {
      ...validInput,
      id: "should-be-stripped",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = CreateCustomerInput.parse(withExtra);
    expect(result).not.toHaveProperty("id");
    expect(result).not.toHaveProperty("createdAt");
    expect(result).not.toHaveProperty("updatedAt");
  });
});

describe("UpdateCustomerInput", () => {
  it("accepts valid partial update with id", () => {
    const result = UpdateCustomerInput.parse({
      id: "cuid123",
      name: "Neuer Name",
    });
    expect(result.id).toBe("cuid123");
    expect(result.name).toBe("Neuer Name");
  });

  it("rejects update with only id (no fields to update)", () => {
    expect(() => UpdateCustomerInput.parse({ id: "cuid123" })).toThrow(
      "Mindestens ein Feld muss aktualisiert werden",
    );
  });

  it("rejects update without id", () => {
    expect(() => UpdateCustomerInput.parse({ name: "Test" })).toThrow();
  });

  it("accepts updating a single optional field", () => {
    const result = UpdateCustomerInput.parse({
      id: "cuid123",
      email: "new@example.ch",
    });
    expect(result.email).toBe("new@example.ch");
  });

  it("still validates field formats (invalid email)", () => {
    expect(() =>
      UpdateCustomerInput.parse({ id: "cuid123", email: "bad" }),
    ).toThrow();
  });
});

describe("ListCustomersInput", () => {
  it("applies defaults when no input is given", () => {
    const result = ListCustomersInput.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it("coerces string numbers from query params", () => {
    const result = ListCustomersInput.parse({
      page: "3",
      pageSize: "10",
    });
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(10);
  });

  it("rejects page < 1", () => {
    expect(() => ListCustomersInput.parse({ page: 0 })).toThrow();
    expect(() => ListCustomersInput.parse({ page: -1 })).toThrow();
  });

  it("rejects pageSize > 100", () => {
    expect(() => ListCustomersInput.parse({ pageSize: 101 })).toThrow();
  });

  it("accepts optional search filter", () => {
    const result = ListCustomersInput.parse({ search: "Muster" });
    expect(result.search).toBe("Muster");
  });

  it("accepts optional type filter", () => {
    const result = ListCustomersInput.parse({ type: "BUSINESS" });
    expect(result.type).toBe("BUSINESS");
  });

  it("rejects invalid type filter", () => {
    expect(() => ListCustomersInput.parse({ type: "UNKNOWN" })).toThrow();
  });
});
