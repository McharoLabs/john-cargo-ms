"use server";
import { auth } from "@/auth";
import { signOut } from "@/auth/helper";
import { db } from "@/db";
import { Currency, currency } from "@/db/schema";
import {
  CurrencySchema,
  CurrencySchemaType,
} from "@/lib/z-schema/currency.schema";
import { aliasedTable, eq, or } from "drizzle-orm";
import { ZodError } from "zod";

export const createCurrency = async (input: CurrencySchemaType) => {
  try {
    const staff = await auth();
    if (!staff || !staff.user) {
      await signOut();
      window.location.reload();
      return { success: false, detail: "User is not authenticated" };
    }

    if (!staff.user.isSuperUser) {
      return {
        success: false,
        detail: "You are not authorized to perform this task",
      };
    }

    const zodError = new ZodError([]);
    const result = CurrencySchema.safeParse(input);

    if (!result.success) {
      return { success: false, issues: result.error.issues, data: null };
    }

    const existingCurrency = await db.query.currency.findFirst({
      where: or(
        eq(currency.currency_code, input.currency_code.toUpperCase()),
        eq(currency.symbol, input.symbol),
        eq(currency.currency_name, input.currency_name)
      ),
    });

    if (existingCurrency) {
      if (
        existingCurrency.currency_code === input.currency_code.toUpperCase()
      ) {
        zodError.addIssue({
          code: "custom",
          message: "Currency code already exists.",
          path: ["currency_code"],
        });
      }

      if (existingCurrency.symbol === input.symbol) {
        zodError.addIssue({
          code: "custom",
          message: "Currency symbol already exists.",
          path: ["symbol"],
        });
      }

      if (existingCurrency.currency_name === input.currency_name) {
        zodError.addIssue({
          code: "custom",
          message: "Currency name already exists.",
          path: ["currency_name"],
        });
      }
    }

    if (zodError.errors.length > 0) {
      return { success: false, issues: zodError.errors, data: null };
    }

    const data: Currency[] = await db
      .insert(currency)
      .values({
        currency_code: input.currency_code.toUpperCase(),
        currency_name: input.currency_name,
        rate_to_tzs: String(input.rate_to_tzs),
        symbol: input.symbol,
      })
      .returning();

    return {
      success: true,
      message: "Currency created successfully.",
      data: data[0],
    };
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
