import { createCurrency } from "@/actions/currency.server.action";
import { CurrencySchemaType } from "@/lib/z-schema/currency.schema";

async function seedCurrency() {
  const currencyData: CurrencySchemaType[] = [
    {
      currency_code: "USD",
      currency_name: "US Dollar",
      rate_to_tzs: "2340.0",
      symbol: "$",
    },
    {
      currency_code: "EUR",
      currency_name: "Euro",
      rate_to_tzs: "2500.0",
      symbol: "€",
    },
    {
      currency_code: "GBP",
      currency_name: "British Pound",
      rate_to_tzs: "2800.0",
      symbol: "£",
    },
    {
      currency_code: "KES",
      currency_name: "Kenyan Shilling",
      rate_to_tzs: "20.0",
      symbol: "KSh",
    },
    {
      currency_code: "ZAR",
      currency_name: "South African Rand",
      rate_to_tzs: "160.0",
      symbol: "R",
    },
    {
      currency_code: "TZS",
      currency_name: "Tanzanian Shilling",
      rate_to_tzs: "1.0",
      symbol: "TSh",
    },
  ];

  try {
    for (const currency of currencyData) {
      const result = await createCurrency(currency);

      if (result.success) {
        console.log("Currency created successfully:", result.message);
      } else {
        console.error(
          "Failed to create currency:",
          result.message,
          result.issues
        );
      }
    }
    process.exit();
  } catch (error) {
    console.error("Error occurred while creating currency:", error);
    process.exit(1);
  }
}

seedCurrency();
