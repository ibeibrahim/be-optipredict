import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth.middleware";

import * as handlers from "./predict.handlers";
import * as routes from "./predict.routes";

const router = createRouter();

router.use("/predict/*", authMiddleware);

router
  .openapi(routes.getHistory, handlers.getHistory)
  .openapi(routes.getOneHistory, handlers.getOneHistory)
  .openapi(routes.predictAll, handlers.predictAll)
export default router;
