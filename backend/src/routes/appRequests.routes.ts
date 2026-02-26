import { Router } from "express";
import { appRequestsController } from "../modules/appRequests/appRequests.controller.js";
import { requireAdmin, requireAuth, requireRoles } from "../middlewares/auth.js";

const router = Router();

router.post("/", requireAuth, requireRoles(["USER"]), (req, res, next) =>
  appRequestsController.createRequest(req, res, next)
);

router.get("/", requireAuth, requireAdmin, (req, res, next) =>
  appRequestsController.listRequests(req, res, next)
);

router.put("/:requestId/approve", requireAuth, requireAdmin, (req, res, next) =>
  appRequestsController.approveRequest(req, res, next)
);

router.put("/:requestId/reject", requireAuth, requireAdmin, (req, res, next) =>
  appRequestsController.rejectRequest(req, res, next)
);

export default router;
