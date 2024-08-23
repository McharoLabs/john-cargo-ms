ALTER TYPE "cargo_status" ADD VALUE 'Not Paid';--> statement-breakpoint
ALTER TABLE "cargo" ALTER COLUMN "total_box" SET DATA TYPE integer;