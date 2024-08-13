import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  varchar,
  timestamp,
  decimal,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const userTable = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  contact: varchar("contact", { length: 50 }).notNull(),
  isSuperUser: boolean("is_super_user").default(false).notNull(),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
