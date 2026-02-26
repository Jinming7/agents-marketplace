import express, { Request, Response } from "express";

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

const apps: AppRecord[] = [
  {
    appKey: "slack",
    name: "Slack",
    summary: "Send alerts and notifications to Slack channels.",
    description: "Placeholder integration for Slack app install flow.",
    install: {
      status: "placeholder",
      isInstallable: true,
      ctaEnabled: false,
      ctaLabel: "Install (Coming Soon)"
    }
  },
  {
    appKey: "github",
    name: "GitHub",
    summary: "Connect repository and pull request events.",
    description: "Placeholder integration for GitHub app install flow.",
    install: {
      status: "placeholder",
      isInstallable: true,
      ctaEnabled: false,
      ctaLabel: "Install (Coming Soon)"
    }
  },
  {
    appKey: "notion",
    name: "Notion",
    summary: "Sync docs and tasks with Notion.",
    description: "Placeholder integration for Notion app install flow.",
    install: {
      status: "placeholder",
      isInstallable: true,
      ctaEnabled: false,
      ctaLabel: "Install (Coming Soon)"
    }
  }
];

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

app.get("/api/apps/search", (req: Request, res: Response) => {
  const q = req.query.q;

  if (Array.isArray(q)) {
    sendAppError(res, 400, "APP_INVALID_QUERY", "Query parameter 'q' must be a string.");
    return;
  }

  const normalized = typeof q === "string" ? q.trim().toLowerCase() : "";
  const items = normalized
    ? apps.filter((entry) => {
        const haystack = `${entry.appKey} ${entry.name} ${entry.summary}`.toLowerCase();
        return haystack.includes(normalized);
      })
    : apps;

  res.json({
    items,
    total: items.length
  });
});

app.get("/api/apps/:appKey", (req: Request, res: Response) => {
  const appKey = req.params.appKey?.trim().toLowerCase();

  if (!appKey) {
    sendAppError(res, 400, "APP_INVALID_KEY", "Path parameter 'appKey' is required.");
    return;
  }

  const found = apps.find((entry) => entry.appKey === appKey);
  if (!found) {
    sendAppError(res, 404, "APP_NOT_FOUND", `App '${appKey}' does not exist.`);
    return;
  }

  res.json(found);
});

app.use((req, res) => {
  sendAppError(res, 404, "APP_ROUTE_NOT_FOUND", `Route '${req.path}' does not exist.`);
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
