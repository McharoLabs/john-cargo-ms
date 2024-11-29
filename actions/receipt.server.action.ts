"use server";
import {
  ReceiptSchema,
  ReceiptSchemaType,
} from "@/lib/z-schema/receipt.schema";
import { getCurrency } from "./currency.server.action";
import { BaseCurrencyEnum } from "@/lib/enum/base-currency-enum.enum";
import { db } from "@/db";
import { receipts, ReceiptWithRelations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { PaymentStatusEnum } from "@/lib/enum/payment-status-enum";
import { ZodError } from "zod";
import { formatMoney } from "@/lib/utils/functions";
import { auth } from "@/auth";
import { signOut } from "@/auth/helper";

export const createReceipt = async (input: ReceiptSchemaType) => {
  try {
    const result = ReceiptSchema.safeParse(input);
    if (!result.success) {
      return { success: false, issues: result.error.issues };
    }

    type PaymentStatus = "Paid" | "Partially Paid" | "Unpaid";

    const staff = await auth();
    if (!staff || !staff.user) {
      await signOut();
      window.location.reload();
      return { success: false, detail: "User is not authenticated" };
    }

    const savedReceipt = await db
      .insert(receipts)
      .values({
        codeNumber: input.codeNumber,
        costPerKg: String(input.costPerKg),
        costPerKgCurrency: input.costPerKgCurrency
          ? String(input.costPerKgCurrency)
          : "",
        paymentCurrency: input.paymentCurrency
          ? String(input.paymentCurrency)
          : "",
        postingDate: new Date(String(input.postingDate)),
        totalBox: Number(input.totalBox),
        totalPaidInTzs: String(input.totalPaidInTzs),
        totalPaidInUsd: String(input.totalPaidInUsd),
        totalShipmentTshs: String(input.totalShipmentTshs),
        totalShipmentUSD: String(input.totalShipmentUSD),
        totalWeight: String(input.totalWeight),
        balance: input.balance ? String(input.balance) : null,
        creditAmount: input.creditAmount ? String(input.creditAmount) : null,
        outstanding: input.outstanding ? String(input.outstanding) : null,
        received: input.received,
        shipped: input.shipped,
        costPerKgExchangeRate: String(input.costPerKgExchangeRate),
        paymentCurrencyExchangeRate: String(input.paymentCurrencyExchangeRate),
        usdExchangeRate: String(input.usdExchangeRate),
        status: input.status as PaymentStatus,
        customerCareId: staff.user.id,
      })
      .returning();

    console.info(`Saved Receipt: ${savedReceipt}`);

    const data: ReceiptWithRelations | undefined = await getReceipt({
      receiptId: savedReceipt[0].receiptId,
    });

    if (data) {
      return {
        success: true,
        detail: "Receipt created successfully.",
        data: data,
      };
    }

    return {
      success: true,
      detail: "Receipt created successfully.",
      data: null,
    };
  } catch (error) {
    console.error(`Error while creating new receipt: ${error}`);
    throw error;
  }
};

export const getAllReceipts = async (
  limit?: number
): Promise<ReceiptWithRelations[]> => {
  try {
    const allReceipts = await db.query.receipts.findMany({
      orderBy: desc(receipts.createdAt),
      with: {
        customer: true,
        staff: true,
      },
      ...(limit !== undefined && { limit }),
    });

    return allReceipts;
  } catch (error) {
    console.error(`Error while getting all receipts: ${error}`);
    throw error;
  }
};

export const getReceipt = async ({
  receiptId,
}: {
  receiptId: string;
}): Promise<ReceiptWithRelations | undefined> => {
  try {
    const receipt = await db.query.receipts.findFirst({
      with: {
        customer: true,
        staff: true,
      },
      where: eq(receipts.receiptId, receiptId),
    });

    return receipt;
  } catch (error) {
    console.error(`Error while getting all receipts: ${error}`);
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
  amountPaid: number;
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
        totalCost,
        totalShipmentTshs,
        totalPaidInTzs,
        totalShipmentUSD,
        totalPaidInUsd,
        status,
        balance,
        creditAmount: creditAmount ? Number(creditAmount) : null,
        outstanding,
        costPerKgExchangeRate: Number(costPerKgRateToTzs),
        paymentCurrencyExchangeRate: Number(amountPaidRateToTzs),
        usdExchangeRate: Number(usdToTzsRate),
      },
    };
  } catch (error) {
    throw error;
  }
};
