"use server";
import { db } from "@/db";
import { Staff, staffs } from "@/db/schema";
import { StaffsSchema, StaffsSchemaType } from "@/lib/z-schema/staff.schema";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { eq, ne, or, sql } from "drizzle-orm";
import { ZodError } from "zod";

export async function create(input: StaffsSchemaType) {
  try {
    const zodError = new ZodError([]);

    const result = StaffsSchema.safeParse(input);
    if (!result.success) {
      return { success: false, issues: result.error.issues, detail: null };
    }

    const normalizeContact = (contact: string) => {
      return contact.replace(/\D/g, "").slice(-9);
    };

    const normalizedContact = normalizeContact(input.contact);

    const existingUser = await db.query.staffs.findFirst({
      where: or(
        eq(staffs.email, input.email),
        sql`RIGHT(REPLACE(${staffs.contact}, '\\D', ''), 9) = ${normalizedContact}`
      ),
    });

    if (existingUser) {
      if (existingUser.email === input.email) {
        zodError.addIssue({
          code: "custom",
          message: `User with email ${input.email} already exists`,
          path: ["email"],
        });
      }

      if (
        normalizeContact(existingUser.contact) ===
        normalizeContact(input.contact)
      ) {
        zodError.addIssue({
          code: "custom",
          message: `User with contact ${input.contact} already exists`,
          path: ["contact"],
        });
      }
      return { success: false, issues: zodError.errors };
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(input.lastName.toUpperCase(), salt);

    const userinput = {
      ...input,
      password: hashedPassword,
    };

    const savedUser = await db
      .insert(staffs)
      .values(userinput)
      .returning({ staffId: staffs.staffId });

    const user = savedUser[0];
    console.info(`Staff created successfully: ${user}`);

    return { detail: "Staff added successfully", success: true };
  } catch (error) {
    console.error(
      `Error while creating user ${JSON.stringify(input)}: ${error}`
    );
    throw error;
  }
}

export const getAll = async (): Promise<Staff[]> => {
  try {
    const result = await db.query.staffs.findMany({
      where: ne(staffs.isSuperUser, true),
    });

    return result;
  } catch (error) {
    console.error(`Error while fatching all staffs: ${error}`);
    throw error;
  }
};
