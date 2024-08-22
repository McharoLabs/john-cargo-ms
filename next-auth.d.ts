// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      isSuperUser?: boolean;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    isSuperUser?: boolean;
    userId?: string;
    firstName?: string;
    lastName?: string;
  }
}

export interface DBCredentials {
  url: string;
  authToken?: string;
  connectionString?: string;
}
