ALTER TABLE "receipt" RENAME COLUMN "amount_paid" TO "total_paid_in_tzs";--> statement-breakpoint
ALTER TABLE "receipt" ADD COLUMN "total_paid_in_usd" numeric(30, 15) NOT NULL;--> statement-breakpoint
ALTER TABLE "receipt" DROP COLUMN IF EXISTS "exchange_rate";