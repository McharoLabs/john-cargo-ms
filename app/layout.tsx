import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { appConfig } from "@/config/app.config";
import { Notifications } from "@mantine/notifications";
import { Providers } from "./GlobalRedux/provider";

export const metadata: Metadata = {
  title: appConfig.appName,
  description: "John Cargo Receipt Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Notifications limit={5} position="bottom-left" autoClose={400} />
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
