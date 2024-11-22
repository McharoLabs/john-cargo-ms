import "./env.config";

export const appConfig = {
  appName: process.env.APP_NAME || "NextJs",
  baseUrl: process.env.APP_URL || "http://localhost:3000",
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
  secret: process.env.AUTH_SECRET || "secret",
  basePath: process.env.BASE_PATH || "/",
};
