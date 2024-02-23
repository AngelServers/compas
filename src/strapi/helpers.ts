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

export const terminalBox = (text: string, length?: number) => {
  if (!length) length = text.length;

  console.log("┌" + "─".repeat(length + 2) + "┐");
  console.log("│ " + text + " │");
  console.log("└" + "─".repeat(length + 2) + "┘");
};
