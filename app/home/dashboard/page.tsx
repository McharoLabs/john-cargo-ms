import CurrencyForm from "@/components/currency-form";
import CurrencyConversionTable from "@/components/currency-table";
import RecentReceiptTable from "@/components/recent-receipt-table";
import { Flex, Space } from "@mantine/core";
import React from "react";

const DashboardPage = () => {
  return (
    <div>
      <Flex direction={{ base: "column", sm: "column", xl: "row" }} gap={"md"}>
        <CurrencyForm />
        <CurrencyConversionTable />
      </Flex>
      <Space h={"xl"} />
      <RecentReceiptTable />
    </div>
  );
};

export default DashboardPage;
