"use server";
import { cargoTable, staffTable, userTable } from "@/db/schema";
import { db } from "@/db";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { RegistrationSchema, RegistrationSchemaType } from "@/lib/types";
import { genSaltSync, hashSync } from "bcrypt-ts";

async function getLastCustomerCode(): Promise<string | null> {
  const lastUser = await db
    .select({
      codeNumber: userTable.codeNumber,
    })
    .from(userTable)
    .orderBy(desc(userTable.codeNumber))
    .limit(1);

  return lastUser.length > 0 ? lastUser[0].codeNumber : null;
}

async function generateCustomerCode(): Promise<string> {
  const lastCustomerCode = await getLastCustomerCode();
  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear % 100;
  const companyAbbr = "JC";

  let newSequenceNumber: number;
  if (lastCustomerCode) {
    const lastSequenceNumber = parseInt(lastCustomerCode.split("-")[1], 10);
    newSequenceNumber = lastSequenceNumber + 1;
  } else {
    newSequenceNumber = 1;
  }

  const newSequenceString = newSequenceNumber.toString().padStart(6, "0");
  return `${companyAbbr}${yearSuffix}-${newSequenceString}`;
}

export async function createUser(data: RegistrationSchemaType) {
  try {
    const result = RegistrationSchema.safeParse(data);
    if (!result.success) {
      return { success: false, issues: result.error.issues, detail: null };
    }

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, data.email),
    });

    if (existingUser) {
      return {
        success: false,
        detail: `User with email ${data.email} already exists`,
      };
    }

    const codeNumber = await generateCustomerCode();
    if (!codeNumber) {
      return {
        success: false,
        detail: `Failed to generate code number`,
      };
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(data.lastName.toUpperCase() || "", salt);

    const userData = {
      ...data,
      codeNumber,
      password: hashedPassword,
    };

    const savedUser = await db
      .insert(userTable)
      .values(userData)
      .returning({ userId: userTable.userId });
    const user = savedUser[0];

    if (data.isStaff) {
      await db
        .insert(staffTable)
        .values({ staffId: user.userId, isSuperUser: false });
    }

    const message = data.isStaff
      ? "Staff added successfully"
      : "Customer addedd successfully";

    return { detail: message, success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchStaffs(search: string = "") {
  try {
    const searchTerm = `%${search.toLowerCase()}%`;

    const staffUsers = await db
      .select({
        codeNumber: userTable.codeNumber,
        name: sql`${userTable.firstName} || ' ' || ${userTable.lastName} AS name`,
        email: userTable.email,
        contact: userTable.contact,
        createdAt: userTable.createdAt,
      })
      .from(userTable)
      .innerJoin(staffTable, eq(userTable.userId, staffTable.staffId))
      .where(
        sql`${userTable.firstName} || ' ' || ${userTable.lastName} ILIKE ${searchTerm}`
      )
      .orderBy(desc(userTable.codeNumber));

    return staffUsers;
  } catch (error) {
    throw error;
  }
}

export async function fetchCustomers(
  search: string = "",
  page: number = 1,
  itemsPerPage: number = 10
) {
  try {
    const searchTerm = `%${search.toLowerCase()}%`;
    const offset = (page - 1) * itemsPerPage;

    const us = await db
      .select({
        codeNumber: userTable.codeNumber,
        name: sql`${userTable.firstName} || ' ' || ${userTable.lastName} AS name`,
        email: userTable.email,
        contact: userTable.contact,
        createdAt: userTable.createdAt,
      })
      .from(userTable)
      .leftJoin(staffTable, eq(userTable.userId, staffTable.staffId))
      .where(
        and(
          sql`${userTable.firstName} || ' ' || ${userTable.lastName} ILIKE ${searchTerm}`,
          isNull(staffTable.staffId)
        )
      )
      .orderBy(desc(userTable.createdAt))
      .limit(itemsPerPage)
      .offset(offset);

    return us;
  } catch (error) {
    throw error;
  }
}

export const searchCustomer = async (search: string = "") => {
  try {
    const searchTerm = `%${search.toLowerCase()}%`;

    const matchingCustomers = await db
      .select({
        codeNumber: userTable.codeNumber,
        name: sql`${userTable.firstName} || ' ' || ${userTable.lastName} AS name`,
      })
      .from(userTable)
      .where(
        sql`${userTable.firstName} || ' ' || ${userTable.lastName} ILIKE ${searchTerm}`
      )
      .orderBy(desc(userTable.codeNumber));

    return matchingCustomers;
  } catch (error) {
    throw error;
  }
};

export async function countStaffs() {
  try {
    const count = await db
      .select({
        staffCount: sql<number>`COUNT(${staffTable.staffId}) AS staffCount`,
      })
      .from(staffTable)
      .innerJoin(userTable, eq(userTable.userId, staffTable.staffId));

    return count[0]?.staffCount ?? 0;
  } catch (error) {
    throw error;
  }
}

export async function countCustomers() {
  try {
    const count = await db
      .select({
        customerCount: sql<number>`COUNT(${userTable.userId}) AS customerCount`,
      })
      .from(userTable)
      .leftJoin(staffTable, eq(userTable.userId, staffTable.staffId))
      .where(isNull(staffTable.staffId));

    return count[0]?.customerCount ?? 0;
  } catch (error) {
    throw error;
  }
}

export async function countPaymentStatuses() {
  try {
    const [notPaid, partiallyPaid, paidInFull] = await Promise.all([
      db
        .select({
          count: sql<number>`COUNT(${cargoTable.cargoId})`,
        })
        .from(cargoTable)
        .where(eq(cargoTable.status, "Not Paid")),

      db
        .select({
          count: sql<number>`COUNT(${cargoTable.cargoId})`,
        })
        .from(cargoTable)
        .where(eq(cargoTable.status, "Partially Paid")),

      db
        .select({
          count: sql<number>`COUNT(${cargoTable.cargoId})`,
        })
        .from(cargoTable)
        .where(eq(cargoTable.status, "Paid in Full")),
    ]);

    return {
      notPaid: notPaid[0]?.count ?? 0,
      partiallyPaid: partiallyPaid[0]?.count ?? 0,
      paidInFull: paidInFull[0]?.count ?? 0,
    };
  } catch (error) {
    throw error;
  }
}
