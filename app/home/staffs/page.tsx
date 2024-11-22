import StaffFormpage from "@/components/staff-form";
import { Container } from "@mantine/core";
import React from "react";

const StaffPage = () => {
  return (
    <Container size={"xl"} p={0}>
      <StaffFormpage />
    </Container>
  );
};

export default StaffPage;
