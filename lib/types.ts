import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }).trim(),
});
export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

export const RegistrationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be 50 characters or less" })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be 50 characters or less" })
    .trim(),
  email: z.string().trim().email({ message: "Invalid email" }),
  contact: z
    .string()
    .min(1, { message: "Contact is required" })
    .max(50, { message: "Contact must be 50 characters or less" })
    .trim(),
  password: z.string().optional(),
  codeNumber: z.string().optional(),
  isStaff: z.boolean().default(false),
});
export type RegistrationSchemaType = z.infer<typeof RegistrationSchema>;
