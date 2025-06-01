import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import { AuthErrorSchema } from "@/schemas/auth.schema";
import { PredictionResponseSchema, PredictRequestSchema } from "@/schemas/predict.schema";

const tags = ["Prediction"];

export const getHistory = createRoute({
  method: "get",
  tags,
  path: "/predict/history",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(PredictionResponseSchema),
      "List of History prediction",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "History not found",
    ),
  },
});

export const getOneHistory = createRoute({
  method: "get",
  tags,
  path: "/predict/history/{id}",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      PredictionResponseSchema,
      "History prediction details",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "History not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const predictAll = createRoute({
  method: "post",
  tags,
  path: "/predict",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: PredictRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      PredictionResponseSchema,
      "Successfully created prediction data",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(PredictRequestSchema),
      "Validation error",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      AuthErrorSchema,
      "Internal Server Error",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Authentication required"),
      "User is not authenticated",
    ),
  },
});

export type HistoryPrediction = typeof getHistory;
export type Prediction = typeof predictAll;
export type PredictionDetail = typeof getOneHistory;
