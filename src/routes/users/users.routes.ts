import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import { AuthErrorSchema } from "@/schemas/auth.schema";
import { UpdateProfileRequestSchema, UserResponseSchema } from "@/schemas/user.schema";

const tags = ["Users"];

export const list = createRoute({
  method: "get",
  tags,
  path: "/users",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(UserResponseSchema),
      "List of Users",
    ),
  },
});
export const getOne = createRoute({
  method: "get",
  tags,
  path: "/users/{id}",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserResponseSchema,
      "Users Data",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UpdateProfileRequestSchema),
      "Validation error",
    ),
  },
});
export const updateOne = createRoute({
  method: "post",
  tags,
  path: "/users/{id}",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateProfileRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserResponseSchema,
      "Successfully updated user data",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UpdateProfileRequestSchema),
      "Validation error",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      AuthErrorSchema,
      "Internal Server Error",
    ),

  },
});

export type ListUsers = typeof list;
export type User = typeof getOne;
export type updateUser = typeof updateOne;
