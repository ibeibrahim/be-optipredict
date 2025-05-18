import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { AuthErrorSchema, AuthResponseSchema, LoginRequestSchema, RegisterRequestSchema } from "@/schemas/auth.schema";

const tags = ["Auth"];

export const register = createRoute({
  method: "post",
  tags,
  path: "/auth/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      AuthResponseSchema,
      "Successfully registered user with auth token",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      AuthErrorSchema,
      "Email already exists",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(RegisterRequestSchema),
      "Validation error",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      AuthErrorSchema,
      "Internal Server Error",
    ),
  },
});

export const login = createRoute({
  method: "post",
  tags,
  path: "/auth/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      AuthResponseSchema,
      "Successfully logged in with auth token",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      AuthErrorSchema,
      "Invalid credentials",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(LoginRequestSchema),
      "Validation error",
    ),
  },
});

export type Register = typeof register;
export type Login = typeof login;
