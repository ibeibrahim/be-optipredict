import { cors } from "hono/cors";

import createApp from "@/lib/create-app";
import auth from "@/routes/auth/auth.index";
import index from "@/routes/index.route";
import predicts from "@/routes/predict/predict.index";
import users from "@/routes/users/users.index";

import configureOpenAPI from "./lib/configure-open-api";

const app = createApp();

app.use("*", cors());

const routes = [
  index,
  users,
  predicts,
  auth,
];
configureOpenAPI(app);
routes.forEach((route) => {
  app.route("/", route);
});

export default app;
