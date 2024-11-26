"use client";

import React from "react";
import { TextInput, Button, Paper, Title, Grid } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  CurrencySchema,
  CurrencySchemaType,
} from "@/lib/z-schema/currency.schema";
import { createCurrency } from "@/actions/currency.server.action";
import {
  showLoadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from "./notificationUtils";

function CurrencyForm() {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<CurrencySchemaType>({
    initialValues: {
      currency_id: undefined,
      currency_code: "",
      currency_name: "",
      symbol: "",
      rate_to_tzs: "",
    },
    validate: zodResolver(CurrencySchema),
  });

  const handleSubmit = async (values: CurrencySchemaType) => {
    setIsLoading(true);
    const notificationProps = {
      id: "currency-form-submission",
      title: "Submitting your form",
      message: "Please wait...",
    };

    showLoadingNotification(notificationProps);

    try {
      const result = await createCurrency(values);

      if (result.success) {
        updateSuccessNotification({
          ...notificationProps,
          title: "Currency created successfully",
          message: "Your currency has been added!",
        });
        form.reset();
      } else if (result.issues) {
        result.issues.forEach((issue) => {
          form.setFieldError(
            issue.path[0] as keyof CurrencySchemaType,
            issue.message
          );
        });
        updateErrorNotification({
          ...notificationProps,
          title: "Submission failed",
          message: "There were validation errors.",
        });
      } else {
        updateErrorNotification({
          ...notificationProps,
          title: "Submission failed",
          message: result.message || "Failed to submit the form.",
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

  return (
    <div>
      <Title ta="start" mb="lg" size={24}>
        Add New Currency
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Currency Code"
                placeholder="Enter currency code (e.g., USD)"
                required
                {...form.getInputProps("currency_code")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Currency Name"
                placeholder="Enter currency name (e.g., US Dollar)"
                required
                {...form.getInputProps("currency_name")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Symbol"
                placeholder="Enter symbol (e.g., $)"
                required
                {...form.getInputProps("symbol")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Rate To TZS"
                placeholder="Enter rate to tzs"
                required
                {...form.getInputProps("rate_to_tzs")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Button fullWidth mt="xl" type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </Grid.Col>
          </Grid>
        </Paper>
      </form>
    </div>
  );
}

export default CurrencyForm;
