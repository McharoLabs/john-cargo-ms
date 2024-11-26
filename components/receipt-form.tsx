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
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  ReceiptSchema,
  ReceiptSchemaType,
} from "@/lib/z-schema/receipt.schema";
import {
  showLoadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from "./notificationUtils";
import { createReceipt } from "@/actions/receipt.server.action";
import { getAllCustomers } from "@/actions/customer.server.action";
import { Currency, Customer } from "@/db/schema";
import dayjs from "dayjs";
import { DateInput, DateInputProps } from "@mantine/dates";
import { getCurrencies } from "@/actions/currency.server.action";
import { PaymentStatusEnum } from "@/lib/enum/payment-status-enum";

const ReceiptForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState("");
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [selectedCPKCurrency, setSelectedCPKCurrency] = React.useState("");
  const [selectedPCurrency, setSelectedPCurrency] = React.useState("");

  // Initialize form with validation
  const form = useForm<ReceiptSchemaType>({
    initialValues: {
      codeNumber: "",
      postingDate: "",
      totalBox: null,
      totalWeight: null,
      costPerKg: null,
      costPerKgCurrency: "",
      totalShipmentUSD: null,
      exchangeRate: null,
      totalShipmentTshs: null,
      amountPaid: null,
      paymentCurrency: "",
      status: PaymentStatusEnum.UNPAID,
      shipped: false,
      received: false,
      creditAmount: null,
      balance: null,
      outstanding: null,
    },
    validate: zodResolver(ReceiptSchema),
  });

  React.useEffect(() => {
    fetchCurencies();
  }, []);

  React.useEffect(() => {
    if (form.values.paymentCurrency.length > 0) {
      const selectedData = currencies.find(
        (c) => c.currency_code === form.values.paymentCurrency
      );
      if (selectedData) {
        setSelectedPCurrency(selectedData.currency_code);
      }
    }
  }, [currencies, form.values.paymentCurrency]);

  React.useEffect(() => {
    if (form.values.costPerKgCurrency.length > 0) {
      const selectedData = currencies.find(
        (c) => c.currency_code === form.values.costPerKgCurrency
      );
      if (selectedData) {
        setSelectedCPKCurrency(selectedData.currency_code);
      }
    }
  }, [currencies, form.values.costPerKgCurrency]);

  React.useEffect(() => {
    if (form.values.codeNumber.length > 0) {
      const selectedData = customers.find(
        (c) => c.codeNumber === form.values.codeNumber
      );

      if (selectedData) {
        setSelectedCustomer(
          `${selectedData.firstName} ${selectedData.lastName}`
        );
      }
    }
  }, [customers, form.values.codeNumber]);

  React.useEffect(() => {
    fetchAllCustomers();
  }, []);

  const handleSubmit = async (values: ReceiptSchemaType) => {
    setIsLoading(true);
    const notificationProps = {
      id: "receipt-form-submission",
      title: "Submitting your form",
      message: "Please wait...",
    };

    showLoadingNotification(notificationProps);

    try {
      const result = await createReceipt(values);
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
          message: result.detail || "There was an issue with your submission.",
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
      <Title ta="start" mb="lg" size={24}>
        Add New Receipt
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                label="Customer"
                placeholder="Select Customer"
                required
                data={customers.map((c) => `${c.firstName} ${c.lastName}`)}
                searchable
                clearable
                value={selectedCustomer}
                error={form.errors.codeNumber}
                onChange={(value) => {
                  if (value) {
                    const selectedData = customers.find(
                      (c) => `${c.firstName} ${c.lastName}` === value
                    );

                    form.setFieldValue(
                      "codeNumber",
                      selectedData?.codeNumber || ""
                    );
                    setSelectedCustomer(
                      `${selectedData?.firstName} ${selectedData?.lastName}` ||
                        ""
                    );
                  } else {
                    form.setFieldValue("codeNumber", "");
                    setSelectedCustomer("");
                  }
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <DateInput
                label="Posting Date"
                placeholder="Enter posting date (YYYY-MM-DD)"
                required
                clearable
                valueFormat="YYYY-MM-DD"
                dateParser={dateParser}
                {...form.getInputProps("postingDate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                label="Total Box"
                placeholder="Enter total box count"
                required
                {...form.getInputProps("totalBox")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                label="Total Weight"
                placeholder="Enter total weight"
                required
                step={0.01}
                {...form.getInputProps("totalWeight")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                label="Cost per Kg"
                placeholder="Enter cost per kg"
                required
                step={0.01}
                {...form.getInputProps("costPerKg")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                label="Cost Per Ky Currency"
                placeholder="Cost Per Ky Currency"
                data={currencies.map((c) => c.currency_code)}
                searchable
                clearable
                value={selectedCPKCurrency}
                error={form.errors.costPerKgCurrency}
                onChange={(value) => {
                  if (value) {
                    const selectedData = currencies.find(
                      (d) => d.currency_code === value
                    );

                    form.setFieldValue(
                      "costPerKgCurrency",
                      selectedData?.currency_code || ""
                    );

                    setSelectedCPKCurrency(selectedData?.currency_code || "");
                  } else {
                    form.setFieldValue("costPerKgCurrency", "");
                    setSelectedCPKCurrency("");
                  }
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                label="Exchange Rate"
                placeholder="Enter exchange rate"
                required={false}
                disabled
                step={0.01}
                {...form.getInputProps("exchangeRate")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                label="Amount Paid"
                placeholder="Enter amount paid"
                required
                step={0.01}
                {...form.getInputProps("amountPaid")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                label="Payment Currency"
                placeholder="Payment Currency"
                data={currencies.map((c) => c.currency_code)}
                searchable
                clearable
                value={selectedPCurrency}
                error={form.errors.costPerKgCurrency}
                onChange={(value) => {
                  if (value) {
                    const selectedData = currencies.find(
                      (d) => d.currency_code === value
                    );

                    form.setFieldValue(
                      "paymentCurrency",
                      selectedData?.currency_code || ""
                    );

                    setSelectedPCurrency(selectedData?.currency_code || "");
                  } else {
                    form.setFieldValue("paymentCurrency", "");
                    setSelectedPCurrency("");
                  }
                }}
              />
            </Grid.Col>

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

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Button fullWidth mt="xl" type="submit" disabled={isLoading}>
                Submit
              </Button>
            </Grid.Col>
          </Grid>
        </Paper>
      </form>
    </div>
  );
};

export default ReceiptForm;
