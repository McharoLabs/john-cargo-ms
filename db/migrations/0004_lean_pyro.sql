ALTER TABLE "receipt" ALTER COLUMN "total_weight" SET DATA TYPE numeric(30, 15);--> statement-breakpoint
ALTER TABLE "receipt" ALTER COLUMN "cost_per_kg" SET DATA TYPE numeric(30, 15);--> statement-breakpoint
ALTER TABLE "receipt" ALTER COLUMN "amount_paid" SET DATA TYPE numeric(30, 15);--> statement-breakpoint
ALTER TABLE "receipt" ALTER COLUMN "credit_amount" SET DATA TYPE numeric(30, 15);--> statement-breakpoint
ALTER TABLE "receipt" ALTER COLUMN "outstanding" SET DATA TYPE numeric(30, 15);--> statement-breakpoint
ALTER TABLE "receipt" ALTER COLUMN "balance" SET DATA TYPE numeric(30, 15);