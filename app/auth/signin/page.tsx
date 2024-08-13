import LoginForm from "@/components/login-form.client";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import React from "react";

const LoginPage = async () => {
  // await db.insert(userTable).values({
  //   firstName: "Test",
  //   lastName: "User",
  //   email: "test@gmail.com",
  //   contact: "0717251140",
  //   password: "$2a$10$NPDrzyC20Bi2jmV8fWURpeL8DTDJiWJq2m225WllIiTwr.KLtiMBK",
  // });
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
