import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir, true);

export default defineConfig({
  schema: "./db/schema.ts",
  out: "drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
});
