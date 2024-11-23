import StaffFormpage from "@/components/staff-form";
import StaffTable from "@/components/staff-table";
import { Container, Space } from "@mantine/core";
import React from "react";

const StaffPage = () => {
  return (
    <Container size={"xl"} p={0}>
      <StaffFormpage />
      <Space h="lg" />
      <StaffTable />
    </Container>
  );
};

export default StaffPage;
