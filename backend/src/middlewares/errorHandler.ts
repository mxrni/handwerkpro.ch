import { NextFunction, Request, Response } from "express";
import { flattenError, ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      type: "validation",
      message: "Validation failed",
      errors: flattenError(err),
    });
  }

  if (err?.status && err?.message) {
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
