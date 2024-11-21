"use client";
import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Image,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";
import cx from "clsx";
import classes from "../style/BasicAppShell.module.css";
import { NavbarNested } from "./nav-bar";

type BasicAppShellProps = {
  children: React.ReactNode;
};

const BasicAppShell: React.FC<BasicAppShellProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const [activeLogo, setActiveLogo] = React.useState<string>("");
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });

  React.useEffect(() => {
    setActiveLogo(colorScheme === "dark" ? "light-logo.png" : "dark-logo.png");
  }, [colorScheme]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Image src={`/${activeLogo}`} width={50} height={50} alt="logo" />
          </Group>

          <ActionIcon
            onClick={() =>
              setColorScheme(computedColorScheme === "light" ? "dark" : "light")
            }
            variant="default"
            size="xl"
            aria-label="Toggle color scheme"
          >
            <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
            <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
          </ActionIcon>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <NavbarNested />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default BasicAppShell;
