import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from ".";

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "./db/migrations" });
    console.log("Migration completed");
  } catch (error) {
    console.error("Error during migraton", error);
    process.exit(1);
  }
};

main();
