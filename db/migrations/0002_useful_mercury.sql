ALTER TABLE "currency" RENAME COLUMN "exchange_rate" TO "rate_to_tzs";--> statement-breakpoint
ALTER TABLE "currency" DROP CONSTRAINT "currency_base_currency_id_currency_currency_id_fk";
--> statement-breakpoint
ALTER TABLE "currency" DROP COLUMN IF EXISTS "base_currency_id";