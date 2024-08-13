import React from "react";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav></nav>
      <aside></aside>
      {children}
    </div>
  );
}
