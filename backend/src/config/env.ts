import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

const cwd = process.cwd();
const roots = [cwd, path.resolve(cwd, "..")];
const envCandidates = roots.flatMap((root) => [
  path.resolve(root, ".env"),
  path.resolve(root, ".env.local"),
  path.resolve(root, "backend/.env"),
  path.resolve(root, "backend/.env.local"),
  path.resolve(root, "backend/.env.example")
]);

for (const file of envCandidates) {
  if (fs.existsSync(file)) {
    dotenv.config({ path: file, override: false });
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  ELASTICSEARCH_NODE: z.string().url().default("http://localhost:9200"),
  ELASTICSEARCH_APP_INDEX: z.string().min(1).default("apps"),
  ENABLE_MOCK_AUTH: z
    .string()
    .optional()
    .transform((value) => value === "1" || value === "true")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues.map((item) => `${item.path.join(".")}: ${item.message}`).join("; ");
  throw new Error(`[config] Invalid environment: ${message}`);
}

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  databaseUrl: parsed.data.DATABASE_URL,
  elasticsearchNode: parsed.data.ELASTICSEARCH_NODE,
  elasticsearchAppIndex: parsed.data.ELASTICSEARCH_APP_INDEX,
  enableMockAuth: parsed.data.ENABLE_MOCK_AUTH ?? parsed.data.NODE_ENV !== "production"
};
