import { auth } from "@/auth";
import React from "react";

export default async function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-blue-500">
      <nav>gygjhghj</nav>
      <aside></aside>
      {children}
    </div>
  );
}
