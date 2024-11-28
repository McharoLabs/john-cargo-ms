import ReceiptForm from "@/components/receipt-form";
import ReceiptTable from "@/components/receipt-table";
import { Space } from "@mantine/core";
import React from "react";

const ReceiptsPage = () => {
  return (
    <div>
      <ReceiptForm />
      <Space h={"lg"} />
      <ReceiptTable />
    </div>
  );
};

export default ReceiptsPage;
