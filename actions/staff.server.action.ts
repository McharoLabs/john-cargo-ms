"use server";
import { db } from "@/db";
import { Staff, staffs } from "@/db/schema";
import {
  ResetPasswordFormType,
  ResetPasswordSchema,
} from "@/lib/z-schema/reset-password";
import { StaffsSchema, StaffsSchemaType } from "@/lib/z-schema/staff.schema";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { eq, ne, or, sql } from "drizzle-orm";
import { ZodError } from "zod";
import { compare } from "bcrypt-ts";
import { auth } from "@/auth";
import { signOut } from "@/auth/helper";

export async function resetPassword(input: ResetPasswordFormType) {
  try {
    const zodError = new ZodError([]);
    const result = ResetPasswordSchema.safeParse(input);

    if (!result.success) {
      return { success: false, detail: null, issues: result.error.issues };
    }

    const staff = await auth();
    if (!staff || !staff.user) {
      await signOut();
      window.location.reload();
      return { success: false, detail: "User is not authenticated" };
    }

    const serverStaff = await db.query.staffs.findFirst({
      where: eq(staffs.staffId, staff.user.id),
    });

    if (!serverStaff) {
      return {
        success: false,
        detail: "Server could not identify you, please logout and login again",
      };
    }

    const isPasswordValid = await compare(
      input.oldPassword,
      serverStaff.password
    );

    if (!isPasswordValid) {
      zodError.addIssue({
        code: "custom",
        message: "Invalid credential",
        path: ["oldPassword"],
      });
      return { success: false, detail: null, issues: zodError.errors };
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(input.newPassword, salt);

    await db
      .update(staffs)
      .set({ password: hashedPassword })
      .where(eq(staffs.staffId, staff.user.id));

    return { success: true, detail: "Password changed successful" };
  } catch (error) {
    console.error(`Error while resetting password: ${error}`);
    throw error;
  }
}

export async function create(input: StaffsSchemaType) {
  try {
    const zodError = new ZodError([]);

    const result = StaffsSchema.safeParse(input);
    if (!result.success) {
      return {
        success: false,
        issues: result.error.issues,
        detail: null,
        data: null,
      };
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
      return { success: false, issues: zodError.errors, data: null };
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(input.lastName.toUpperCase(), salt);

    const userinput = {
      ...input,
      password: hashedPassword,
    };

    const savedUser: Staff[] = await db
      .insert(staffs)
      .values(userinput)
      .returning();

    const user = savedUser[0];
    console.info(`Staff created successfully: ${user}`);

    return {
      detail: "Staff added successfully",
      success: true,
      data: savedUser[0],
    };
  } catch (error) {
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
