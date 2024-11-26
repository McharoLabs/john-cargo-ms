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
// import { ZodError } from "zod";

export const createReceipt = async (input: ReceiptSchemaType) => {
  try {
    // const zodError = new ZodError([]);

    const result = ReceiptSchema.safeParse(input);
    if (!result.success) {
      return { success: false, issues: result.error.issues };
    }

    return { seccess: true, detail: "" };
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
  amountPaid: string;
  paymentCurrency: string;
}) => {
  let costPerKgRateToTzs: string = "1";
  let amountPaidRateToTzs: string = "1";

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
  const totalAmountPaid = parseFloat(amountPaid);

  // Convert to TZS if needed
  const totalCostInTzs =
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
  const totalCostInUsd = totalCostInTzs / parseFloat(usdToTzsRate);
  const totalPaidInUsd = totalPaidInTzs / parseFloat(usdToTzsRate);

  // Calculate the balance
  const outstanding = totalCostInUsd - totalPaidInUsd;

  const status =
    outstanding === 0
      ? PaymentStatusEnum.PAID
      : outstanding < 0 && totalPaidInUsdgit === 0
      ? PaymentStatusEnum.UNPAID
      : PaymentStatusEnum.PARTIAALY_PAID;

  const prevReceipt = await getCustomerLastReceipt({ codeNumber: codeNumber });
  const creditAmount = prevReceipt.balance;

  const balance = outstanding + (!creditAmount ? Number(creditAmount) : 0);

  return {
    totalCostInTzs,
    totalPaidInTzs,
    totalCostInUsd,
    totalPaidInUsd,
    status,
    balance,
    creditAmount,
    outstanding,
  };
};
