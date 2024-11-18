import { db } from "@/db";
import { staffs } from "@/db/schema";
import { StaffsSchema, StaffsSchemaType } from "@/lib/z.schema";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { eq } from "drizzle-orm";

export async function create(input: StaffsSchemaType) {
  try {
    const result = StaffsSchema.safeParse(input);
    if (!result.success) {
      return { success: false, issues: result.error.issues, detail: null };
    }

    const existingUser = await db.query.staffs.findFirst({
      where: eq(staffs.email, input.email),
    });

    if (existingUser) {
      return {
        success: false,
        detail: `User with email ${input.email} already exists`,
      };
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
    console.info(`Staff created successfull: ${user}`);

    return { detail: "Staff added successfully", success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
