import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }).trim(),
});
export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

export const RegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name is required" })
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
    .min(10, { message: "Contact must have 10 characters" })
    .max(12, { message: "Contact must be 12 characters or less" })
    .trim(),
  password: z.string().optional(),
  codeNumber: z.string().optional(),
  isStaff: z.boolean().default(false).optional(),
});
export type RegistrationSchemaType = z.infer<typeof RegistrationSchema>;

export interface User {
  userId: string;
  codeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  createdAt: Date;
  isStaff: string | null;
}
