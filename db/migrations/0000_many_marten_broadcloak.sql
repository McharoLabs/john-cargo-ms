DO $$ BEGIN
 CREATE TYPE "public"."receipt_status" AS ENUM('Not Paid', 'Partially Paid', 'Paid in Full');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currency" (
	"currency_id" uuid PRIMARY KEY NOT NULL,
	"currency_code" varchar(3) NOT NULL,
	"currency_name" varchar(50) NOT NULL,
	"symbol" varchar(5) NOT NULL,
	"exchange_rate" numeric(10, 4) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"base_currency_id" uuid,
	CONSTRAINT "currency_currency_id_unique" UNIQUE("currency_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"customer_id" uuid PRIMARY KEY NOT NULL,
	"code_number" varchar(50) NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"contact" varchar(50) NOT NULL,
	"region" varchar NOT NULL,
	"district" varchar NOT NULL,
	"added_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_customer_id_unique" UNIQUE("customer_id"),
	CONSTRAINT "customers_code_number_unique" UNIQUE("code_number"),
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "receipt" (
	"receipt_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code_number" varchar(50) NOT NULL,
	"posting_date" timestamp NOT NULL,
	"total_box" integer NOT NULL,
	"total_weight" numeric(10, 2) NOT NULL,
	"cost_per_kg" numeric(10, 2) NOT NULL,
	"costPerKyCurency" varchar NOT NULL,
	"total_shipment_usd" numeric(10, 2) NOT NULL,
	"exchange_rate" numeric(10, 2) NOT NULL,
	"total_shipment_tshs" numeric(10, 2) NOT NULL,
	"amount_paid" numeric(10, 2) NOT NULL,
	"payment_currency" varchar NOT NULL,
	"credit_amount" numeric(10, 2),
	"outstanding" numeric(10, 2),
	"balance" numeric(10, 2),
	"status" "receipt_status" DEFAULT 'Partially Paid' NOT NULL,
	"shipped" boolean DEFAULT false NOT NULL,
	"received" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staffs" (
	"currency_id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"contact" varchar(50) NOT NULL,
	"password" varchar(255),
	"is_super_user" boolean DEFAULT false NOT NULL,
	"department" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "staffs_currency_id_unique" UNIQUE("currency_id"),
	CONSTRAINT "staffs_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "currency" ADD CONSTRAINT "currency_base_currency_id_currency_currency_id_fk" FOREIGN KEY ("base_currency_id") REFERENCES "public"."currency"("currency_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_added_by_staffs_currency_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."staffs"("currency_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "receipt" ADD CONSTRAINT "receipt_code_number_customers_code_number_fk" FOREIGN KEY ("code_number") REFERENCES "public"."customers"("code_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
