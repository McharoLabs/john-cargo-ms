import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";
import { databaseConfig } from "@/config/database.config";

const sql = neon(databaseConfig.dbUrl!);

export const db = drizzle(sql, { logger: true, schema });
