import { z } from "zod";

export const CustomerSchema = z.object({
  customerId: z.string().uuid().optional(),
  codeNumber: z.string().max(50).optional(),
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  email: z.string().email().max(255),
  contact: z.string().max(50),
  region: z.string(),
  district: z.string(),
  addedBy: z.string().uuid().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type CustomerSchemaType = z.infer<typeof CustomerSchema>;
