import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { notificationService } from "../../services/notification.service.js";
import { AuthUser } from "../../types/auth.js";
import { APP_REQUEST_STATUSES, AppRequestStatus } from "../../types/enums.js";
import { CreateAppRequestInput, ListAppRequestsQuery, RejectAppRequestInput } from "./appRequests.types.js";

const createRequestSchema = z.object({
  appId: z.string().min(1),
  requestReason: z.string().min(10).max(2000)
});

const listSchema = z.object({
  status: z.enum(APP_REQUEST_STATUSES).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20)
});

const rejectSchema = z.object({
  rejectionReason: z.string().min(5).max(2000)
});

function makeHttpError(message: string, status: number): Error & { status: number } {
  const error = new Error(message) as Error & { status: number };
  error.status = status;
  return error;
}

export class AppRequestsService {
  async createRequest(actor: AuthUser, payload: CreateAppRequestInput) {
    if (actor.role !== "USER") {
      throw makeHttpError("Only USER can submit app requests", StatusCodes.FORBIDDEN);
    }

    const data = createRequestSchema.parse(payload);

    const app = await prisma.app.findUnique({ where: { id: data.appId } });
    if (!app) {
      throw makeHttpError("App not found", StatusCodes.NOT_FOUND);
    }

    const created = await prisma.appRequest.create({
      data: {
        appId: data.appId,
        requesterId: actor.id,
        organizationId: actor.organizationId,
        requestReason: data.requestReason,
        status: "PENDING"
      }
    });

    await notificationService.notifyAdminsForNewRequest({
      requestId: created.id,
      appId: created.appId,
      requesterId: created.requesterId,
      reason: created.requestReason
    });

    return created;
  }

  async listRequests(query: ListAppRequestsQuery) {
    const parsed = listSchema.parse(query);
    const skip = (parsed.page - 1) * parsed.limit;

    const [items, total] = await prisma.$transaction([
      prisma.appRequest.findMany({
        where: {
          ...(parsed.status ? { status: parsed.status } : {})
        },
        include: {
          app: { select: { id: true, key: true, name: true } },
          requester: { select: { id: true, name: true, email: true } },
          processor: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parsed.limit
      }),
      prisma.appRequest.count({
        where: {
          ...(parsed.status ? { status: parsed.status } : {})
        }
      })
    ]);

    return {
      items,
      page: parsed.page,
      limit: parsed.limit,
      total
    };
  }

  async approveRequest(requestId: string, actor: AuthUser) {
    const request = await prisma.appRequest.findUnique({ where: { id: requestId } });
    if (!request) {
      throw makeHttpError("Request not found", StatusCodes.NOT_FOUND);
    }

    if (request.status !== "PENDING") {
      throw makeHttpError("Only pending request can be approved", StatusCodes.CONFLICT);
    }

    const updated = await prisma.appRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        processorId: actor.id,
        processedAt: new Date(),
        rejectionReason: null
      }
    });

    await notificationService.notifyRequesterApproved({
      requestId: updated.id,
      requesterId: updated.requesterId,
      appId: updated.appId
    });

    return updated;
  }

  async rejectRequest(requestId: string, payload: RejectAppRequestInput, actor: AuthUser) {
    const data = rejectSchema.parse(payload);
    const request = await prisma.appRequest.findUnique({ where: { id: requestId } });

    if (!request) {
      throw makeHttpError("Request not found", StatusCodes.NOT_FOUND);
    }

    if (request.status !== "PENDING") {
      throw makeHttpError("Only pending request can be rejected", StatusCodes.CONFLICT);
    }

    const updated = await prisma.appRequest.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
        rejectionReason: data.rejectionReason,
        processorId: actor.id,
        processedAt: new Date()
      }
    });

    await notificationService.notifyRequesterRejected({
      requestId: updated.id,
      requesterId: updated.requesterId,
      appId: updated.appId,
      rejectionReason: data.rejectionReason
    });

    return updated;
  }
}

export const appRequestsService = new AppRequestsService();
