import type { $ZodIssue } from "zod/v4/core";

/**
 * Translate a Zod issue to a German error message
 * Used for form validation feedback in the UI
 */
export function translateZodError(issue: $ZodIssue): string {
  const code = issue.code;

  // Required field (empty string with min 1)
  if (code === "too_small") {
    const issueWithMin = issue as $ZodIssue & {
      minimum?: number;
      origin?: string;
    };
    if (issueWithMin.origin === "string" && issueWithMin.minimum === 1) {
      return "Dieses Feld ist erforderlich";
    }
    if (issueWithMin.origin === "string") {
      return `Mindestens ${issueWithMin.minimum} Zeichen erforderlich`;
    }
    return `Wert muss mindestens ${issueWithMin.minimum} sein`;
  }

  // Max length/value exceeded
  if (code === "too_big") {
    const issueWithMax = issue as $ZodIssue & {
      maximum?: number;
      origin?: string;
    };
    if (issueWithMax.origin === "string") {
      return `Maximal ${issueWithMax.maximum} Zeichen erlaubt`;
    }
    return `Wert darf maximal ${issueWithMax.maximum} sein`;
  }

  // Invalid format (email, url, etc.)
  if (code === "invalid_format") {
    const formatIssue = issue as $ZodIssue & { format?: string };
    if (formatIssue.format === "email") {
      return "Ungültige E-Mail-Adresse";
    }
    if (formatIssue.format === "url") {
      return "Ungültige URL";
    }
    if (formatIssue.format === "uuid") {
      return "Ungültige ID";
    }
    return "Ungültiges Format";
  }

  // Type mismatch
  if (code === "invalid_type") {
    const typeIssue = issue as $ZodIssue & { expected?: string };
    if (typeIssue.expected === "string") return "Text erforderlich";
    if (typeIssue.expected === "number") return "Zahl erforderlich";
    if (typeIssue.expected === "boolean") return "Ja/Nein erforderlich";
    return "Ungültiger Wert";
  }

  // Invalid enum/union value
  if (code === "invalid_value") {
    return "Bitte wählen Sie eine gültige Option";
  }

  // Custom validation failed
  if (code === "custom") {
    // Return original message if provided (likely already German from .refine())
    return issue.message || "Validierung fehlgeschlagen";
  }

  // Fallback - use original message or generic
  return issue.message || "Ungültige Eingabe";
}
