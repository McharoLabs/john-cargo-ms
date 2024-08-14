import TopAsideBar from "@/components/top-aside-bar";
import React from "react";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TopAsideBar />
      <div className="p-4 sm:ml-64 ">
        <div className="p-4 rounded-lg  mt-14 ">{children}</div>
      </div>
    </div>
  );
}
