import { config } from "dotenv";

config({ path: ".env.local" });

export const appConfig = {
  appName: process.env.APP_NAME || "NextJs",

  baseUrl: process.env.APP_URL || "http://localhost:3000",

  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
};
