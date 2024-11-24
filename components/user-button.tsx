import { IconChevronRight, IconLogout2 } from "@tabler/icons-react";
import { Avatar, Group, Menu, rem, Text, UnstyledButton } from "@mantine/core";
import classes from "../style/UserButton.module.css";
import { useSession } from "next-auth/react";
import React from "react";
import { redirect } from "next/navigation";
import { signOut } from "@/auth/helper";

export function UserButton() {
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/api/auth/signin");
    }
  }, [session, status]);

  return (
    <Menu
      position="top"
      offset={10}
      transitionProps={{ transition: "rotate-right", duration: 150 }}
      withArrow
      width={250}
    >
      <Menu.Target>
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
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item
          leftSection={
            <IconLogout2 style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={async () => {
            await signOut();
            window.location.reload();
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
