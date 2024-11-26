import CurrencyForm from "@/components/currency-form";
import CurrencyConversionTable from "@/components/currency-table";
import { Flex } from "@mantine/core";
import React from "react";

const DashboardPage = () => {
  return (
    <div>
      <Flex direction={{ base: "column", sm: "column", xl: "row" }} gap={"md"}>
        <CurrencyForm />
        <CurrencyConversionTable />
      </Flex>
    </div>
  );
};

export default DashboardPage;
