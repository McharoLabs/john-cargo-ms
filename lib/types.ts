import { z } from "zod";
import { STATUS } from "./enum";

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

export const CargoFormSchema = z.object({
  codeNumber: z.string().min(1, "Please select a customer"),
  postingDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  totalBox: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "totalBox must be a valid number",
  }),
  totalWeight: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "totalWeight must be a valid number",
  }),
  costPerKg: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "costPerKg must be a valid number",
  }),
  totalShipmentUSD: z.string().optional(),
  exchangeRate: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "exchangeRate must be a valid number",
  }),
  totalShipmentTshs: z.string().optional(),
  amountPaid: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "amountPaid must be a valid number",
  }),
  creditAmount: z.string().optional().optional(),
  outstanding: z.string().optional(),
  balance: z.string().optional(),
  status: z.enum([STATUS.NOT_PAID, STATUS.PARTIALLY_PAID, STATUS.PAID], {
    message: "Select cargo status",
  }),
  shipped: z.boolean().default(false),
  received: z.boolean().default(false),
});

export type CargoFormSchemaType = z.infer<typeof CargoFormSchema>;

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

export type SearchCustomerType = {
  codeNumber: string;
  name: unknown;
};

export interface SelectOption {
  value: string;
  label: string;
}

interface Cargo {
  cargoId: string;
  codeNumber: string;
  postingDate: Date;
  totalBox: string;
  totalWeight: string;
  costPerKg: string;
  totalShipmentUSD: string;
  exchangeRate: string;
  totalShipmentTshs: string;
  amountPaid: string;
  creditAmount: string | null;
  outstanding: string | null;
  balance: string | null;
  status: string;
  shipped: boolean;
  received: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  codeNumber: string;
  name: unknown;
  email: string;
  contact: string;
  createdAt: Date;
}

export interface CargoWithCustomer {
  cargo: Cargo;
  users: Customer;
}
