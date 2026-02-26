import { AppCardModel, AppDetailModel, HostingKind } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export class AppApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

type UnknownRecord = Record<string, unknown>;

function toHostingKinds(hosting: unknown): HostingKind[] {
  if (Array.isArray(hosting)) {
    return hosting
      .map((item) => String(item).toLowerCase())
      .filter((item): item is HostingKind => item === "cloud" || item === "on-prem" || item === "private-cloud");
  }

  const raw = String(hosting ?? "").toLowerCase();
  if (raw === "hybrid") return ["cloud", "on-prem"];
  if (raw === "onprem" || raw === "on-prem") return ["on-prem"];
  if (raw === "private-cloud" || raw === "private_cloud") return ["private-cloud"];
  return ["cloud"];
}

async function parseError(response: Response): Promise<never> {
  let payload: UnknownRecord = {};
  try {
    payload = (await response.json()) as UnknownRecord;
  } catch {
    // ignore json parse error
  }

  const code = String(payload.code ?? `APP_HTTP_${response.status}`);
  const message = String(payload.message ?? "Marketplace API request failed");
  throw new AppApiError(code.startsWith("APP_") ? code : `APP_${code}`, response.status, message);
}

function mapAppSummary(data: UnknownRecord): AppCardModel | null {
  if (data.published === false || data.status === "UNPUBLISHED") {
    return null;
  }

  const hosting = toHostingKinds(data.compatibility ?? data.hosting);
  const minOnesVersion = typeof data.min_ones_version === "string" ? data.min_ones_version : typeof data.minOnesVersion === "string" ? data.minOnesVersion : undefined;
  const hot =
    typeof data.installCount7d === "number"
      ? data.installCount7d
      : typeof data.install_count_7d === "number"
        ? data.install_count_7d
        : Number(data.installCount7d ?? data.install_count_7d ?? data.installs ?? 0);

  return {
    id: String(data.id ?? data.key ?? ""),
    key: String(data.key ?? data.id ?? ""),
    logoUrl: String(data.logoUrl ?? ""),
    name: String(data.name ?? ""),
    partnerName: String((data.partner as UnknownRecord | undefined)?.name ?? data.partnerName ?? "Unknown Partner"),
    rating: Number(data.ratingAverage ?? data.rating ?? 0),
    installs: Number.isFinite(hot) ? hot : 0,
    summary: String(data.summary ?? ""),
    shortDescription: String(data.shortDescription ?? data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map((item) => String(item)) : [String(data.category ?? "Marketplace")],
    programs: (Array.isArray(data.programs) ? data.programs : []).map((code) => ({ code: String(code), label: String(code).replaceAll("_", " ") })),
    category: typeof data.category === "string" ? data.category : undefined,
    supportedHosting: hosting,
    compatibility: {
      cloudLabel: hosting.includes("cloud") ? "Cloud" : undefined,
      onPremLabel: hosting.includes("on-prem") ? "On-Prem" : undefined,
      privateCloudLabel: hosting.includes("private-cloud") ? "Private Cloud" : undefined,
      minOnesVersion,
      testedOn: minOnesVersion ? `>= ${minOnesVersion}` : undefined
    },
    featureSpotlights: [],
    detailImages: [],
    longDescription: String(data.description ?? data.summary ?? "")
  };
}

export async function searchApps(): Promise<AppCardModel[]> {
  const response = await fetch(`${API_BASE_URL}/api/apps/search?sortBy=hot&page=1&limit=50`, { cache: "no-store" });
  if (!response.ok) {
    await parseError(response);
  }

  const data = (await response.json()) as UnknownRecord;
  const appsRaw = (Array.isArray(data.apps)
    ? data.apps
    : Array.isArray((data._embedded as UnknownRecord | undefined)?.apps)
      ? (data._embedded as UnknownRecord).apps
      : []) as UnknownRecord[];

  return appsRaw
    .map(mapAppSummary)
    .filter((item): item is AppCardModel => Boolean(item))
    .sort((a, b) => b.installs - a.installs);
}

export async function getAppDetail(appKey: string): Promise<AppDetailModel> {
  const response = await fetch(`${API_BASE_URL}/api/apps/${appKey}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    await parseError(response);
  }

  const data = (await response.json()) as UnknownRecord;
  const base = mapAppSummary(data);
  if (!base) {
    throw new AppApiError("APP_NOT_FOUND", 404, "App not found");
  }

  const screenshotCandidates = Array.isArray(data.screenshots)
    ? (data.screenshots as UnknownRecord[])
    : Array.isArray(data.detailImages)
      ? (data.detailImages as UnknownRecord[])
      : [];

  const detailImages = screenshotCandidates
    .filter((item) => {
      const size = Number((item as UnknownRecord).size ?? 0);
      return !Number.isFinite(size) || size <= 2 * 1024 * 1024;
    })
    .slice(0, 8)
    .map((item) => String((item as UnknownRecord).url ?? item));

  return {
    ...base,
    detailImages,
    longDescription: String(data.description ?? data.longDescription ?? base.summary),
    description: typeof data.description === "string" ? data.description : undefined,
    pricingModel: typeof data.pricingModel === "string" ? data.pricingModel : undefined,
    partner: (data.partner as AppDetailModel["partner"]) ?? undefined,
    reviews: Array.isArray(data.reviews) ? (data.reviews as AppDetailModel["reviews"]) : [],
    securityInfo: (data.securityInfo as AppDetailModel["securityInfo"]) ?? undefined
  };
}
