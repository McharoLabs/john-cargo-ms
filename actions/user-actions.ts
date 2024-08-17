"use server";
import { staffTable, userTable } from "@/db/schema";
import { db } from "@/db";
import { desc, eq, sql } from "drizzle-orm";
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

export async function users() {
  try {
    const us = await db
      .select({
        userId: userTable.userId,
        codeNumber: userTable.codeNumber,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        email: userTable.email,
        contact: userTable.contact,
        createdAt: userTable.createdAt,
        isStaff: staffTable.staffId,
      })
      .from(userTable)
      .leftJoin(staffTable, eq(userTable.userId, staffTable.staffId))
      .orderBy(desc(userTable.codeNumber));

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
