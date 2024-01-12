import { Common } from "@strapi/strapi";

const { createCoreRouter } = require("@strapi/strapi").factories;
export const customRouter = (
  api: Common.UID.ContentType,
  extraRoutes: {
    method: "POST" | "GET" | "PUT" | "DELETE";
    path: string;
    handler: string;
  }[] = []
) => {
  const defaultRouter = createCoreRouter(api);

  let routes;
  return {
    get prefix() {
      return defaultRouter.prefix;
    },
    get routes() {
      if (!routes) routes = defaultRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};
