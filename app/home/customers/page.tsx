import CustomerForm from "@/components/customer-form";
import CustomerTable from "@/components/customer-table";
import { Container, Space } from "@mantine/core";
import React from "react";

const CustomersPage = () => {
  return (
    <Container size={"xl"} p={0}>
      <CustomerForm />
      <Space h={"xl"} />
      <CustomerTable />
    </Container>
  );
};

export default CustomersPage;
