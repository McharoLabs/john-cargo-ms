import LoginForm from "@/components/login-form.client";
import React from "react";

const LoginPage = async () => {
  // await db.insert(userTable).values({
  //   firstName: "Godfrey",
  //   lastName: "Mcharo",
  //   email: "mcharo@gmail.com",
  //   contact: "0717251140",
  //   codeNumber: (await generateTimestampCode()).codeNumber,
  //   password: "$2a$10$NPDrzyC20Bi2jmV8fWURpeL8DTDJiWJq2m225WllIiTwr.KLtiMBK",
  // });
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
