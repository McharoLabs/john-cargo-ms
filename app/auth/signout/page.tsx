import { useEffect } from "react";
import { useRouter } from "next/router";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { signOut } = NextAuth(authConfig);

const AutoSignOut = () => {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      signOut({ redirect: false });
      router.push("/auth/signin");
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
};

export default AutoSignOut;
