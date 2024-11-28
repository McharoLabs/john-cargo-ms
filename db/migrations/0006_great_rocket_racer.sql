ALTER TABLE "receipt" ADD COLUMN "customer_care_id" uuid;--> statement-breakpoint
ALTER TABLE "receipt" ADD COLUMN "cost_per_kg_exchange_rate" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "receipt" ADD COLUMN "payment_currency_xxchange_rate" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "receipt" ADD COLUMN "usd_exchange_rate" numeric(10, 2) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "receipt" ADD CONSTRAINT "receipt_customer_care_id_staffs_staff_id_fk" FOREIGN KEY ("customer_care_id") REFERENCES "public"."staffs"("staff_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
