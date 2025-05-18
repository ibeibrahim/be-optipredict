import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import { UserResponseSchema } from "@/schemas/user.schema";

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
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),

  },
});

export type ListUsers = typeof list;
export type User = typeof getOne;
