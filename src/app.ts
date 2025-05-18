import createApp from "@/lib/create-app";
import auth from "@/routes/auth/auth.index";
import index from "@/routes/index.route";
import users from "@/routes/users/users.index";

import configureOpenAPI from "./lib/configure-open-api";

const app = createApp();

const routes = [
  index,
  users,
  auth,
];
configureOpenAPI(app);
routes.forEach((route) => {
  app.route("/", route);
});

export default app;
