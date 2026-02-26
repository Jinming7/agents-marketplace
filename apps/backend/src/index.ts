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
app.use(express.json());
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

app.get("/api/meta", (_req: Request, res: Response) => {
  res.json({
    service: "agents-marketplace-backend",
    supabaseConfigured: Boolean(supabase),
    timestamp: new Date().toISOString()
  });
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
  if (!supabase) {
    return sendAppError(res, 500, "APP_DB_NOT_CONFIGURED", "Supabase is not configured.");
  }

  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!email || !password || password.length < 8) {
    return res.status(400).json({
      error: {
        code: "AUTH_INVALID_INPUT",
        message: "email and password(min 8 chars) are required"
      }
    });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  if (error) {
    return res.status(400).json({
      error: {
        code: "AUTH_REGISTER_FAILED",
        message: error.message
      }
    });
  }

  return res.status(201).json({
    user: { id: data.user?.id ?? null, email: data.user?.email ?? email },
    session: null
  });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  if (!supabase) {
    return sendAppError(res, 500, "APP_DB_NOT_CONFIGURED", "Supabase is not configured.");
  }

  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!email || !password) {
    return res.status(400).json({
      error: {
        code: "AUTH_INVALID_INPUT",
        message: "email and password are required"
      }
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    return res.status(401).json({
      error: {
        code: "AUTH_INVALID_CREDENTIALS",
        message: error?.message ?? "Invalid credentials"
      }
    });
  }

  return res.json({
    user: { id: data.user.id, email: data.user.email },
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at
    }
  });
});

app.get("/api/auth/me", async (req: Request, res: Response) => {
  if (!supabase) {
    return sendAppError(res, 500, "APP_DB_NOT_CONFIGURED", "Supabase is not configured.");
  }

  const auth = String(req.headers.authorization ?? "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return res.status(401).json({ error: { code: "AUTH_UNAUTHORIZED", message: "Missing bearer token" } });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: { code: "AUTH_UNAUTHORIZED", message: error?.message ?? "Invalid token" } });
  }

  return res.json({ user: { id: data.user.id, email: data.user.email } });
});

app.post("/api/auth/logout", (_req: Request, res: Response) => {
  return res.json({ ok: true });
});

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
    const details = String(error.message ?? "");
    if (details.includes("Could not find the table 'public.apps'")) {
      sendAppError(res, 503, "APP_DB_NOT_READY", "Database is reachable but schema is not initialized.", "Run supabase/init.sql first.");
      return;
    }
    sendAppError(res, 500, "APP_DB_QUERY_FAILED", "Failed to query apps.", details);
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
    const details = String(error.message ?? "");
    if (details.includes("Could not find the table 'public.apps'")) {
      sendAppError(res, 503, "APP_DB_NOT_READY", "Database is reachable but schema is not initialized.", "Run supabase/init.sql first.");
      return;
    }
    sendAppError(res, 500, "APP_DB_QUERY_FAILED", "Failed to query app detail.", details);
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
