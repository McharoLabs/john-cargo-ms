import { auth } from "@/auth";
import { redirect } from "next/navigation";

const VerifyRequest = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  } else if (session.user.isSuperUser) {
    redirect("/manage/dashboard");
  } else if (!session.user.isSuperUser) {
    redirect("/home/dashboard");
  } else {
    redirect("/auth/401");
  }
};

export default VerifyRequest;
