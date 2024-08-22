import { migrate } from "drizzle-orm/vercel-postgres/migrator";

import { loadEnvConfig } from "@next/env";
import { db } from "@/db";

const projectDir = process.cwd();
loadEnvConfig(projectDir, true);

async function main() {
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

main();
