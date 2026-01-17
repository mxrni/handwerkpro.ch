import { Prisma } from "../generated/prisma/client";

export class NotFoundError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export function isPrismaNotFoundError(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025"
  );
}
