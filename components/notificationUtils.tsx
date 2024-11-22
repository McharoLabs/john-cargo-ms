"use client";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { rem } from "@mantine/core";

interface NotificationProps {
  id: string;
  title: string;
  message: string;
}

export const showLoadingNotification = ({
  id,
  title,
  message,
}: NotificationProps) => {
  notifications.show({
    id,
    loading: true,
    title,
    message,
    autoClose: false,
    withCloseButton: false,
  });
};

export const updateSuccessNotification = ({
  id,
  title,
  message,
}: NotificationProps) => {
  notifications.update({
    id,
    color: "teal",
    title,
    message,
    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
    loading: false,
    autoClose: 2000,
  });
};

export const updateErrorNotification = ({
  id,
  title,
  message,
}: NotificationProps) => {
  notifications.update({
    id,
    color: "red",
    title,
    message,
    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
    loading: false,
    autoClose: 3000,
  });
};
