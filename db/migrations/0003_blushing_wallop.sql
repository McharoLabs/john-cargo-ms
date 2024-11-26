ALTER TABLE "currency" ADD CONSTRAINT "currency_currency_code_unique" UNIQUE("currency_code");--> statement-breakpoint
ALTER TABLE "currency" ADD CONSTRAINT "currency_currency_name_unique" UNIQUE("currency_name");--> statement-breakpoint
ALTER TABLE "currency" ADD CONSTRAINT "currency_symbol_unique" UNIQUE("symbol");