import { create } from "@/actions/staff.server.action";
import { StaffsSchemaType } from "@/lib/z-schema/staff.schema";

async function main() {
  const userData: StaffsSchemaType = {
    firstName: "John",
    lastName: "Cargo",
    email: "john@gmail.com",
    contact: "0717251140",
    isSuperUser: true,
    department: null,
  };

  try {
    const result = await create(userData);

    if (result.success) {
      console.log(result.detail);
      process.exit();
    } else {
      console.error("Failed to create staff:", result.detail, result.issues);
      process.exit();
    }
  } catch (error) {
    console.error("Failed to create staff:", error);
    process.exit(1);
  }
}

main();
