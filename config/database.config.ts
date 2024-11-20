import { config } from "dotenv";
config({ path: ".env.local" });

export const databaseConfig = {
  dbUrl: process.env.POSTGRES_URL,
};
