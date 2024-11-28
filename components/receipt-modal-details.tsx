import { ReceiptWithRelations } from "@/db/schema";
import React from "react";
import { Text, Divider, Grid, Stack, Button, Flex, Modal } from "@mantine/core";
import { formatMoney } from "@/lib/utils/functions";

interface ReceiptModalDetailsProps {
  opened: boolean;
  close: () => void;
  receipt: ReceiptWithRelations | null;
}

const ReceiptModalDetails: React.FC<ReceiptModalDetailsProps> = ({
  close,
  opened,
  receipt,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Receipt Details"
      transitionProps={{
        transition: "fade",
        duration: 600,
        timingFunction: "linear",
      }}
      size="xl"
      closeOnClickOutside={false}
    >
      {receipt ? (
        <Stack gap="xs" style={{ fontFamily: "monospace" }}>
          <Text ta="center" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Receipt Details
          </Text>
          <Divider my="sm" />

          {/* Exchange Rates Section */}
          <Text ta="center" style={{ fontWeight: "bold" }}>
            Exchange Rates
          </Text>
          <Text>
            Cost per Kg Exchange Rate:{" "}
            {formatMoney(Number(receipt.costPerKgExchangeRate))} TZS
          </Text>
          <Text>
            Payment Currency Exchange Rate:{" "}
            {formatMoney(Number(receipt.paymentCurrencyExchangeRate))} TZS
          </Text>
          <Text>
            USD Exchange Rate: {formatMoney(Number(receipt.usdExchangeRate))}{" "}
            TZS
          </Text>

          <Divider my="sm" />

          {/* Receipt Information */}
          <Grid>
            <Grid.Col span={6}>
              <Text>Receipt Code Number: {receipt.codeNumber}</Text>
              <Text>
                Posting Date:{" "}
                {receipt.postingDate
                  ? receipt.postingDate.toLocaleDateString()
                  : "N/A"}
              </Text>
              <Text>Total Boxes: {receipt.totalBox || "N/A"}</Text>
              <Text>
                Total Weight: {Number(receipt.totalWeight).toFixed(2) || "N/A"}{" "}
                kg
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text ta="right">
                Cost per Kg:{" "}
                {receipt.costPerKg
                  ? `${formatMoney(Number(receipt.costPerKg))} ${
                      receipt.costPerKgCurrency
                    }`
                  : "N/A"}
              </Text>
              <Text ta="right">
                Total Shipment (USD):{" "}
                {formatMoney(Number(receipt.totalShipmentUSD))} USD
              </Text>
              <Text ta="right">
                Total Shipment (Tshs):{" "}
                {formatMoney(Number(receipt.totalShipmentTshs))} TZS
              </Text>
              <Text ta="right">
                Total Paid in TZS: {formatMoney(Number(receipt.totalPaidInTzs))}{" "}
                TZS
              </Text>
              <Text ta="right">
                Total Paid in USD: {formatMoney(Number(receipt.totalPaidInUsd))}{" "}
                USD
              </Text>
            </Grid.Col>
          </Grid>

          <Divider my="sm" />

          {/* Customer Information */}
          <Text ta="center" style={{ fontWeight: "bold" }}>
            Customer Information
          </Text>
          <Text>Code Number: {receipt.customer.codeNumber}</Text>
          <Text>First Name: {receipt.customer.firstName}</Text>
          <Text>Last Name: {receipt.customer.lastName}</Text>
          <Text>Email: {receipt.customer.email}</Text>
          <Text>Contact: {receipt.customer.contact}</Text>
          <Text>Region: {receipt.customer.region}</Text>
          <Text>District: {receipt.customer.district}</Text>
          <Text>
            Created At:{" "}
            {receipt.customer.createdAt
              ? receipt.customer.createdAt.toLocaleDateString()
              : "N/A"}
          </Text>
          <Text>
            Updated At:{" "}
            {receipt.customer.updatedAt
              ? receipt.customer.updatedAt.toLocaleDateString()
              : "N/A"}
          </Text>

          <Divider my="sm" />

          {/* Staff Information */}
          <Text ta="center" style={{ fontWeight: "bold" }}>
            Customer Care Information
          </Text>
          <Text>First Name: {receipt.staff.firstName}</Text>
          <Text>Last Name: {receipt.staff.lastName}</Text>
          <Text>Email: {receipt.staff.email}</Text>
          <Text>Contact: {receipt.staff.contact}</Text>
          <Text>Department: {receipt.staff.department}</Text>
          <Text>
            Created At:{" "}
            {receipt.staff.createdAt
              ? receipt.staff.createdAt.toLocaleDateString()
              : "N/A"}
          </Text>
          <Text>
            Updated At:{" "}
            {receipt.staff.updatedAt
              ? receipt.staff.updatedAt.toLocaleDateString()
              : "N/A"}
          </Text>

          <Divider my="sm" />

          {/* Additional Information */}
          <Text>
            Credit Amount: {formatMoney(Number(receipt.creditAmount))} TZS
          </Text>
          <Text>
            Outstanding: {formatMoney(Number(receipt.outstanding))} TZS
          </Text>
          <Text>Balance: {formatMoney(Number(receipt.balance))} TZS</Text>

          <Divider my="sm" />
        </Stack>
      ) : (
        <div></div>
      )}

      <Flex direction="row" justify="end" align="center" gap="lg" mt="md">
        <Button variant="filled" color="red" onClick={close}>
          Close
        </Button>
      </Flex>
    </Modal>
  );
};

export default ReceiptModalDetails;
