import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const reqUrl = new URL(req.url);

  if (reqUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (!req.auth && reqUrl.pathname !== "/auth/signin") {
    return NextResponse.redirect(
      new URL(
        `/api/auth/signin?callbackUrl=${encodeURIComponent(reqUrl?.pathname)}`,
        req.url
      )
    );
  }

  if (!req.auth?.user.isSuperUser && reqUrl.pathname === "/home/users") {
    return NextResponse.redirect(new URL("/auth/401", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
