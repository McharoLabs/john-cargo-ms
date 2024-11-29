"use client";

import React from "react";
import {
  NumberInput,
  Checkbox,
  Button,
  Paper,
  Title,
  Grid,
  Select,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { ReceiptSchemaType } from "@/lib/z-schema/receipt.schema";
import {
  showLoadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from "./notificationUtils";
import {
  createReceipt,
  receiptBasicCalculations,
} from "@/actions/receipt.server.action";
import { getAllCustomers } from "@/actions/customer.server.action";
import { Currency, Customer } from "@/db/schema";
import dayjs from "dayjs";
import { DateInput, DateInputProps } from "@mantine/dates";
import { getCurrencies } from "@/actions/currency.server.action";
import { PaymentStatusEnum } from "@/lib/enum/payment-status-enum";
import { useDisclosure } from "@mantine/hooks";
import ReceiptModal from "./receipt-modal";

const ReceiptForm = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loadingExtraData, setLoadingExtraData] =
    React.useState<boolean>(false);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);

  const form = useForm<ReceiptSchemaType>({
    name: "receipt-form",
    mode: "controlled",
    initialValues: {
      customerName: null,
      codeNumber: "",
      postingDate: null,
      totalBox: "",
      totalWeight: "",
      costPerKg: "",
      costPerKgCurrency: null,
      amountPaid: "",
      paymentCurrency: null,
      status: PaymentStatusEnum.UNPAID,
      shipped: false,
      received: false,
      totalPaidInTzs: null,
      totalPaidInUsd: null,
      totalShipmentUSD: null,
      totalShipmentTshs: null,
      creditAmount: null,
      balance: null,
      outstanding: null,
      totalCost: null,
      costPerKgExchangeRate: 0,
      paymentCurrencyExchangeRate: 0,
      usdExchangeRate: 0,
    },
    validate: {
      customerName: isNotEmpty("Please select customer"),
      postingDate: isNotEmpty("Posting date is required"),
      totalBox: isNotEmpty("Total box is required"),
      totalWeight: isNotEmpty("Total weight is required"),
      costPerKg: isNotEmpty("Cost per kg is required"),
      costPerKgCurrency: isNotEmpty("Cost currency is required"),
      amountPaid: isNotEmpty("Amount paid is required"),
      paymentCurrency: isNotEmpty("Payment currency is required"),
    },
  });

  form.watch("customerName", ({ value }) => {
    console.log(value);
    const customer = customers.find(
      (cust) => `${cust.firstName} ${cust.lastName}` === value
    );
    console.log(customer);
    if (customer) {
      form.setFieldValue("codeNumber", customer.codeNumber);
    } else {
      form.setFieldValue("codeNumber", "");
    }
  });

  React.useEffect(() => {
    fetchCurencies();
  }, []);

  React.useEffect(() => {
    fetchAllCustomers();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoadingExtraData(true);
      const extraData = await receiptBasicCalculations({
        codeNumber: form.values.codeNumber,
        totalBox: Number(form.values.totalBox),
        totalWeight: Number(form.values.totalWeight),
        costPerKg: Number(form.values.costPerKg),
        costPerKgCurrency: form.values.costPerKgCurrency
          ? form.values.costPerKgCurrency
          : "",
        amountPaid: Number(form.values.amountPaid),
        paymentCurrency: form.values.paymentCurrency
          ? form.values.paymentCurrency
          : "",
      });

      if (extraData.issues) {
        extraData.issues.forEach((issue) => {
          form.setFieldError(
            issue.path[0] as keyof ReceiptSchemaType,
            issue.message
          );
        });
        return;
      }

      form.setValues({
        ...values,
        ...extraData.data,
      });

      // form.setValues({
      //   balance: extraData.data.balance,
      //   creditAmount: extraData.data.creditAmount,
      //   outstanding: extraData.data.outstanding,
      //   totalShipmentTshs: extraData.data.totalShipmentTshs,
      //   totalShipmentUSD: extraData.data.totalShipmentUSD,
      //   status: extraData.data.status,
      //   totalPaidInTzs: extraData.data.totalPaidInTzs,
      //   totalPaidInUsd: extraData.data.totalPaidInUsd,
      // });

      setTimeout(() => {
        open();
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingExtraData(false);
    }
  };

  const confirm = async () => {
    close();
    setIsLoading(true);
    const notificationProps = {
      id: "receipt-form-submission",
      title: "Submitting your form",
      message: "Please wait...",
    };
    showLoadingNotification(notificationProps);
    try {
      const result = await createReceipt(form.values);
      if (result.success) {
        updateSuccessNotification({
          ...notificationProps,
          title: "Form submitted successfully",
          message: "Your data has been saved!",
        });
        form.reset();
      } else if (result.issues) {
        result.issues.forEach((issue) => {
          form.setFieldError(
            issue.path[0] as keyof ReceiptSchemaType,
            issue.message
          );
        });
        updateErrorNotification({
          ...notificationProps,
          title: "Submission failed",
          message: "There was an issue with your submission.",
        });
      } else {
        updateErrorNotification({
          ...notificationProps,
          title: "Submission failed",
          message: result.detail,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      updateErrorNotification({
        ...notificationProps,
        title: "An error occurred",
        message: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCustomers = async () => {
    try {
      const result = await getAllCustomers();
      setCustomers(result);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCurencies = async () => {
    try {
      const result = await getCurrencies();
      setCurrencies(result);
    } catch (error) {
      console.error(error);
    }
  };

  const dateParser: DateInputProps["dateParser"] = (input) => {
    if (input === "WW2") {
      return new Date(1939, 8, 1);
    }
    return dayjs(input, "YYYY-MM-DD").toDate();
  };

  return (
    <div>
      <ReceiptModal
        opened={opened}
        close={close}
        confirm={confirm}
        form={form}
        customers={customers}
      />

      <Title ta="start" mb="lg" size={24}>
        Add New Receipt
      </Title>
      <Box pos="relative">
        <LoadingOverlay
          visible={loadingExtraData}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Paper withBorder shadow="md" p={30} radius="md">
            <Grid align="center">
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Select
                  label="Customer"
                  placeholder="Select Customer"
                  data={customers.map((c) => `${c.firstName} ${c.lastName}`)}
                  searchable
                  clearable
                  value={form.values.customerName}
                  error={form.errors.customerName}
                  onChange={(value) =>
                    form.setFieldValue("customerName", value)
                  }
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <DateInput
                  label="Posting Date"
                  placeholder="Enter posting date (YYYY-MM-DD)"
                  clearable
                  valueFormat="YYYY-MM-DD"
                  dateParser={dateParser}
                  value={form.values.postingDate}
                  error={form.errors.postingDate}
                  onChange={(value) => form.setFieldValue("postingDate", value)}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <NumberInput
                  label="Total Box"
                  placeholder="Enter total box count"
                  thousandSeparator=","
                  min={0}
                  value={form.values.totalBox}
                  error={form.errors.totalBox}
                  onChange={(value) => form.setFieldValue("totalBox", value)}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <NumberInput
                  label="Total Weight"
                  placeholder="Enter total weight"
                  thousandSeparator=","
                  min={0}
                  value={form.values.totalWeight}
                  error={form.errors.totalWeight}
                  onChange={(value) => form.setFieldValue("totalWeight", value)}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <NumberInput
                  label="Cost per Kg"
                  placeholder="Enter cost per kg"
                  min={0}
                  value={form.values.costPerKg}
                  error={form.errors.costPerKg}
                  onChange={(value) => form.setFieldValue("costPerKg", value)}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Select
                  label="Cost Per Kg Currency"
                  placeholder="Cost Per Kg Currency"
                  data={currencies.map((c) => c.currency_code)}
                  searchable
                  clearable
                  value={form.values.costPerKgCurrency}
                  error={form.errors.costPerKgCurrency}
                  onChange={(value) =>
                    form.setFieldValue("costPerKgCurrency", value)
                  }
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <NumberInput
                  label="Amount Paid"
                  placeholder="Enter amount paid"
                  min={0}
                  value={form.values.amountPaid}
                  error={form.errors.amountPaid}
                  onChange={(value) => form.setFieldValue("amountPaid", value)}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Select
                  label="Payment Currency"
                  placeholder="Payment Currency"
                  data={currencies.map((c) => c.currency_code)}
                  searchable
                  clearable
                  value={form.values.paymentCurrency}
                  error={form.errors.paymentCurrency}
                  onChange={(value) =>
                    form.setFieldValue("paymentCurrency", value)
                  }
                />
              </Grid.Col>
            </Grid>
            <Grid mt={"md"}>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Checkbox
                  label="Shipped"
                  {...form.getInputProps("shipped", { type: "checkbox" })}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Checkbox
                  label="Received"
                  {...form.getInputProps("received", { type: "checkbox" })}
                />
              </Grid.Col>
            </Grid>

            <Button
              fullWidth
              mt="lg"
              type="submit"
              w={{ lg: 400 }}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </Paper>
        </form>
      </Box>
    </div>
  );
};

export default ReceiptForm;
