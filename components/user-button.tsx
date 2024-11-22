import { IconChevronRight } from "@tabler/icons-react";
import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import classes from "../style/UserButton.module.css";
import { useSession } from "next-auth/react";
import React from "react";
import { redirect } from "next/navigation";

export function UserButton() {
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/api/auth/signin");
    }
  }, [session, status]);

  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar src="/admin.png" radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {session?.user.name}
          </Text>

          <Text c="dimmed" size="xs">
            {session?.user.email}
          </Text>
        </div>

        <IconChevronRight size={14} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}
