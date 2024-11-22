import { useState } from "react";
import { IconCalendarStats, IconChevronRight } from "@tabler/icons-react";
import { Box, Collapse, Group, ThemeIcon, UnstyledButton } from "@mantine/core";
import { useRouter, usePathname } from "next/navigation";
import classes from "../style/NavbarLinksGroup.module.css";

export interface LinksGroupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  label: string;
  link?: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  link,
  initiallyOpened,
  links,
}: LinksGroupProps) {
  const router = useRouter();
  const pathname = usePathname();

  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState<boolean>(initiallyOpened || false);
  const isActive = pathname === link;

  const items = (hasLinks ? links : []).map((subLink) => (
    <div
      key={subLink.label}
      className={`${classes.link} ${
        pathname === subLink.link ? classes.active : ""
      }`}
      onClick={() => router.push(subLink.link)}
    >
      {subLink.label}
    </div>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={`${classes.control} ${isActive ? classes.active : ""}`}
      >
        <Group
          justify="space-between"
          gap={0}
          onClick={() => {
            if (!hasLinks && link) router.push(link);
          }}
        >
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? "rotate(-90deg)" : "none" }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

const mockdata = {
  label: "Releases",
  icon: IconCalendarStats,
  links: [
    { label: "Upcoming releases", link: "/" },
    { label: "Previous releases", link: "/" },
    { label: "Releases schedule", link: "/" },
  ],
};

export function NavbarLinksGroup() {
  return (
    <Box mih={220} p="md">
      <LinksGroup {...mockdata} />
    </Box>
  );
}
