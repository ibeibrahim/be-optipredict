import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import { AuthErrorSchema } from "@/schemas/auth.schema";
import { PredictionResponseSchema, PredictRequestSchema } from "@/schemas/predict.schema";

const tags = ["Prediction"];

export const getHistory = createRoute({
  method: "get",
  tags,
  path: "/users/{id}/history",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
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
  },
});

export type HistoryPrediction = typeof getHistory;
export type Prediction = typeof predictAll;
