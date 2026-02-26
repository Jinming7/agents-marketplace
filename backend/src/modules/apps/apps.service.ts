import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../types/errors.js";
import { ListAppsQuery } from "./apps.types.js";

const compatibilityValues = ["cloud", "on-prem", "private-cloud"] as const;

const listAppsQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  compatibility: z.enum(compatibilityValues).optional(),
  sortBy: z.enum(["hot", "newest", "top-rated"]).default("hot"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20)
});

const sortMap = {
  hot: [{ installCount7d: "desc" as const }, { createdAt: "desc" as const }],
  newest: [{ createdAt: "desc" as const }],
  "top-rated": [{ ratingAverage: "desc" as const }, { ratingCount: "desc" as const }]
};

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function sanitizeScreenshots(value: unknown): string[] {
  const urls = readStringArray(value);
  return urls.slice(0, 8);
}

function toInstallablePlaceholder() {
  return {
    supported: false,
    reasonCode: "APP_INSTALLABILITY_PENDING" as const,
    message: "Installability check is not available yet"
  };
}

const fallbackApps = [
  {
    id: "app-fallback-scriptrunner-pro",
    key: "scriptrunner-pro",
    name: "ScriptRunner Pro",
    summary: "Advanced workflow automation and scripting toolkit for ONES.",
    logoUrl: null,
    ratingAverage: 4.9,
    ratingCount: 1203,
    installCount7d: 12000,
    hosting: "cloud",
    pricingModel: "paid",
    minOnesVersion: "6.2.0",
    compatibility: ["cloud", "on-prem"],
    screenshots: ["https://example.com/scriptrunner-1.png"],
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-02-20T00:00:00.000Z"),
    partner: {
      key: "adaptavist",
      name: "Adaptavist",
      verified: true
    }
  }
];

function useFallbackData(error: unknown): boolean {
  const message = error instanceof Error ? error.message : "";
  return message.includes("Can't reach database server");
}

function listFromFallback(rawQuery: ListAppsQuery) {
  const query = listAppsQuerySchema.parse(rawQuery);
  const filtered = fallbackApps.filter((app) => {
    const keywordPass = query.q
      ? app.name.toLowerCase().includes(query.q.toLowerCase()) || app.summary.toLowerCase().includes(query.q.toLowerCase())
      : true;
    const compatibilityPass = query.compatibility ? app.compatibility.includes(query.compatibility) : true;
    return keywordPass && compatibilityPass;
  });

  const start = (query.page - 1) * query.limit;
  const pageApps = filtered.slice(start, start + query.limit);

  return {
    page: query.page,
    limit: query.limit,
    total: filtered.length,
    apps: pageApps.map((app) => ({
      ...app,
      installable: toInstallablePlaceholder()
    }))
  };
}

function detailFromFallback(appKey: string) {
  const app = fallbackApps.find((item) => item.key === appKey);
  if (!app) {
    throw new AppError(StatusCodes.NOT_FOUND, "APP_NOT_FOUND", "App not found");
  }

  return {
    ...app,
    reviews: [],
    categories: [],
    installable: toInstallablePlaceholder()
  };
}

export class AppsService {
  async listApps(rawQuery: ListAppsQuery) {
    const query = listAppsQuerySchema.parse(rawQuery);
    const skip = (query.page - 1) * query.limit;

    const where = {
      isPublished: true,
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" as const } },
              { summary: { contains: query.q, mode: "insensitive" as const } }
            ]
          }
        : {}),
      ...(query.compatibility
        ? {
            compatibility: {
              array_contains: [query.compatibility]
            }
          }
        : {})
    };

    try {
      const [total, apps] = await Promise.all([
        prisma.app.count({ where }),
        prisma.app.findMany({
          where,
          orderBy: sortMap[query.sortBy],
          skip,
          take: query.limit,
          select: {
            id: true,
            key: true,
            name: true,
            summary: true,
            logoUrl: true,
            ratingAverage: true,
            ratingCount: true,
            installCount7d: true,
            hosting: true,
            pricingModel: true,
            minOnesVersion: true,
            compatibility: true,
            screenshots: true,
            createdAt: true,
            updatedAt: true,
            partner: {
              select: {
                key: true,
                name: true,
                verified: true
              }
            }
          }
        })
      ]);

      return {
        page: query.page,
        limit: query.limit,
        total,
        apps: apps.map((app) => ({
          ...app,
          compatibility: readStringArray(app.compatibility),
          screenshots: sanitizeScreenshots(app.screenshots),
          installable: toInstallablePlaceholder()
        }))
      };
    } catch (error) {
      if (useFallbackData(error)) {
        return listFromFallback(rawQuery);
      }
      throw error;
    }
  }

  async getAppByKey(appKey: string) {
    try {
      const app = await prisma.app.findFirst({
        where: {
          key: appKey,
          isPublished: true
        },
        include: {
          partner: true,
          reviews: {
            include: {
              user: {
                select: { id: true, name: true }
              }
            },
            orderBy: {
              createdAt: "desc"
            },
            take: 20
          },
          categories: true
        }
      });

      if (!app) {
        throw new AppError(StatusCodes.NOT_FOUND, "APP_NOT_FOUND", "App not found");
      }

      return {
        ...app,
        compatibility: readStringArray(app.compatibility),
        screenshots: sanitizeScreenshots(app.screenshots),
        installable: toInstallablePlaceholder()
      };
    } catch (error) {
      if (useFallbackData(error)) {
        return detailFromFallback(appKey);
      }
      throw error;
    }
  }
}

export const appsService = new AppsService();
