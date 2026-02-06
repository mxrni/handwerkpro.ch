import cors from "cors";
import express, { type Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import { customersRouter } from "./modules/customers/customers.routes";
import { env } from "./utils/env";

const PORT = env.PORT || 3000;

export const app: Express = express();

app.use(express.json());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev")); // request logging

app.use(helmet());
app.use(cors({ origin: env.ALLOWED_ORIGINS, credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  message: { error: "Too many requests, please try again later." },
});

app.use(limiter);

app.use("/api/customers", customersRouter);

app.get("/", (req, res) => {
  res.send("HandwerkPro-API");
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
