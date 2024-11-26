import ReceiptForm from "@/components/receipt-form";
import { Container } from "@mantine/core";
import React from "react";

const ReceiptsPage = () => {
  return (
    <Container size={"xl"} p={0}>
      <ReceiptForm />
    </Container>
  );
};

export default ReceiptsPage;
