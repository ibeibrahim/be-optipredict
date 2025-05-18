import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Env } from "hono";
import type { PinoLogger } from "hono-pino";

export type AppBindings = Env & {
  Variables: {
    logger: PinoLogger;
    userId?: number; // Added for authentication
  };
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
