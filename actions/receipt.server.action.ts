"use server";
import {
  ReceiptSchema,
  ReceiptSchemaType,
} from "@/lib/z-schema/receipt.schema";
import { getCurrency } from "./currency.server.action";
import { BaseCurrencyEnum } from "@/lib/enum/base-currency-enum.enum";
import { db } from "@/db";
import { receipts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { PaymentStatusEnum } from "@/lib/enum/payment-status-enum";
import { ZodError } from "zod";
import { formatMoney } from "@/lib/utils/functions";

export const createReceipt = async (input: ReceiptSchemaType) => {
  try {
    const result = ReceiptSchema.safeParse(input);
    if (!result.success) {
      return { success: false, issues: result.error.issues };
    }

    type PaymentStatus = "Paid" | "Partially Paid" | "Unpaid";

    const savedReceipt = await db
      .insert(receipts)
      .values({
        codeNumber: input.codeNumber,
        costPerKg: String(input.costPerKg),
        costPerKgCurrency: String(input.costPerKgCurrency),
        paymentCurrency: input.paymentCurrency,
        postingDate: new Date(String(input.postingDate)),
        totalPaidInTzs: String(input.totalPaidInTzs),
        totalPaidInUsd: String(input.totalPaidInUsd),
        totalShipmentTshs: String(input.totalShipmentTshs),
        totalBox: Number(input.totalBox),
        totalShipmentUSD: String(input.totalShipmentUSD),
        totalWeight: String(input.totalWeight),
        balance: input.balance ? String(input.balance) : null,
        creditAmount: input.creditAmount ? String(input.creditAmount) : null,
        outstanding: input.outstanding ? String(input.outstanding) : null,
        received: input.received,
        shipped: input.shipped,
        status: input.status as PaymentStatus,
      })
      .returning();

    console.info(`Saved Receipt: ${savedReceipt}`);

    return { success: true, detail: "Receipt created successfully." };
  } catch (error) {
    console.error(`Error while creating new receipt: ${error}`);
    throw error;
  }
};

const getCustomerLastReceipt = async ({
  codeNumber,
}: {
  codeNumber: string;
}) => {
  try {
    const result = await db
      .select()
      .from(receipts)
      .where(eq(receipts.codeNumber, codeNumber))
      .orderBy(desc(receipts.createdAt))
      .limit(1);
    console.info(`Customer Last Receipt: ${JSON.stringify(result[0])}`);
    return result[0];
  } catch (error) {
    console.error(`Error while getting customer last balance: ${error}`);
    throw error;
  }
};

export const receiptBasicCalculations = async ({
  codeNumber,
  totalWeight,
  costPerKg,
  costPerKgCurrency,
  amountPaid,
  paymentCurrency,
}: {
  codeNumber: string;
  totalBox: number;
  totalWeight: number;
  costPerKg: number;
  costPerKgCurrency: string;
  amountPaid: number;
  paymentCurrency: string;
}) => {
  let costPerKgRateToTzs: string = "1";
  let amountPaidRateToTzs: string = "1";
  console.log("Clicked");
  // Convert cost per kg to TZS if it's not already in TZS
  if (costPerKgCurrency !== BaseCurrencyEnum.TZS) {
    const costData = await getCurrency({ currency_code: costPerKgCurrency });
    costPerKgRateToTzs = costData.rate_to_tzs;
  }

  // Convert amount paid to TZS if it's not already in TZS
  if (paymentCurrency !== BaseCurrencyEnum.TZS) {
    const paymentData = await getCurrency({ currency_code: paymentCurrency });
    amountPaidRateToTzs = paymentData.rate_to_tzs;
  }

  // Calculate the total shipment in the original currency
  const totalCost = totalWeight * costPerKg;
  const totalAmountPaid = amountPaid;

  // Convert to TZS if needed
  const totalShipmentTshs =
    costPerKgCurrency !== BaseCurrencyEnum.TZS
      ? totalCost * parseFloat(costPerKgRateToTzs)
      : totalCost;

  const totalPaidInTzs =
    paymentCurrency !== BaseCurrencyEnum.TZS
      ? totalAmountPaid * parseFloat(amountPaidRateToTzs)
      : totalAmountPaid;

  // Convert from TZS to USD
  const usdToTzsRate = (
    await getCurrency({ currency_code: BaseCurrencyEnum.USD })
  ).rate_to_tzs;
  const totalShipmentUSD = totalShipmentTshs / parseFloat(usdToTzsRate);
  const totalPaidInUsd = totalPaidInTzs / parseFloat(usdToTzsRate);

  // Calculate the balance
  const outstanding = totalShipmentTshs - totalPaidInTzs;

  if (outstanding < 0) {
    const zodError = new ZodError([]);
    zodError.addIssue({
      code: "custom",
      message: `The amount exceeds ${formatMoney(
        (totalShipmentTshs - totalPaidInTzs) * -1
      )}Tzs of total cost`,
      path: ["amountPaid"],
    });
    return { data: null, issues: zodError.errors };
  }

  const status =
    outstanding === 0
      ? PaymentStatusEnum.PAID
      : totalPaidInUsd === 0
      ? PaymentStatusEnum.UNPAID
      : PaymentStatusEnum.PARTIAALY_PAID;

  try {
    const prevReceipt = await getCustomerLastReceipt({
      codeNumber: codeNumber,
    });

    let creditAmount: string | null = null;
    if (prevReceipt) {
      creditAmount = prevReceipt.balance;
    }

    const balance = outstanding + (creditAmount ? Number(creditAmount) : 0);

    return {
      data: {
        totalShipmentTshs,
        totalPaidInTzs,
        totalShipmentUSD,
        totalPaidInUsd,
        status,
        balance,
        creditAmount,
        outstanding,
        costPerKgExchangeRate: costPerKgRateToTzs,
        paymentCurrencyExchangeRate: amountPaidRateToTzs,
        usdExchangeRate: usdToTzsRate,
      },
    };
  } catch (error) {
    throw error;
  }
};
