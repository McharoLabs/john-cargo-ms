import { z } from "zod";

export const CurrencySchema = z.object({
  currency_id: z.string().uuid().optional(),
  currency_code: z.string().length(3),
  currency_name: z.string().max(50),
  symbol: z.string().max(5),
  rate_to_tzs: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid decimal format")),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CurrencySchemaType = z.infer<typeof CurrencySchema>;
