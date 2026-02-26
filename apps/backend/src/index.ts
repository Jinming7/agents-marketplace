import "dotenv/config";
import express, { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

type AppRecord = {
  appKey: string;
  name: string;
  summary: string;
  description: string;
  install: {
    status: "placeholder";
    isInstallable: true;
    ctaEnabled: false;
    ctaLabel: string;
  };
};

type AppRow = {
  app_key: string;
  name: string;
  summary: string;
  description: string;
};

function sendAppError(
  res: Response,
  status: number,
  code: `APP_${string}`,
  message: string,
  details?: unknown
): void {
  res.status(status).json({
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details })
    }
  });
}

const app = express();
const port = Number(process.env.PORT ?? 3001);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // Keep process alive for easier local dev feedback, but fail requests explicitly.
  console.warn("[backend] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.");
}

const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      })
    : null;

function toAppRecord(row: AppRow): AppRecord {
  return {
    appKey: row.app_key,
    name: row.name,
    summary: row.summary,
    description: row.description,
    install: {
      status: "placeholder",
      isInstallable: true,
      ctaEnabled: false,
      ctaLabel: "Install (Coming Soon)"
    }
  };
}

app.get("/api/apps/search", async (req: Request, res: Response) => {
  if (!supabase) {
    sendAppError(res, 500, "APP_DB_NOT_CONFIGURED", "Supabase is not configured.");
    return;
  }

  const q = req.query.q;

  if (Array.isArray(q)) {
    sendAppError(res, 400, "APP_INVALID_QUERY", "Query parameter 'q' must be a string.");
    return;
  }

  const normalized = typeof q === "string" ? q.trim() : "";

  let query = supabase.from("apps").select("app_key,name,summary,description", { count: "exact" }).limit(50);

  if (normalized) {
    query = query.or(`name.ilike.%${normalized}%,summary.ilike.%${normalized}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    sendAppError(res, 500, "APP_DB_QUERY_FAILED", "Failed to query apps.", error.message);
    return;
  }

  const items = (data ?? []).map((row) => toAppRecord(row as AppRow));

  res.json({
    items,
    total: count ?? items.length
  });
});

app.get("/api/apps/:appKey", async (req: Request, res: Response) => {
  if (!supabase) {
    sendAppError(res, 500, "APP_DB_NOT_CONFIGURED", "Supabase is not configured.");
    return;
  }

  const appKey = req.params.appKey?.trim().toLowerCase();

  if (!appKey) {
    sendAppError(res, 400, "APP_INVALID_KEY", "Path parameter 'appKey' is required.");
    return;
  }

  const { data, error } = await supabase
    .from("apps")
    .select("app_key,name,summary,description")
    .eq("app_key", appKey)
    .maybeSingle();

  if (error) {
    sendAppError(res, 500, "APP_DB_QUERY_FAILED", "Failed to query app detail.", error.message);
    return;
  }

  if (!data) {
    sendAppError(res, 404, "APP_NOT_FOUND", `App '${appKey}' does not exist.`);
    return;
  }

  res.json(toAppRecord(data as AppRow));
});

app.use((req, res) => {
  sendAppError(res, 404, "APP_ROUTE_NOT_FOUND", `Route '${req.path}' does not exist.`);
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
