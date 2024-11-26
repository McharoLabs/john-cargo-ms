import { z } from "zod";
import { PaymentStatusArray } from "../array/payment-status-array";

export const ReceiptSchema = z.object({
  receiptId: z.string().uuid().optional(),
  codeNumber: z.string().max(50),
  postingDate: z.string().datetime(),
  totalBox: z.number().int().min(0).nullable(),
  totalWeight: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/))
    .nullable(),
  costPerKg: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/))
    .nullable(),
  costPerKgCurrency: z.string().max(50),
  totalShipmentUSD: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/))
    .nullable(),
  exchangeRate: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/))
    .nullable(),
  totalShipmentTshs: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/))
    .nullable(),
  amountPaid: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/))
    .nullable(),
  paymentCurrency: z.string().max(50),
  creditAmount: z
    .number()
    .nonnegative()
    .optional()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/))
    .nullable(),
  outstanding: z
    .number()
    .nonnegative()
    .optional()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/))
    .nullable(),
  balance: z
    .number()
    .nonnegative()
    .optional()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/))
    .nullable(),
  status: z.enum(PaymentStatusArray),
  shipped: z.boolean(),
  received: z.boolean(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type ReceiptSchemaType = z.infer<typeof ReceiptSchema>;
