import {
  boolean,
  pgTable,
  varchar,
  timestamp,
  decimal,
  uuid,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";

export const staffs = pgTable("staffs", {
  staffId: uuid("staff_id").primaryKey().notNull().unique().defaultRandom(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  contact: varchar("contact", { length: 50 }).notNull().unique(),
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
  email: varchar("email", { length: 255 }).notNull(),
  contact: varchar("contact", { length: 50 }).notNull().unique(),
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

export type Customer = InferSelectModel<typeof customers>;

export const receiptStatusEnum = pgEnum("receipt_status", [
  "Partially Paid",
  "Paid",
  "Unpaid",
]);

export const currency = pgTable("currency", {
  currency_id: uuid("currency_id")
    .primaryKey()
    .notNull()
    .unique()
    .defaultRandom(),
  currency_code: varchar("currency_code", { length: 3 }).notNull().unique(),
  currency_name: varchar("currency_name", { length: 50 }).notNull().unique(),
  symbol: varchar("symbol", { length: 5 }).notNull().unique(),
  rate_to_tzs: decimal("rate_to_tzs", {
    precision: 10,
    scale: 4,
  }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Currency = InferSelectModel<typeof currency>;

export const receipts = pgTable("receipt", {
  receiptId: uuid("receipt_id").primaryKey().notNull().unique().defaultRandom(),
  customerCareId: uuid("customer_care_id")
    .references(() => staffs.staffId, {
      onDelete: "restrict",
    })
    .notNull(),
  codeNumber: varchar("code_number", { length: 50 })
    .references(() => customers.codeNumber)
    .notNull(),
  postingDate: timestamp("posting_date").notNull(),
  totalBox: integer("total_box").notNull(),
  totalWeight: decimal("total_weight", { precision: 30, scale: 15 }).notNull(),
  costPerKg: decimal("cost_per_kg", { precision: 30, scale: 15 }).notNull(),
  costPerKgCurrency: varchar("cost_per_kg_currency").notNull(),
  totalShipmentUSD: decimal("total_shipment_usd", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalShipmentTshs: decimal("total_shipment_tshs", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalPaidInTzs: decimal("total_paid_in_tzs", {
    precision: 30,
    scale: 15,
  }).notNull(),
  totalPaidInUsd: decimal("total_paid_in_usd", {
    precision: 30,
    scale: 15,
  }).notNull(),
  paymentCurrency: varchar("payment_currency").notNull(),
  creditAmount: decimal("credit_amount", { precision: 30, scale: 15 }),
  outstanding: decimal("outstanding", { precision: 30, scale: 15 }),
  balance: decimal("balance", { precision: 30, scale: 15 }),
  status: receiptStatusEnum("status").notNull().default("Partially Paid"),
  shipped: boolean("shipped").default(false).notNull(),
  costPerKgExchangeRate: decimal("cost_per_kg_exchange_rate", {
    precision: 10,
    scale: 2,
  }).notNull(),
  paymentCurrencyExchangeRate: decimal("payment_currency_xxchange_rate", {
    precision: 10,
    scale: 2,
  }).notNull(),
  usdExchangeRate: decimal("usd_exchange_rate", {
    precision: 10,
    scale: 2,
  }).notNull(),
  received: boolean("received").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Receipt = InferSelectModel<typeof receipts>;

export const customersRelation = relations(customers, ({ many }) => ({
  receipts: many(receipts),
}));

export const receiptsRelations = relations(receipts, ({ one }) => ({
  customer: one(customers, {
    fields: [receipts.codeNumber],
    references: [customers.codeNumber],
  }),
  staff: one(staffs, {
    fields: [receipts.customerCareId],
    references: [staffs.staffId],
  }),
}));

export type ReceiptWithRelations = Receipt & {
  customer: Customer;
  staff: Staff;
};
