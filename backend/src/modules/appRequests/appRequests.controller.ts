import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { appRequestsService } from "./appRequests.service.js";

export class AppRequestsController {
  async createRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result = await appRequestsService.createRequest(req.user, req.body);
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await appRequestsService.listRequests(req.query);
      res.status(StatusCodes.OK).json({
        _links: {
          self: { href: "/api/app-requests" }
        },
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  async approveRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result = await appRequestsService.approveRequest(String(req.params.requestId ?? ""), req.user);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async rejectRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result = await appRequestsService.rejectRequest(
        String(req.params.requestId ?? ""),
        req.body,
        req.user
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const appRequestsController = new AppRequestsController();
