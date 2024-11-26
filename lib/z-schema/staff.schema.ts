import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invaid email address" }).trim(),
  password: z.string().trim(),
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

export const StaffsSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First name is required and must be at least 2 characters",
    })
    .max(50, { message: "First name must be 50 characters or less" })
    .trim(),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be 50 characters or less" })
    .trim(),

  email: z
    .string()
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must be 255 characters or less" })
    .trim(),

  contact: z
    .string()
    .min(10, { message: "Contact must be at least 10 characters" })
    .max(50, { message: "Contact must be 50 characters or less" })
    .trim(),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(255, { message: "Password must be 255 characters or less" })
    .optional(),

  isSuperUser: z.boolean().default(false),

  department: z
    .string()
    .max(255, { message: "Department name must be 255 characters or less" })
    .nullable(),
});

export type StaffsSchemaType = z.infer<typeof StaffsSchema>;
