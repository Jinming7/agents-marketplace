import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { USER_ROLES, UserRole } from "../types/enums.js";

const DEFAULT_USER_ID = "mock-user-id";
const DEFAULT_ORG_ID = "mock-org-id";

export function mockAuth(req: Request, _res: Response, next: NextFunction): void {
  const headerUserId = req.header("x-user-id");
  const requestedRole = req.header("x-user-role");
  const headerOrgId = req.header("x-org-id");
  const headerRole = USER_ROLES.includes(requestedRole as UserRole)
    ? (requestedRole as UserRole)
    : undefined;

  req.user = {
    id: headerUserId ?? DEFAULT_USER_ID,
    role: headerRole ?? "USER",
    organizationId: headerOrgId ?? DEFAULT_ORG_ID
  };

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    return;
  }
  next();
}

export function requireRoles(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}

export const requireAdmin = requireRoles(["ORG_ADMIN", "PRODUCT_ADMIN"]);
