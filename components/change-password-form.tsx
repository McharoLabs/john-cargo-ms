"use client";

import { Button, Paper, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import {
  showLoadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from "./notificationUtils";
import { ResetPasswordFormType } from "@/lib/z-schema/reset-password";
import { resetPassword } from "@/actions/staff.server.action";
import { signOut } from "@/auth/helper";

const ChangePasswordForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm<ResetPasswordFormType>({
    name: "reset-password-form",
    mode: "controlled",
    initialValues: {
      confirmPassword: "",
      newPassword: "",
      oldPassword: "",
    },
    validate: {
      confirmPassword: (value, state) =>
        value.length === 0
          ? "Please re-type your password"
          : value !== state.newPassword
          ? "Passwords do not match"
          : null,
      newPassword: (value) => {
        if (value.length === 0) {
          return "New Password required";
        }

        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        return strongPasswordRegex.test(value)
          ? null
          : "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
      },
      oldPassword: (value) =>
        value.length === 0 ? "Current password required" : null,
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    const notificationProps = {
      id: "reset-password-form-submission",
      title: "Submitting your form",
      message: "Please wait...",
    };
    showLoadingNotification(notificationProps);
    try {
      const result = await resetPassword(values);
      if (result.success) {
        updateSuccessNotification({
          ...notificationProps,
          title: "Form submitted successfully",
          message: result.detail || "Password changed successful",
        });

        form.reset();
        setTimeout(() => {
          signOutStaff();
        }, 2000);
      } else if (result.issues) {
        result.issues.forEach((issue) => {
          form.setFieldError(
            issue.path[0] as keyof ResetPasswordFormType,
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

  const signOutStaff = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <PasswordInput
          label="Current Password"
          placeholder="Your password"
          value={form.values.oldPassword}
          error={form.errors.oldPassword}
          onChange={(event) =>
            form.setFieldValue("oldPassword", event.currentTarget.value)
          }
          mt="md"
        />
        <PasswordInput
          label="New Password"
          placeholder="Your password"
          value={form.values.newPassword}
          error={form.errors.newPassword}
          onChange={(event) =>
            form.setFieldValue("newPassword", event.currentTarget.value)
          }
          mt="md"
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Your password"
          value={form.values.confirmPassword}
          error={form.errors.confirmPassword}
          onChange={(event) =>
            form.setFieldValue("confirmPassword", event.currentTarget.value)
          }
          mt="md"
        />

        <Button fullWidth mt="xl" type="submit" disabled={isLoading}>
          {isLoading ? "Reseting..." : "Submit"}
        </Button>
      </form>
    </Paper>
  );
};

export default ChangePasswordForm;
