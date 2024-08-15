import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";


export const metadata: Metadata = {
  title: "JC",
  description: "Jogn Cargo App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <SessionProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
