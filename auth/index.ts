import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { compare } from "bcrypt-ts";
import { findByEmail } from "@/services/staff.service";
import { appConfig } from "@/config/app.config";

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await findByEmail({ email: credentials.email as string });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          ...user,
          isSuperUser: user.isSuperUser,
        };
      },
    }),
  ],
  basePath: appConfig.basePath,
  secret: appConfig.secret,
  pages: { signIn: "/auth/signin" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.staffId,
          isSuperUser: user.isSuperUser,
          name: user.firstName?.concat(" ").concat(user.lastName!),
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

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(authOptions);
