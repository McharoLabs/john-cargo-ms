DO $$ BEGIN
 CREATE TYPE "public"."currency" AS ENUM('TSHS', 'USD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "cargo" ADD COLUMN "payment_currency" "currency" NOT NULL;