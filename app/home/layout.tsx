import { auth } from "@/auth";
import TopAsideBar from "@/components/top-aside-bar";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session && session.user) {
    session.user = {
      email: session.user.email,
      id: session.user.id,
      name: session.user.name,
      isSuperUser: session.user.isSuperUser,
      user: {},
      expires: session.expires,
    };
  }
  return (
    <SessionProvider basePath={process.env.BASE_PATH} session={session}>
      <TopAsideBar />
      <div className="p-4 sm:ml-64 ">
        <div className="p-4 rounded-lg  mt-14  ">{children}</div>
      </div>
    </SessionProvider>
  );
}
