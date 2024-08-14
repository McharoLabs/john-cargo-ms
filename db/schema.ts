import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  varchar,
  timestamp,
  decimal,
  uuid,
  text,
  pgEnum,
  customType,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";


export const userTable = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  codeNumber: varchar("code_number", { length: 50 }).unique().notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  contact: varchar("contact", { length: 50 }).notNull(),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const staffTable = pgTable("staffs", {
  staffId: uuid("staff_id")
    .primaryKey()
    .references(() => userTable.userId)
    .notNull(),
  isSuperUser: boolean("is_super_user").default(false).notNull(),
  department: varchar("department", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const cargoStatusEnum = pgEnum("cargo_status", [
  "Not Paid",
  "Partially Paid",
  "Paid in Full",
]);

export const cargoTable = pgTable("cargo", {
  cargoId: uuid("cargo_id").primaryKey().defaultRandom(),
  codeNumber: varchar("code_number", { length: 50 })
    .references(() => userTable.codeNumber)
    .notNull(),
  postingDate: timestamp("posting_date").notNull(),
  totalBox: decimal("total_box", { precision: 10, scale: 0 }).notNull(),
  totalWeight: decimal("total_weight", { precision: 10, scale: 2 }).notNull(),
  costPerKg: decimal("cost_per_kg", { precision: 10, scale: 2 }).notNull(),
  totalShipmentUSD: decimal("total_shipment_usd", {
    precision: 10,
    scale: 2,
  }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 2 }).notNull(),
  totalShipmentTshs: decimal("total_shipment_tshs", {
    precision: 10,
    scale: 2,
  }).notNull(),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
  creditAmount: decimal("credit_amount", { precision: 10, scale: 2 }).notNull(),
  outstanding: decimal("outstanding", { precision: 10, scale: 2 }).notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull(),
  status: cargoStatusEnum("status").notNull().default("Not Paid"),
  shipped: boolean("shipped").default(false).notNull(),
  received: boolean("received").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
