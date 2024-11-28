import { Customer } from "@/db/schema";
import { formatMoney } from "@/lib/utils/functions";
import { ReceiptSchemaType } from "@/lib/z-schema/receipt.schema";
import { Modal, Text, Stack, Divider, Grid, Flex, Button } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

interface ReceiptModalProps {
  opened: boolean;
  close: () => void;
  confirm: () => void;
  form: UseFormReturnType<ReceiptSchemaType>;
  customers: Customer[];
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  opened,
  close,
  confirm,
  form,
  customers,
}) => {
  const customer = customers.find(
    (c) => c.codeNumber === form.values.codeNumber
  );

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
      {form.values && customer && (
        <Stack gap="xs" style={{ fontFamily: "monospace" }}>
          {/* Title */}
          <Text ta="center" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Receipt
          </Text>

          <Divider my="sm" />

          {/* Exchange Rates */}
          <Text ta="center" style={{ fontWeight: "bold" }}>
            Exchange Rates
          </Text>
          <Text>
            Cost per Kg Exchange Rate:{" "}
            {formatMoney(form.values.costPerKgExchangeRate)} TZS
          </Text>
          <Text>
            Payment Currency Exchange Rate:{" "}
            {formatMoney(form.values.paymentCurrencyExchangeRate)} TZS
          </Text>
          <Text>
            USD Exchange Rate: {formatMoney(form.values.usdExchangeRate)} TZS
          </Text>

          <Divider my="sm" />

          {/* Receipt Information */}
          <Grid>
            <Grid.Col span={6}>
              <Text>Receipt No: {form.values.codeNumber}</Text>
              <Text>
                Posting Date:{" "}
                {form.values.postingDate
                  ? form.values.postingDate.toLocaleDateString()
                  : "N/A"}
              </Text>
              <Text>Total Boxes: {form.values.totalBox || "N/A"}</Text>
              <Text>Total Weight: {form.values.totalWeight || "N/A"} kg</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text ta="right">
                Cost per Kg:{" "}
                {form.values.costPerKg
                  ? `${formatMoney(Number(form.values.costPerKg))} ${
                      form.values.costPerKgCurrency
                    }`
                  : "N/A"}
              </Text>
              <Text ta="right">
                Total cost:{" "}
                {form.values.totalCost
                  ? `${formatMoney(Number(form.values.totalCost))} ${
                      form.values.costPerKgCurrency
                    }`
                  : "N/A"}
              </Text>
              <Text ta="right">
                Amount Paid:{" "}
                {form.values.amountPaid
                  ? `${formatMoney(Number(form.values.amountPaid))} ${
                      form.values.paymentCurrency
                    }`
                  : "N/A"}
              </Text>
              <Text ta="right">
                Outstanding:{" "}
                {form.values.outstanding
                  ? `${formatMoney(Number(form.values.outstanding))} TZS`
                  : "N/A"}
              </Text>
            </Grid.Col>
          </Grid>

          <Divider my="sm" />

          {/* Shipment Information */}
          <Text ta="center" style={{ fontWeight: "bold" }}>
            Shipment Details
          </Text>
          <Grid>
            <Grid.Col span={6}>
              <Text>
                Total Shipment (USD):{" "}
                {form.values.totalShipmentUSD
                  ? `${formatMoney(Number(form.values.totalShipmentUSD))}`
                  : "N/A"}
              </Text>
              <Text>
                Total Shipment (Tshs):{" "}
                {form.values.totalShipmentTshs
                  ? `${formatMoney(Number(form.values.totalShipmentTshs))}`
                  : "N/A"}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text ta="right">
                Credit Amount:{" "}
                {form.values.creditAmount
                  ? `${formatMoney(Number(form.values.creditAmount))} TZS`
                  : "N/A"}
              </Text>
              <Text ta="right">
                Outstanding:{" "}
                {form.values.outstanding
                  ? `${formatMoney(Number(form.values.outstanding))} TZS`
                  : "N/A"}
              </Text>
              <Text ta="right">
                Balance:{" "}
                {form.values.balance
                  ? `${formatMoney(Number(form.values.balance))} TZS`
                  : "N/A"}
              </Text>
            </Grid.Col>
          </Grid>

          <Divider my="sm" />

          {/* Customer Information */}
          <Text ta="center" style={{ fontWeight: "bold" }}>
            Customer Information
          </Text>
          <Text>
            Name: {customer.firstName} {customer.lastName}
          </Text>
          <Text>Email: {customer.email}</Text>
          <Text>Contact: {customer.contact}</Text>
          <Text>Region: {customer.region}</Text>
          <Text>District: {customer.district}</Text>

          {/* Status */}
          <Divider my="sm" />
          <Text>Status: {form.values.status}</Text>
          <Text>Shipped: {form.values.shipped ? "Yes" : "No"}</Text>
          <Text>Received: {form.values.received ? "Yes" : "No"}</Text>
        </Stack>
      )}

      <Flex
        direction={"row"}
        justify={"end"}
        align={"center"}
        gap={"lg"}
        mt={"md"}
      >
        <Button variant="filled" color="red" onClick={close}>
          Cancel
        </Button>
        <Button variant="filled" color="green" onClick={confirm}>
          Confirm
        </Button>
      </Flex>
    </Modal>
  );
};

export default ReceiptModal;
