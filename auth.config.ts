import { DefaultSession, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { appConfig } from "./config/app.config";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Credentials not provided");
          return null;
        }

        return {};
      },
    }),
  ],
  secret: appConfig.secret,
  pages: { signIn: "/login" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.staffId,
          isSuperUser: user.isSuperUser,
          name: user.name,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          isSuperUser: token.isSuperUser,
          name: token.name,
          email: token.email,
        },
      } as DefaultSession;
    },
  },
};
