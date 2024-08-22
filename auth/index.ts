import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { compare } from "bcrypt-ts";
import { findUserByEmail } from "@/actions/auth.action";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir, true);

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await findUserByEmail({
          email: credentials.email as string,
        });

        if (!user || !user.password) {
          return null;
        }

        if (user.isSuperUser === null) {
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
  basePath: process.env.BASE_PATH,
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/auth/signin", verifyRequest: "/auth/verify-request" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.userId,
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
