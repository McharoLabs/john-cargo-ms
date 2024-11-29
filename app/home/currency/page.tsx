import CurrencyForm from "@/components/currency-form";
import CurrencyConversionTable from "@/components/currency-table";
import { Container, Space } from "@mantine/core";
import React from "react";

const CurrencyPage = () => {
  return (
    <Container size={"xl"} p={0}>
      <CurrencyForm />
      <Space h={"xl"} />

      <CurrencyConversionTable />
    </Container>
  );
};

export default CurrencyPage;
