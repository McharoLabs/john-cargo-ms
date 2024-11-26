"use client";
import React from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Container,
  Group,
  Button,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import classes from "../style/AuthenticationTitle.module.css";
import { useForm } from "@mantine/form";
import { loginAction } from "@/actions/auth.server.action";
import { LoginFormSchemaType } from "@/lib/z-schema/staff.schema";

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<LoginFormSchemaType>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
          ? null
          : "Invalid email",
      password: (value) => (!value ? "Password is required" : null),
    },
  });

  const handleLogin = async (values: LoginFormSchemaType) => {
    setIsLoading(true);
    form.clearErrors();

    const res = await loginAction(values);

    if (res && res.success === false) {
      if (res.issues) {
        res.issues.forEach((issue) => {
          form.setFieldError(
            issue.path[0] as keyof LoginFormSchemaType,
            issue.message
          );
        });
      }
      setIsLoading(false);
      return;
    }

    form.clearErrors();

    setIsLoading(false);
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <form onSubmit={form.onSubmit(handleLogin)}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              type="email"
              label="Email"
              placeholder="you@company.com"
              required
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me" />
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl" type="submit">
              Sign in
            </Button>
          </Paper>
        </form>
      </Box>
    </Container>
  );
}
