import { defineConfig } from "drizzle-kit";
import { databaseConfig } from "./config/database.config";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseConfig.dbUrl!,
  },
});
