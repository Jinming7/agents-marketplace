import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { appsService } from "./apps.service.js";

export class AppsController {
  async listApps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await appsService.listApps(req.query);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAppByKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appKey = String(req.params.appKey ?? "");
      const app = await appsService.getAppByKey(appKey);

      res.status(StatusCodes.OK).json({
        _links: {
          self: { href: `/api/apps/${appKey}` }
        },
        ...app
      });
    } catch (error) {
      next(error);
    }
  }
}

export const appsController = new AppsController();
