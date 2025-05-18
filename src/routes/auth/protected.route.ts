import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import type { AppRouteHandler } from "@/lib/types";

import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth.middleware";

// Define a protected route that requires authentication
export const me = createRoute({
  method: "get",
  tags: ["Auth"],
  path: "/auth/me",
  security: [{ bearerAuth: [] }], // Adds security requirement to OpenAPI documentation
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Current user details"),
      "Current authenticated user information",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Authentication required"),
      "User is not authenticated",
    ),
  },
});

export type Me = typeof me;

// Handler for the protected route
export const getCurrentUser: AppRouteHandler<Me> = async (c) => {
  const userId = c.get("userId");

  return c.json({
    message: "Authenticated",
    userId,
  }, HttpStatusCodes.OK);
};

// Example of how to use the auth middleware with a protected route
const router = createRouter();

// Apply the auth middleware to this route
router.use("/auth/me", authMiddleware);
router.openapi(me, getCurrentUser);
export default router;
