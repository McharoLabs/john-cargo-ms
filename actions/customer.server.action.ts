"use server";

import { auth } from "@/auth";
import { signOut } from "@/auth/helper";
import { db } from "@/db";
import { Customer, customers } from "@/db/schema";
import {
  CustomerSchema,
  CustomerSchemaType,
} from "@/lib/z-schema/customer.schema";
import { desc, eq, sql } from "drizzle-orm";
import { ZodError } from "zod";

export const create = async (input: CustomerSchemaType) => {
  try {
    const zodError = new ZodError([]);

    const result = CustomerSchema.safeParse(input);

    if (!result.success) {
      return { success: false, issues: result.error.issues, data: null };
    }

    const existingCustomer = await db.query.customers.findFirst({
      where: eq(customers.contact, input.contact),
    });

    if (existingCustomer) {
      zodError.addIssue({
        code: "custom",
        message: `Customer with contact ${input.contact} exists`,
        path: ["contact"],
      });
      return { success: false, issues: zodError.errors, data: null };
    }

    const staff = await auth();
    if (!staff || !staff.user) {
      await signOut();
      window.location.reload();
      return { success: false, detail: "User is not authenticated" };
    }

    const codeNumber = await generateCustomerCode();

    input.addedBy = staff.user.id;
    input.codeNumber = codeNumber;

    const data: Customer[] = await db
      .insert(customers)
      .values({
        firstName: input.firstName,
        lastName: input.lastName,
        contact: input.contact,
        email: input.email,
        region: input.region,
        district: input.district,
        addedBy: staff.user.id,
        codeNumber: codeNumber,
      })
      .returning();

    return {
      success: true,
      detail: "Customer added successfully",
      data: data[0],
    };
  } catch (error) {
    throw error;
  }
};

export const getAllCustomers = async (
  search: string = ""
): Promise<Customer[]> => {
  try {
    const result = await db
      .select()
      .from(customers)
      .where(
        search.trim() === ""
          ? undefined
          : sql`${customers.firstName} || ' ' || ${
              customers.lastName
            } LIKE ${`%${search.toLowerCase()}%`}`
      )
      .orderBy(desc(customers.createdAt));

    return result;
  } catch (error) {
    console.error(`Error while fetching all customers: ${error}`);
    throw error;
  }
};

async function getLastCustomerCode(): Promise<string | null> {
  try {
    const lastUser = await db
      .select({
        codeNumber: customers.codeNumber,
      })
      .from(customers)
      .orderBy(desc(customers.codeNumber))
      .limit(1);

    return lastUser.length > 0 ? lastUser[0].codeNumber : null;
  } catch (error) {
    console.error(`Error while finding latest customer code number: ${error}`);
    throw error;
  }
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
