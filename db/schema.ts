import {
  boolean,
  pgTable,
  varchar,
  timestamp,
  decimal,
  uuid,
  pgEnum,
  integer,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";

export const staffs = pgTable("staffs", {
  staffId: uuid("staff_id").primaryKey().notNull().unique().defaultRandom(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  contact: varchar("contact", { length: 50 }).notNull(),
  password: varchar("password", { length: 255 }),
  isSuperUser: boolean("is_super_user").default(false).notNull(),
  department: varchar("department", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Staff = InferSelectModel<typeof staffs>;

export const customers = pgTable("customers", {
  customerId: uuid("customer_id")
    .primaryKey()
    .notNull()
    .unique()
    .defaultRandom(),
  codeNumber: varchar("code_number", { length: 50 }).notNull().unique(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  contact: varchar("contact", { length: 50 }).notNull(),
  region: varchar("region").notNull(),
  district: varchar("district").notNull(),
  addedBy: uuid("added_by")
    .references(() => staffs.staffId, { onDelete: "restrict" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const receiptStatusEnum = pgEnum("receipt_status", [
  "Not Paid",
  "Partially Paid",
  "Paid in Full",
]);

export const currency = pgTable("currency", {
  currency_id: uuid("currency_id")
    .primaryKey()
    .notNull()
    .unique()
    .defaultRandom(),
  currency_code: varchar("currency_code", { length: 3 }).notNull(),
  currency_name: varchar("currency_name", { length: 50 }).notNull(),
  symbol: varchar("symbol", { length: 5 }).notNull(),
  exchange_rate: decimal("exchange_rate", {
    precision: 10,
    scale: 4,
  }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  base_currency_id: uuid("base_currency_id").references(
    (): AnyPgColumn => currency.currency_id,
    { onDelete: "set null" }
  ),
});

export const receipts = pgTable("receipt", {
  receiptId: uuid("receipt_id").primaryKey().notNull().unique().defaultRandom(),
  codeNumber: varchar("code_number", { length: 50 })
    .references(() => customers.codeNumber)
    .notNull(),
  postingDate: timestamp("posting_date").notNull(),
  totalBox: integer("total_box").notNull(),
  totalWeight: decimal("total_weight", { precision: 10, scale: 2 }).notNull(),
  costPerKg: decimal("cost_per_kg", { precision: 10, scale: 2 }).notNull(),
  costPerKyCurrency: varchar("costPerKyCurency").notNull(),
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
  paymentCurrency: varchar("payment_currency").notNull(),
  creditAmount: decimal("credit_amount", { precision: 10, scale: 2 }),
  outstanding: decimal("outstanding", { precision: 10, scale: 2 }),
  balance: decimal("balance", { precision: 10, scale: 2 }),
  status: receiptStatusEnum("status").notNull().default("Partially Paid"),
  shipped: boolean("shipped").default(false).notNull(),
  received: boolean("received").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const customersRelation = relations(customers, ({ many }) => ({
  receipts: many(receipts),
}));

export const receiptsRelations = relations(receipts, ({ one }) => ({
  customer: one(customers, {
    fields: [receipts.codeNumber],
    references: [customers.codeNumber],
  }),
}));
