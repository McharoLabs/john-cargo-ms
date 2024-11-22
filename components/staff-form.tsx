"use client";

import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Paper,
  Title,
  Container,
  Box,
  LoadingOverlay,
  Grid,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { StaffsSchema, StaffsSchemaType } from "@/lib/z-schema/staff.schema";
import { create } from "@/actions/staff.server.action";
// import {
//   showLoadingNotification,
//   updateErrorNotification,
//   updateSuccessNotification,
// } from "./notificationUtils";

function StaffFormPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with validation
  const form = useForm<StaffsSchemaType>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      password: "",
      isSuperUser: false,
      department: "",
    },
    validate: zodResolver(StaffsSchema),
  });

  const handleSubmit = async (values: StaffsSchemaType) => {
    // const notificationProps = {
    //   id: "staff-form-submission",
    //   title: "Submitting your form",
    //   message: "Please wait...",
    // };

    // showLoadingNotification(notificationProps);

    try {
      // const result = await create(values);
      //   if (result.success) {
      //     // updateSuccessNotification({
      //     //   ...notificationProps,
      //     //   title: "Form submitted successfully",
      //     //   message: "Your data has been saved!",
      //     // });
      //   } else if (result.issues) {
      //     result.issues.forEach((issue) => {
      //       form.setFieldError(
      //         issue.path[0] as keyof StaffsSchemaType,
      //         issue.message
      //       );
      //     });
      //   } else {
      //     // updateErrorNotification({
      //     //   ...notificationProps,
      //     //   title: "Submission failed",
      //     //   message: result.detail || "There was an issue with your submission.",
      //     // });
      //   }
    } catch (error) {
      console.error("Error:", error);

      //   updateErrorNotification({
      //     ...notificationProps,
      //     title: "An error occurred",
      //     message: "Please try again later.",
      //   });
    }
  };

  return (
    <Container>
      <Title ta="start" mb="lg" size={16}>
        Add New Staff
      </Title>
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Paper withBorder shadow="md" p={30} radius="md">
            <Grid>
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
                  mt="md"
                  {...form.getInputProps("lastName")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <TextInput
                  label="Email"
                  placeholder="Enter email"
                  type="email"
                  required
                  mt="md"
                  {...form.getInputProps("email")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <TextInput
                  label="Contact"
                  type="tel"
                  placeholder="Enter contact number"
                  required
                  mt="md"
                  {...form.getInputProps("contact")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <PasswordInput
                  label="Password"
                  placeholder="Enter password (optional)"
                  mt="md"
                  {...form.getInputProps("password")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <TextInput
                  label="Department"
                  placeholder="Enter department (optional)"
                  mt="md"
                  {...form.getInputProps("department")}
                />
              </Grid.Col>

              <Grid.Col>
                <Checkbox
                  label="Is Super User"
                  mt="md"
                  {...form.getInputProps("isSuperUser", { type: "checkbox" })}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Button fullWidth mt="xl" type="submit">
                  Submit
                </Button>
              </Grid.Col>
            </Grid>
          </Paper>
        </form>
      </Box>
    </Container>
  );
}

export default StaffFormPage;
