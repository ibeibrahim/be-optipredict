import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth.middleware";

import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

const router = createRouter();

router.use("/users/*", authMiddleware);
router.use("/users", authMiddleware);

router
  .openapi(routes.list, handlers.list)
  .openapi(routes.getOne, handlers.userById);

export default router;
