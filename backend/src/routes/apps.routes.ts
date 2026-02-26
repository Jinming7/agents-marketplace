import { Router } from "express";
import { appsController } from "../modules/apps/apps.controller.js";

const router = Router();

router.get("/", (req, res, next) => appsController.listApps(req, res, next));
router.get("/search", (req, res, next) => appsController.listApps(req, res, next));
router.get("/:appKey", (req, res, next) => appsController.getAppByKey(req, res, next));

export default router;
