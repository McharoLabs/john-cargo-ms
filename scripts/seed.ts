import { createUser } from "@/actions/user-actions";

async function main() {
  const userData = {
    firstName: "John",
    lastName: "Cargo",
    email: "jogn@gmail.com",
    contact: "0717251140",
    isStaff: true,
  };

  try {
    const result = await createUser(userData);

    if (result.success) {
      console.log(result.detail);
      process.exit();
    } else {
      console.error("User creation failed:", result.detail, result.issues);
      process.exit();
    }
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit();
  }
}

main();
