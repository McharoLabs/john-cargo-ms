"use server";

import { db } from "@/db";
import { cargoTable, userTable } from "@/db/schema";
import { CURRENCY, STATUS } from "@/lib/enum";
import {
  CargoFormSchema,
  CargoFormSchemaType,
  CargoReceiptValidationResult,
} from "@/lib/types";
import { and, count, desc, eq, or, sql } from "drizzle-orm";

export const addCargo = async (data: CargoFormSchemaType) => {
  try {
    const result = CargoFormSchema.safeParse(data);

    if (!result.success) {
      return { success: false, issues: result.error.issues, detail: null };
    }

    const latestOrder = await db
      .select({
        creditAmount: cargoTable.creditAmount,
        outstanding: cargoTable.outstanding,
        balance: cargoTable.balance,
        paymentCurrency: cargoTable.paymentCurrency,
      })
      .from(cargoTable)
      .where(eq(cargoTable.codeNumber, data.codeNumber))
      .orderBy(desc(cargoTable.createdAt))
      .limit(1);

    let previousOutstanding = null;
    let PrevBalance = null;
    if (latestOrder.length > 0) {
      previousOutstanding = latestOrder[0].outstanding;
      PrevBalance = latestOrder[0].balance;
    }

    const {
      detail,
      newBalance,
      newCreditAmount,
      newOutStanding,
      totalShipmentInTshs,
      totalShipmentInUsd,
      costPerKgInTshs,
    } = cargoCal(
      previousOutstanding,
      PrevBalance,
      data.totalWeight,
      data.exchangeRate,
      data.amountPaid,
      data.costPerKgCurrency as CURRENCY,
      data.costPerKg,
      data.paymentCurrency as CURRENCY
    );

    if (detail) {
      return { success: false, detail: detail };
    }

    const cargoData = {
      codeNumber: data.codeNumber,
      postingDate: data.postingDate ? new Date(data.postingDate) : new Date(),
      totalBox: Number(data.totalBox),
      totalWeight: String(data.totalWeight),
      costPerKg:
        costPerKgInTshs !== undefined
          ? String(costPerKgInTshs.toFixed(2))
          : "0.0",
      totalShipmentUSD:
        totalShipmentInUsd !== undefined
          ? String(totalShipmentInUsd.toFixed(2))
          : "0.0",
      exchangeRate: String(data.exchangeRate),
      totalShipmentTshs:
        totalShipmentInTshs !== undefined
          ? String(totalShipmentInTshs.toFixed(2))
          : "0.0",
      amountPaid: String(data.amountPaid),
      paymentCurrency: data.paymentCurrency as CURRENCY,
      creditAmount:
        newCreditAmount !== undefined && newCreditAmount !== null
          ? String(newCreditAmount.toFixed(2))
          : "0.0",
      outstanding:
        newOutStanding !== undefined && newOutStanding !== null
          ? String(newOutStanding.toFixed(2))
          : "0.0",
      balance:
        newBalance !== undefined && newBalance !== null
          ? String(newBalance.toFixed(2))
          : "0.0",
      status: data.status as STATUS,
      shipped: data.shipped !== undefined ? data.shipped : false,
      received: data.received !== undefined ? data.received : false,
    };
    await db.insert(cargoTable).values(cargoData);
    return { success: true, detail: "Cargo successfully added" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchCargoReceipts = async (
  search: string = "",
  page: number = 1,
  itemsPerPage: number = 10
) => {
  try {
    const searchTerm = `%${search.toLowerCase()}%`;
    const offset = (page - 1) * itemsPerPage;

    const result = await db
      .select({
        cargo: cargoTable,
        users: {
          codeNumber: userTable.codeNumber,
          name: sql`${userTable.firstName} || ' ' || ${userTable.lastName} AS name`,
          email: userTable.email,
          contact: userTable.contact,
          createdAt: userTable.createdAt,
        },
      })
      .from(cargoTable)
      .innerJoin(userTable, eq(cargoTable.codeNumber, userTable.codeNumber))
      .where(
        or(
          sql`${cargoTable.codeNumber} ILIKE ${searchTerm}`,
          sql`${userTable.firstName} || ' ' || ${userTable.lastName} ILIKE ${searchTerm}`,
          sql`${userTable.email} ILIKE ${searchTerm}`,
          sql`${userTable.contact} ILIKE ${searchTerm}`
        )
      )
      .orderBy(desc(cargoTable.createdAt))
      .limit(itemsPerPage)
      .offset(offset);

    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchCargoReceipt = async (cargoId: string) => {
  try {
    const result = await db
      .select({
        cargo: cargoTable,
        users: {
          codeNumber: userTable.codeNumber,
          name: sql`${userTable.firstName} || ' ' || ${userTable.lastName} AS name`,
          email: userTable.email,
          contact: userTable.contact,
          createdAt: userTable.createdAt,
        },
      })
      .from(cargoTable)
      .innerJoin(userTable, eq(cargoTable.codeNumber, userTable.codeNumber))
      .where(eq(cargoTable.cargoId, cargoId));

    return result[0];
  } catch (error) {
    throw error;
  }
};

export const shipped = async (cargoId: string) => {
  try {
    const existingReceipt = await db
      .select({ cargoId: cargoTable.cargoId })
      .from(cargoTable)
      .where(eq(cargoTable.cargoId, cargoId));

    console.info(existingReceipt);
    if (existingReceipt.length === 0) {
      return { success: false, detail: "Cargo not found" };
    }

    await db
      .update(cargoTable)
      .set({ shipped: true, updatedAt: new Date() })
      .where(eq(cargoTable.cargoId, cargoId));

    return { success: true, detail: "Shipped successfully" };
  } catch (error) {
    throw error;
  }
};

export const received = async (cargoId: string) => {
  try {
    const existingReceipt = await db
      .select({ cargoId: cargoTable.cargoId, shipped: cargoTable.shipped })
      .from(cargoTable)
      .where(eq(cargoTable.cargoId, cargoId));

    if (existingReceipt.length === 0) {
      return { success: false, detail: "Cargo not found" };
    }

    if (!existingReceipt[0].shipped) {
      return { success: false, detail: "Not shipped" };
    }

    await db
      .update(cargoTable)
      .set({ received: true, updatedAt: new Date() })
      .where(eq(cargoTable.cargoId, cargoId));

    return { success: true, detail: "Shipped successfully" };
  } catch (error) {
    throw error;
  }
};

export const countReceipts = async () => {
  try {
    const totalReceipts = await db.select({ count: count() }).from(cargoTable);
    return totalReceipts[0];
  } catch (error) {
    console.log(`Error while counting receipts: ${error}`);
    throw error;
  }
};

const cargoCal = (
  prevOutstanding: string | null,
  prevBalance: string | null,

  totalWeight: string,
  exchangeRate: string,
  amountPaid: string,
  costPerKgCurrency: CURRENCY,
  costPerKg: string,
  currentPaymentCurrency: CURRENCY
) => {
  const totalWeightNumber = Number(totalWeight);
  const amountPaidNumber = Number(amountPaid);
  const exchangeRateNumber = Number(exchangeRate);
  const costPerKgNumber = Number(costPerKg);
  const newCreditAmount = prevBalance !== null ? Number(prevBalance) : null;

  if (
    isNaN(totalWeightNumber) ||
    isNaN(amountPaidNumber) ||
    isNaN(exchangeRateNumber) ||
    isNaN(costPerKgNumber)
  ) {
    return { detail: "Invalid number input" };
  }

  const { amountPaidInTshs, amountPaidInUsd } = changeAmountPaid(
    amountPaidNumber,
    exchangeRateNumber,
    currentPaymentCurrency
  );

  const { costPerKgInTshs, costPerKgInUsd } = changeCostPerKg(
    costPerKgNumber,
    costPerKgCurrency,
    exchangeRateNumber
  );

  const { totalShipmentInTshs, totalShipmentInUsd } = changeTotalShipment(
    totalWeightNumber,
    costPerKgInTshs,
    costPerKgInUsd
  );

  const newOutStanding = totalShipmentInUsd - amountPaidInUsd;
  const newBalance =
    newOutStanding + (prevBalance !== null ? Number(prevBalance) : 0);

  return {
    newOutStanding,
    totalShipmentInTshs,
    totalShipmentInUsd,
    newCreditAmount,
    newBalance,
    costPerKgInTshs,
  };
};

export const validation = (
  totalWeight: string,
  exchangeRate: string,
  amountPaid: string,
  costPerKgCurrency: CURRENCY,
  costPerKg: string,
  currentPaymentCurrency: CURRENCY
): CargoReceiptValidationResult => {
  const totalWeightNumber = Number(totalWeight);
  const amountPaidNumber = Number(amountPaid);
  const exchangeRateNumber = Number(exchangeRate);
  const costPerKgNumber = Number(costPerKg);

  if (
    isNaN(totalWeightNumber) ||
    isNaN(amountPaidNumber) ||
    isNaN(exchangeRateNumber) ||
    isNaN(costPerKgNumber)
  ) {
    return { detail: "Invalid number input" };
  }

  if (exchangeRateNumber < 1) {
    return { detail: "Exchange rate must be greater than 1" };
  }
  if (currentPaymentCurrency === costPerKgCurrency && exchangeRateNumber > 1) {
    return { detail: "Exchange rate must be exactly 1 when currencies match " };
  }

  const { amountPaidInTshs, amountPaidInUsd } = changeAmountPaid(
    amountPaidNumber,
    exchangeRateNumber,
    currentPaymentCurrency
  );

  const { costPerKgInTshs, costPerKgInUsd } = changeCostPerKg(
    costPerKgNumber,
    costPerKgCurrency,
    exchangeRateNumber
  );
  const { totalShipmentInTshs, totalShipmentInUsd } = changeTotalShipment(
    totalWeightNumber,
    costPerKgInTshs,
    costPerKgInUsd
  );
  // console.log("amount paid", amountPaid);
  // console.log("total weight", totalWeight);
  // console.log("cost per kg in tshs", costPerKgInTshs);
  // console.log("cost per kg in usd", costPerKgInUsd);
  // console.log("total in tshs", totalShipmentInTshs);
  // console.log("total in usd", totalShipmentInUsd);
  // console.log("exchange rate", exchangeRate);
  // console.log("cost currency", costPerKgCurrency);
  // console.log("current amount currency", currentPaymentCurrency);
  // console.log("amount paid in tshs", amountPaidInTshs);
  // console.log("amount paid in usd", amountPaidInUsd);
  if (
    (currentPaymentCurrency === CURRENCY.USD &&
      totalShipmentInUsd >= amountPaidInUsd) ||
    (currentPaymentCurrency === CURRENCY.TSHS &&
      totalShipmentInTshs >= amountPaidInTshs)
  ) {
    return {
      costPerKgInUsd,
      totalShipmentInTshs,
      totalShipmentInUsd,
      amountPaidInTshs,
      amountPaidInUsd,
      costPerKgInTshs,
    };
  }

  return { detail: "Amount paid cannot exceed the total shipment" };
};

const changeCostPerKg = (
  costPerKgNumber: number,
  costPerKgCurrency: CURRENCY,
  exchangeRateNumber: number
) => {
  let costPerKgInUsd = 0;
  let costPerKgInTshs = 0;

  if (costPerKgCurrency === CURRENCY.USD) {
    costPerKgInTshs = exchangeRateNumber * costPerKgNumber;
    costPerKgInUsd = costPerKgNumber;
  } else {
    costPerKgInUsd = costPerKgNumber / exchangeRateNumber;
    costPerKgInTshs = costPerKgNumber;
  }

  return { costPerKgInUsd, costPerKgInTshs };
};

const changeTotalShipment = (
  totalWeightNumber: number,
  costPerKgInTshs: number,
  costPerKgInUsd: number
) => {
  const totalShipmentInTshs = costPerKgInTshs * totalWeightNumber;
  const totalShipmentInUsd = costPerKgInUsd * totalWeightNumber;

  return { totalShipmentInTshs, totalShipmentInUsd };
};

const changeAmountPaid = (
  amountPaid: number,
  exchangeRate: number,
  currency: CURRENCY
) => {
  if (currency === CURRENCY.USD) {
    const amountPaidInTshs = amountPaid * exchangeRate;
    return { amountPaidInTshs, amountPaidInUsd: amountPaid };
  }
  const amountPaidInUsd = amountPaid / exchangeRate;
  return { amountPaidInTshs: amountPaid, amountPaidInUsd };
};
