"use server";
import { signIn } from "@/auth";
import {
  LoginFormSchema,
  LoginFormSchemaType,
} from "@/lib/z-schema/staff.schema";
import { AuthError } from "next-auth";
import { ZodError } from "zod";

export async function loginAction(formData: LoginFormSchemaType) {
  const result = LoginFormSchema.safeParse(formData);

  if (!result.success) {
    return { success: false, issues: result.error.issues };
  }

  try {
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirectTo: "/home/dashboard",
      redirect: true,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      const zodError = new ZodError([]);

      switch (error.type) {
        case "CredentialsSignin":
          zodError.addIssues([
            {
              code: "custom",
              message: "Invalid Credentials",
              path: ["email"],
            },
            {
              code: "custom",
              message: "Invalid Credentials",
              path: ["password"],
            },
          ]);

          return {
            success: false,
            issues: zodError.issues,
          };
        default:
          zodError.addIssue({
            code: "custom",
            message: "Unknown Error Found",
            path: ["email"],
          });
          return { success: false };
      }
    }
    throw error;
  }
}
