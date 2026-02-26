import { AppRecord, SearchResponse } from "./types";

const backendBaseUrl = process.env.BACKEND_BASE_URL ?? "http://localhost:3001";

const fallbackApps: AppRecord[] = [
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
  }
];

export async function fetchApps(): Promise<SearchResponse> {
  try {
    const response = await fetch(`${backendBaseUrl}/api/apps/search`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return { items: fallbackApps, total: fallbackApps.length };
    }

    return (await response.json()) as SearchResponse;
  } catch {
    return { items: fallbackApps, total: fallbackApps.length };
  }
}

export async function fetchAppByKey(appKey: string): Promise<AppRecord | null> {
  try {
    const response = await fetch(`${backendBaseUrl}/api/apps/${encodeURIComponent(appKey)}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return fallbackApps.find((item) => item.appKey === appKey) ?? null;
    }

    return (await response.json()) as AppRecord;
  } catch {
    return fallbackApps.find((item) => item.appKey === appKey) ?? null;
  }
}
