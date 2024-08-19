"use server";

import { db } from "@/db";
import { cargoTable, userTable } from "@/db/schema";
import { CargoFormSchema, CargoFormSchemaType } from "@/lib/types";
import { desc, eq } from "drizzle-orm";

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

export const fetchCargos = async () => {
  try {
    const result = await db
      .select({
        cargo: cargoTable,
        users: {
          codeNumber: userTable.codeNumber,
          firstName: userTable.firstName,
          lastName: userTable.lastName,
          email: userTable.email,
          contact: userTable.contact,
        },
      })
      .from(cargoTable)
      .innerJoin(userTable, eq(cargoTable.codeNumber, userTable.codeNumber));

    return result;
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
