import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth.middleware";

import * as handlers from "./predict.handlers";
import * as routes from "./predict.routes";

const router = createRouter();

router.use("/predict/*", authMiddleware);
router.use("/history", authMiddleware);

router
  .openapi(routes.getHistory, handlers.getHistory)
  .openapi(routes.predictAll, handlers.predictAll)
export default router;
