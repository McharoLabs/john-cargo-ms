import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }).trim(),
});
export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
