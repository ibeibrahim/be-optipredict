import { createRouter } from "@/lib/create-app";

import * as handlers from "./auth.handlers";
import * as routes from "./auth.routes";
import protectedRoutes from "./protected.route";

const router = createRouter()
  .openapi(routes.register, handlers.register)
  .openapi(routes.login, handlers.login)
  .route("/", protectedRoutes);

export default router;