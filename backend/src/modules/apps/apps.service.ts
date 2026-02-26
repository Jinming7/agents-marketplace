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
  }

  async getAppByKey(appKey: string) {
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
  }
}

export const appsService = new AppsService();
