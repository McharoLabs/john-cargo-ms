"use server";

import { db } from "@/db";
import { cargoTable, userTable } from "@/db/schema";
import { CargoFormSchema, CargoFormSchemaType } from "@/lib/types";
import { desc, eq, or, sql } from "drizzle-orm";

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
      newOutstanding,
      totalShipmentTshs,
      totalShipmentUSD,
      newCreditAmount,
    } = cargoCal(
      data.totalBox,
      data.totalWeight,
      data.costPerKg,
      data.exchangeRate,
      data.amountPaid,
      previousOutstanding,
      PrevBalance
    );

    const cargoData = {
      amountPaid: data.amountPaid,
      balance:
        newOutstanding !== null ? String(newOutstanding.toFixed(2)) : null,
      totalWeight: data.totalWeight,
      status: data.status,
      codeNumber: data.codeNumber,
      costPerKg: data.costPerKg,
      exchangeRate: data.exchangeRate,
      outstanding:
        newOutstanding !== null ? String(newOutstanding.toFixed(2)) : null,
      postingDate: new Date(data.postingDate),
      totalBox: data.totalBox,
      totalShipmentTshs: String(totalShipmentTshs.toFixed(2)),
      totalShipmentUSD: String(totalShipmentUSD.toFixed(2)),
      creditAmount:
        newCreditAmount !== null ? String(newCreditAmount.toFixed(2)) : null,
      shipped: data.shipped,
      received: data.received,
    };
    await db.insert(cargoTable).values(cargoData);
    return { success: true, detail: "Cargo successfully added" };
  } catch (error) {
    throw error;
  }
};

export const fetchCargos = async (search: string = "") => {
  try {
    const searchTerm = `%${search.toLowerCase()}%`;

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
      .orderBy(desc(cargoTable.postingDate));

    return result;
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

const cargoCal = (
  totalBox: string,
  totalWeight: string,
  costPerKg: string,
  exchangeRate: string,
  amountPaid: string,
  previousOutstanding: string | null,
  prevBalance: string | null
) => {
  const totalShipmentUSD =
    Number(totalWeight) * Number(totalBox) * Number(costPerKg);
  const totalShipmentTshs =
    totalShipmentUSD * (Number(exchangeRate) === 0 ? 1 : Number(exchangeRate));

  const newCreditAmount =
    previousOutstanding !== null
      ? Number(previousOutstanding)
      : previousOutstanding;
  const newOutstanding =
    (prevBalance !== null ? Number(prevBalance) : 0) +
    (totalShipmentUSD - Number(amountPaid));

  return {
    totalShipmentUSD,
    totalShipmentTshs,
    newOutstanding,
    newCreditAmount,
  };
};
