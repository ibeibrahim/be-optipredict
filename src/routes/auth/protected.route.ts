import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import type { AppRouteHandler } from "@/lib/types";

import { notFoundSchema } from "@/lib/constants";
import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { prisma } from "@/prisma";
import { UserResponseSchema } from "@/schemas/user.schema";

// Define a protected route that requires authentication
export const me = createRoute({
  method: "get",
  tags: ["Auth"],
  path: "/auth/me",
  security: [{ bearerAuth: [] }], // Adds security requirement to OpenAPI documentation
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserResponseSchema,
      "Users Data",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
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

  if (!userId) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
  if (!user) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  const userData = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    photo_url: user.photo_url,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return c.json(userData, HttpStatusCodes.OK);
};

// Example of how to use the auth middleware with a protected route
const router = createRouter();

// Apply the auth middleware to this route
router.use("/auth/me", authMiddleware);
router.openapi(me, getCurrentUser);
export default router;
