import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password required"),
    newPassword: z.string().min(1, "New Password required"),
    confirmPassword: z.string().min(1, "Please re-type your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordFormType = z.infer<typeof ResetPasswordSchema>;
