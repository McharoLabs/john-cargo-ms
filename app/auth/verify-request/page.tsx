import { auth } from "@/auth";
import { redirect } from "next/navigation";

const VerifyRequest = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  } else if (session.user.isSuperUser) {
    redirect("/manage/dashboard");
  } else {
    redirect("/home/dashboard");
  }
};

export default VerifyRequest;
