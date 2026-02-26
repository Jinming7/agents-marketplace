import { AppRecord, SearchResponse } from "./types";

const backendBaseUrl = process.env.BACKEND_BASE_URL ?? "http://localhost:3001";

export async function fetchApps(): Promise<SearchResponse> {
  const response = await fetch(`${backendBaseUrl}/api/apps/search`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return { items: [], total: 0 };
  }

  return (await response.json()) as SearchResponse;
}

export async function fetchAppByKey(appKey: string): Promise<AppRecord | null> {
  const response = await fetch(`${backendBaseUrl}/api/apps/${encodeURIComponent(appKey)}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as AppRecord;
}
