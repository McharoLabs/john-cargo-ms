DO $$ BEGIN
 CREATE TYPE "public"."cargo_status" AS ENUM('Not Paid', 'Partially Paid', 'Paid in Full');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cargo" (
	"cargo_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code_number" varchar(50) NOT NULL,
	"posting_date" timestamp NOT NULL,
	"total_box" numeric(10, 0) NOT NULL,
	"total_weight" numeric(10, 2) NOT NULL,
	"cost_per_kg" numeric(10, 2) NOT NULL,
	"total_shipment_usd" numeric(10, 2) NOT NULL,
	"exchange_rate" numeric(10, 2) NOT NULL,
	"total_shipment_tshs" numeric(10, 2) NOT NULL,
	"amount_paid" numeric(10, 2) NOT NULL,
	"credit_amount" numeric(10, 2),
	"outstanding" numeric(10, 2),
	"balance" numeric(10, 2),
	"status" "cargo_status" DEFAULT 'Not Paid' NOT NULL,
	"shipped" boolean DEFAULT false NOT NULL,
	"received" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staffs" (
	"staff_id" uuid PRIMARY KEY NOT NULL,
	"is_super_user" boolean DEFAULT false NOT NULL,
	"department" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code_number" varchar(50) NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"contact" varchar(50) NOT NULL,
	"password" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_code_number_unique" UNIQUE("code_number"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cargo" ADD CONSTRAINT "cargo_code_number_users_code_number_fk" FOREIGN KEY ("code_number") REFERENCES "public"."users"("code_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staffs" ADD CONSTRAINT "staffs_staff_id_users_user_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
