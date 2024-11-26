"use client";
import {
  CustomerSchema,
  CustomerSchemaType,
} from "@/lib/z-schema/customer.schema";
import { useForm, zodResolver } from "@mantine/form";
import React from "react";
import {
  showLoadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from "./notificationUtils";
import { create } from "@/actions/customer.server.action";
import { Button, Grid, Paper, TextInput, Title } from "@mantine/core";

const CustomerForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  // Initialize form with validation
  const form = useForm<CustomerSchemaType>({
    initialValues: {
      firstName: "",
      lastName: "",
      contact: "",
      email: "",
      region: "",
      district: "",
    },
    validate: zodResolver(CustomerSchema),
  });

  const handleSubmit = async (values: CustomerSchemaType) => {
    setIsLoading(true);
    const notificationProps = {
      id: "customer-form-submission",
      title: "Submitting your form",
      message: "Please wait...",
    };

    showLoadingNotification(notificationProps);

    try {
      const result = await create(values);
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
            issue.path[0] as keyof CustomerSchemaType,
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
  return (
    <div>
      <Title ta="start" mb="lg" size={24}>
        Add New Customer
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                required
                {...form.getInputProps("firstName")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                required
                {...form.getInputProps("lastName")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Contact"
                type="tel"
                placeholder="Enter contact number"
                required
                {...form.getInputProps("contact")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Email"
                placeholder="Enter email"
                type="email"
                required
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Region"
                placeholder="Enter region"
                required
                {...form.getInputProps("region")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="District"
                placeholder="Enter district"
                required
                {...form.getInputProps("district")}
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

export default CustomerForm;
