"use server";
import { db } from "@/db";
import { Staff, staffs } from "@/db/schema";
import { FindByEmailArgs } from "@/types/staff.type";
import { eq } from "drizzle-orm";

export const findByEmail = async ({
  email,
}: FindByEmailArgs): Promise<Staff | null> => {
  try {
    const staff = await db.query.staffs.findFirst({
      where: eq(staffs.email, email),
    });

    if (!staff) {
      return null;
    }
    return staff;
  } catch (error) {
    console.error(`Error while finding staff by email: ${error}`);
    return null;
  }
};
