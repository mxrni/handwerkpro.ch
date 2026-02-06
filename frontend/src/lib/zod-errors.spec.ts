import { describe, expect, it } from "vitest";
import type { $ZodIssue } from "zod/v4/core";
import { translateZodError } from "./zod-errors";

// Helper to create minimal Zod issues for testing
function issue(overrides: Partial<$ZodIssue> & { code: string }): $ZodIssue {
  return {
    message: "",
    path: [],
    ...overrides,
  } as $ZodIssue;
}

describe("translateZodError", () => {
  describe("too_small", () => {
    it("returns required field message for string min 1", () => {
      expect(
        translateZodError(
          issue({ code: "too_small", origin: "string", minimum: 1 }),
        ),
      ).toBe("Dieses Feld ist erforderlich");
    });

    it("returns min characters message for string min > 1", () => {
      expect(
        translateZodError(
          issue({ code: "too_small", origin: "string", minimum: 3 }),
        ),
      ).toBe("Mindestens 3 Zeichen erforderlich");
    });

    it("returns min value message for numbers", () => {
      expect(
        translateZodError(
          issue({ code: "too_small", origin: "number", minimum: 1 }),
        ),
      ).toBe("Wert muss mindestens 1 sein");
    });
  });

  describe("too_big", () => {
    it("returns max characters message for strings", () => {
      expect(
        translateZodError(
          issue({ code: "too_big", origin: "string", maximum: 100 }),
        ),
      ).toBe("Maximal 100 Zeichen erlaubt");
    });

    it("returns max value message for numbers", () => {
      expect(
        translateZodError(
          issue({ code: "too_big", origin: "number", maximum: 50 }),
        ),
      ).toBe("Wert darf maximal 50 sein");
    });
  });

  describe("invalid_format", () => {
    it("returns email error for email format", () => {
      expect(
        translateZodError(issue({ code: "invalid_format", format: "email" })),
      ).toBe("Ungültige E-Mail-Adresse");
    });

    it("returns URL error for url format", () => {
      expect(
        translateZodError(issue({ code: "invalid_format", format: "url" })),
      ).toBe("Ungültige URL");
    });

    it("returns ID error for uuid format", () => {
      expect(
        translateZodError(issue({ code: "invalid_format", format: "uuid" })),
      ).toBe("Ungültige ID");
    });

    it("returns generic format error for unknown formats", () => {
      expect(
        translateZodError(
          issue({ code: "invalid_format", format: "datetime" }),
        ),
      ).toBe("Ungültiges Format");
    });
  });

  describe("invalid_type", () => {
    it("returns German text for string expected", () => {
      expect(
        translateZodError(issue({ code: "invalid_type", expected: "string" })),
      ).toBe("Text erforderlich");
    });

    it("returns German text for number expected", () => {
      expect(
        translateZodError(issue({ code: "invalid_type", expected: "number" })),
      ).toBe("Zahl erforderlich");
    });

    it("returns German text for boolean expected", () => {
      expect(
        translateZodError(issue({ code: "invalid_type", expected: "boolean" })),
      ).toBe("Ja/Nein erforderlich");
    });

    it("returns generic error for other types", () => {
      expect(
        translateZodError(issue({ code: "invalid_type", expected: "object" })),
      ).toBe("Ungültiger Wert");
    });
  });

  describe("invalid_value", () => {
    it("returns select valid option message", () => {
      expect(translateZodError(issue({ code: "invalid_value" }))).toBe(
        "Bitte wählen Sie eine gültige Option",
      );
    });
  });

  describe("custom", () => {
    it("returns provided message (e.g. from .refine())", () => {
      expect(
        translateZodError(
          issue({
            code: "custom",
            message: "Mindestens ein Feld muss aktualisiert werden",
          }),
        ),
      ).toBe("Mindestens ein Feld muss aktualisiert werden");
    });

    it("returns fallback when no message provided", () => {
      expect(translateZodError(issue({ code: "custom", message: "" }))).toBe(
        "Validierung fehlgeschlagen",
      );
    });
  });

  describe("unknown codes", () => {
    it("returns original message if available", () => {
      expect(
        translateZodError(
          issue({ code: "unrecognized_keys", message: "Some error" }),
        ),
      ).toBe("Some error");
    });

    it("returns generic fallback for unknown code with no message", () => {
      expect(
        translateZodError(issue({ code: "unrecognized_keys", message: "" })),
      ).toBe("Ungültige Eingabe");
    });
  });
});
