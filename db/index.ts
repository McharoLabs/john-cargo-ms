import { drizzle } from "drizzle-orm/vercel-postgres/driver";
import * as schema from "./schema";
import { sql } from "@vercel/postgres";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir, true);

export const db = drizzle(sql, { schema });
