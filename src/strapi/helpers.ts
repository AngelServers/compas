export const customRouter = (
  defaultRouter: any,
  extraRoutes: {
    method: "POST" | "GET" | "PUT" | "DELETE";
    path: string;
    handler: string;
  }[] = []
) => {
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
