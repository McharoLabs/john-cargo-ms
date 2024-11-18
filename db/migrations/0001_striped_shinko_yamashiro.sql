ALTER TABLE "currency" ALTER COLUMN "currency_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "customer_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "staffs" ALTER COLUMN "currency_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "staffs" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "staffs" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_receipt_id_unique" UNIQUE("receipt_id");