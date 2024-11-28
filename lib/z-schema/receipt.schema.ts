import { z } from "zod";
import { PaymentStatusEnum } from "../enum/payment-status-enum";
import { DateValue } from "@mantine/dates";

export const ReceiptSchema = z.object({
  customerName: z.string().min(1, "Please select customer"),
  codeNumber: z.string().min(1, "Code number is required"),
  postingDate: z.date({ message: "Posting date is required" }),
  totalBox: z.number().min(1, "Total box is required"),
  totalWeight: z.number().min(1, "Total weight is required"),
  costPerKg: z.number().min(1, "Cost per kg is required"),
  costPerKgCurrency: z.string().min(1, "Cost currency is required"),
  amountPaid: z.number().min(1, "Amount paid is required"),
  paymentCurrency: z.string().min(1, "Payment currency is required"),
  status: z.nativeEnum(PaymentStatusEnum).default(PaymentStatusEnum.UNPAID),
  shipped: z.boolean().default(false),
  received: z.boolean().default(false),
  totalPaidInTzs: z.number().nullable().default(null),
  totalPaidInUsd: z.number().nullable().default(null),
  totalShipmentUSD: z.number().nullable().default(null),
  totalShipmentTshs: z.number().nullable().default(null),
  creditAmount: z.number().nullable().default(null),
  balance: z.number().nullable().default(null),
  outstanding: z.number().nullable().default(null),
  totalCost: z.number().nullable(),
  costPerKgExchangeRate: z.number(),
  paymentCurrencyExchangeRate: z.number(),
  usdExchangeRate: z.number(),
});

export type ReceiptSchemaType = {
  customerName: string | null;
  codeNumber: string;
  postingDate: DateValue;
  totalBox: string | number;
  totalWeight: string | number;
  costPerKg: string | number;
  costPerKgCurrency: string | null;
  amountPaid: string | number;
  paymentCurrency: string | null;
  status: PaymentStatusEnum;
  shipped: false;
  received: false;
  totalShipmentUSD: number | null;
  totalShipmentTshs: number | null;
  totalPaidInTzs: number | null;
  totalPaidInUsd: number | null;
  creditAmount: number | null;
  balance: number | null;
  outstanding: number | null;
  totalCost: number | null;
  costPerKgExchangeRate: number;
  paymentCurrencyExchangeRate: number;
  usdExchangeRate: number;
};
