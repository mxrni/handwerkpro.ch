import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),
  APPLICATION_NAME: z.string(),
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string(),
  ALLOWED_ORIGINS: z
    .string()
    .transform((str) =>
      str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string()))
    .default(["http://localhost:5173"]),
  DATABASE_URL: z.string(),
  MAIL_FROM: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
});

export const env = envSchema.parse(process.env);
