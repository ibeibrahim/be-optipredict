import type { AppOpenAPI } from "./types";

import packageJSON from "../../package.json" with { type: "json" };
import { Scalar } from "@scalar/hono-api-reference";

export default function configureOpenAPI(app: AppOpenAPI){
    app.doc("/doc", {
        openapi: "3.0.0",
        info: {
        version: packageJSON.version,
        title: "OptiPredict API",
        },
    });

    app.get('/scalar', Scalar({
        url: '/doc',
        pageTitle: 'OptiPredict API',
        theme: 'kepler',
        layout: 'classic',
        defaultHttpClient: {
            targetKey: 'js',
            clientKey: 'fetch',
        }
    }))
}