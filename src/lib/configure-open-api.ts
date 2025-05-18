import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

import packageJSON from "../../package.json" with { type: "json" };

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "OptiPredict API",
    },
  });

  app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Enter your JWT token in the format: Bearer {token}",
  });

  app.get("/reference", Scalar({
    url: "/api/doc",
    pageTitle: "OptiPredict API",
    theme: "kepler",
    layout: "classic",
    defaultHttpClient: {
      targetKey: "js",
      clientKey: "fetch",
    },
  }));
}
