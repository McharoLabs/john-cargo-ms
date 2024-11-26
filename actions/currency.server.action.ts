"use server";
import { db } from "@/db";
import { Currency, currency } from "@/db/schema";
import {
  CurrencySchema,
  CurrencySchemaType,
} from "@/lib/z-schema/currency.schema";
import { aliasedTable, eq } from "drizzle-orm";
import { ZodError } from "zod";

export const createCurrency = async (input: CurrencySchemaType) => {
  try {
    const zodError = new ZodError([]);
    const result = CurrencySchema.safeParse(input);

    if (!result.success) {
      return { success: false, issues: result.error.issues };
    }

    const existingCurrency: Currency | undefined =
      await db.query.currency.findFirst({
        where: eq(currency.currency_code, input.currency_code.toUpperCase()),
      });

    if (existingCurrency) {
      zodError.addIssue({
        code: "custom",
        message: "Currency already exists.",
        path: ["currency_code"],
      });
      return { success: false, issues: zodError.errors };
    }

    await db.insert(currency).values({
      currency_code: input.currency_code.toUpperCase(),
      currency_name: input.currency_name,
      rate_to_tzs: String(input.rate_to_tzs),
      symbol: input.symbol,
    });

    return { success: true, message: "Currency created successfully." };
  } catch (error) {
    console.error(`Error occurred while creating currency: ${error}`);
    throw error;
  }
};

export const getCurrencies = async (): Promise<Currency[]> => {
  try {
    const result = await db.query.currency.findMany();
    return result;
  } catch (error) {
    console.error(`Error while getting all currency: ${error}`);
    throw error;
  }
};

export const getCurrency = async ({
  currency_code,
}: {
  currency_code: string;
}): Promise<Currency> => {
  try {
    const cl = aliasedTable(currency, "cl");

    const result = await db
      .select()
      .from(cl)
      .where(eq(cl.currency_code, currency_code));

    return result[0];
  } catch (error) {
    console.error(`Error while getting currency: ${error}`);
    throw error;
  }
};
