import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import apiRouter from "./routes/index.js";
import { env } from "./config/env.js";
import { mockAuth } from "./middlewares/auth.js";
import { AppError } from "./types/errors.js";

export const app = express();

app.use(cors());
app.use(express.json());

if (env.enableMockAuth) {
  app.use(mockAuth);
}

app.get("/health", (_req, res) => {
  res.status(StatusCodes.OK).json({ ok: true });
});

app.use("/api", apiRouter);

app.use((error: Error & { status?: number; code?: string; details?: unknown }, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: "APP_INVALID_PARAMS",
      message: "Validation failed",
      issues: error.issues
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.status).json({
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {})
    });
    return;
  }

  const isPrismaEnvError = error.message.includes("Environment variable not found: DATABASE_URL");
  if (isPrismaEnvError) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      code: "APP_DB_UNAVAILABLE",
      message: "Database is not configured. Please set DATABASE_URL."
    });
    return;
  }

  const status = error.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const message = status >= 500 ? "Internal server error" : error.message || "Request failed";

  if (status >= 500) {
    console.error("[backend:error]", error);
  }

  res.status(status).json({
    code: "APP_INTERNAL_ERROR",
    message
  });
});
