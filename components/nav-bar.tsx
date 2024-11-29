import {
  IconGauge,
  IconLock,
  IconReceipt,
  IconUsers,
  IconUserStar,
} from "@tabler/icons-react";
import { ScrollArea } from "@mantine/core";
import classes from "../style/NavbarNested.module.css";
import { UserButton } from "./user-button";
import { LinksGroup, LinksGroupProps } from "./links-group";
import { useSession } from "next-auth/react";

export function NavbarNested() {
  const { data: session } = useSession();

  const mockdata: LinksGroupProps[] = [
    { label: "Dashboard", icon: IconGauge, link: "/home/dashboard" },
    { label: "Customers", icon: IconUsers, link: "/home/customers" },
    ...(session?.user.isSuperUser
      ? [
          {
            label: "Staffs",
            icon: IconUserStar,
            link: "/home/staffs",
          },
        ]
      : []),
    { label: "Receipts", icon: IconReceipt, link: "/home/receipts" },
    {
      label: "Security",
      icon: IconLock,
      links: [
        { label: "Change password", link: "/home/security/change-password" },
        { label: "Recovery codes", link: "/home/security/recovery-codes" },
      ],
    },
  ];

  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <nav className={classes.navbar}>
      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}
