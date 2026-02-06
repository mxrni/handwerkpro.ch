import { NextFunction, Request, Response } from "express";
import { flattenError, ZodError } from "zod";

interface HttpError {
  status: number;
  message: string;
  type?: string;
  details?: unknown;
}

function isHttpError(err: unknown): err is HttpError {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err &&
    typeof (err as HttpError).status === "number" &&
    typeof (err as HttpError).message === "string"
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      type: "validation",
      message: "Validation failed",
      errors: flattenError(err),
    });
  }

  if (isHttpError(err)) {
    return res.status(err.status).json({
      type: err.type || "error",
      message: err.message,
      details: err.details || null,
    });
  }

  return res.status(500).json({
    type: "internal",
    message: "Internal Server Error",
  });
}
