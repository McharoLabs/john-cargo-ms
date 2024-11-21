import { config } from "dotenv";
config({ path: ".env.local" });

export const authConfig = {
  authSecret: process.env.AUTH_SECRET || "secret",
  basePath: process.env.BASE_PATH || "/",
};
