import { Router } from "express";
import appsRoutes from "./apps.routes.js";
import appRequestsRoutes from "./appRequests.routes.js";

const apiRouter = Router();

apiRouter.use("/apps", appsRoutes);
apiRouter.use("/app-requests", appRequestsRoutes);

export default apiRouter;
