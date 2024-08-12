"use server";
import { userTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LoginFormSchema, LoginFormSchemaType } from "@/lib/types";

export async function loginAction(formData: LoginFormSchemaType) {
  const result = LoginFormSchema.safeParse(formData);

  if (!result.success) {
    return { success: false, issues: result.error.issues };
  }

  try {
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirectTo: "/home",
      redirect: true,
    });

    return { success: true, detail: "" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { detail: "Invalid Credentials", success: false };
        default:
          return { detail: "Unknown Error Found", success: false };
      }
    }
    throw error;
  }
}

export async function findUserByEmail({ email }: { email: string }) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email.toLowerCase()),
  });

  return user;
}
