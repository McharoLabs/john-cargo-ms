"use client";
import React from "react";
import cx from "clsx";
import { ActionIcon, Menu, rem, ScrollArea, Table, Title } from "@mantine/core";
import classes from "../style/TableScrollArea.module.css";
import { IconActivity, IconCreditCardPay, IconEye } from "@tabler/icons-react";
import { formatMoney } from "@/lib/utils/functions";
import ReceiptModalDetails from "./receipt-modal-details";
import { useDisclosure } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/GlobalRedux/store";
import { fetchReceipts } from "@/app/GlobalRedux/Features/receipt/receiptSlice";
import { ReceiptWithRelations } from "@/db/schema";

const ReceiptTable = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [receipt, setReceipt] = React.useState<ReceiptWithRelations | null>(
    null
  );
  const [scrolled, setScrolled] = React.useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { receipts, loading, error } = useSelector(
    (state: RootState) => state.receipt
  );

  React.useEffect(() => {
    if (receipts.length === 0) {
      dispatch(fetchReceipts());
    }
  }, [receipts.length, dispatch]);

  const rows = receipts.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.codeNumber}</Table.Td>
      <Table.Td>
        {row.customer.lastName + " " + row.customer.firstName}
      </Table.Td>
      <Table.Td>{row.staff.firstName + " " + row.staff.lastName}</Table.Td>
      <Table.Td>{formatMoney(Number(row.totalBox.toFixed(2)))}</Table.Td>
      <Table.Td>{Number(row.totalWeight).toFixed(2)}</Table.Td>
      <Table.Td>
        {Number(row.costPerKg).toFixed(2)} {row.costPerKgCurrency}
      </Table.Td>
      <Table.Td>{formatMoney(Number(row.totalShipmentUSD))}</Table.Td>
      <Table.Td>{formatMoney(Number(row.totalShipmentTshs))}</Table.Td>
      <Table.Td>{formatMoney(Number(row.totalPaidInTzs))}</Table.Td>
      <Table.Td>{row.paymentCurrency}</Table.Td>
      <Table.Td>
        {row.creditAmount ? formatMoney(Number(row.creditAmount)) : "N/A"}
      </Table.Td>
      <Table.Td>
        {row.outstanding ? formatMoney(Number(row.outstanding)) : "N/A"}
      </Table.Td>
      <Table.Td>
        {row.balance ? formatMoney(Number(row.balance)) : "N/A"}
      </Table.Td>
      <Table.Td>{row.status}</Table.Td>
      <Table.Td>{row.shipped ? "Yes" : "No"}</Table.Td>
      <Table.Td>{row.received ? "Yes" : "No"}</Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="light" size="xl" aria-label="Action Icon">
              <IconActivity />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item
              leftSection={
                <IconEye style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => {
                setReceipt(row);
                open();
              }}
            >
              View Receipt
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconCreditCardPay
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
            >
              Outstanding Payment
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <ReceiptModalDetails
        opened={opened}
        close={() => {
          close();
        }}
        receipt={receipt}
      />

      <Title ta="start" mb="lg" size={24}>
        Receipts
      </Title>
      <ScrollArea
        h={500}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table miw={1200} striped highlightOnHover>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>Code Number</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Staff</Table.Th>
              <Table.Th>Total Box</Table.Th>
              <Table.Th>Total Weight (kg)</Table.Th>
              <Table.Th>Cost Per Kg</Table.Th>
              <Table.Th>Total Shipment (USD)</Table.Th>
              <Table.Th>Total Shipment (Tshs)</Table.Th>
              <Table.Th>Total Paid (Tzs)</Table.Th>
              <Table.Th>Payment Currency</Table.Th>
              <Table.Th>Credit Amount(TZS)</Table.Th>
              <Table.Th>Outstanding(TZS)</Table.Th>
              <Table.Th>Balance(TZS)</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Shipped</Table.Th>
              <Table.Th>Received</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{!loading && !error && rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default ReceiptTable;
